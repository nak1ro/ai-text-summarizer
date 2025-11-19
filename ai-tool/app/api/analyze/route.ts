import {NextRequest, NextResponse} from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';
import mammoth from 'mammoth';
import {AnalyzeRequest, AnalyzeResponse, AnalysisResult} from '@/types';
import {
    calculateReadingTime,
    calculateSpeakingTime,
    countWords,
    countUniqueWords,
    calculateAverageSentenceLength,
    getMostFrequentWords,
} from '@/lib/utils';
import {createErrorResponse, requireEnvVar} from '@/lib/errorHandler';
import {
    ValidationError,
    NetworkError,
    ApiError,
    FileError,
    normalizeError,
} from '@/lib/errors';
import {ERROR_MESSAGES} from '@/lib/errorMessages';

const {PdfReader} = require('pdfreader');

const MAX_CHARS = 50000;
const YOUTUBE_REGEX =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function fetchYouTubeTranscript(youtubeUrl: string): Promise<string> {
    const match = youtubeUrl.match(YOUTUBE_REGEX);
    if (!match) {
        throw new ValidationError(ERROR_MESSAGES.YOUTUBE.INVALID_URL);
    }

    const apiKey = requireEnvVar('SEARCHAPI_API_KEY');

    const videoId = match[4];

    try {
        const searchApiResponse = await axios.get(
            'https://www.searchapi.io/api/v1/search',
            {
                params: {
                    engine: 'youtube_transcripts',
                    video_id: videoId,
                    api_key: apiKey,
                },
                timeout: 30000,
            }
        );

        const transcripts = searchApiResponse.data?.transcripts;
        if (!Array.isArray(transcripts) || transcripts.length === 0) {
            throw new ValidationError(ERROR_MESSAGES.YOUTUBE.NO_TRANSCRIPT);
        }

        const transcriptText = transcripts
            .map((segment: { text?: string }) => segment.text || '')
            .filter(Boolean)
            .join(' ');

        if (!transcriptText.trim()) {
            throw new ValidationError(ERROR_MESSAGES.YOUTUBE.EMPTY_TRANSCRIPT);
        }

        return transcriptText;
    } catch (youtubeError: any) {
        // If it's already an AppError, rethrow it
        if (youtubeError instanceof ValidationError) {
            throw youtubeError;
        }

        if (axios.isAxiosError(youtubeError)) {
            if (youtubeError.code === 'ECONNABORTED') {
                throw new NetworkError(ERROR_MESSAGES.YOUTUBE.TIMEOUT, youtubeError);
            }

            const status = youtubeError.response?.status;
            const apiError = youtubeError.response?.data?.error;

            if (status === 401) {
                throw new ApiError(ERROR_MESSAGES.API.SEARCHAPI_INVALID_KEY, youtubeError, 500);
            }

            if (status === 403) {
                throw new ApiError(ERROR_MESSAGES.API.SEARCHAPI_ACCESS_DENIED, youtubeError, 500);
            }

            if (apiError) {
                throw new ApiError(ERROR_MESSAGES.API.SEARCHAPI_ERROR(apiError), youtubeError, 500);
            }
        }

        throw new NetworkError(ERROR_MESSAGES.YOUTUBE.FETCH_FAILED, youtubeError);
    }
}

async function extractDocumentText(
    base64Document: string,
    documentName: string
): Promise<string> {
    const base64Data = base64Document.includes(',')
        ? base64Document.split(',')[1]
        : base64Document;

    const buffer = Buffer.from(base64Data, 'base64');
    const extension = documentName.split('.').pop()?.toLowerCase();

    if (!extension) {
        throw new FileError(ERROR_MESSAGES.DOCUMENT.UNKNOWN_TYPE);
    }

    let extractedContent = '';

    if (extension === 'pdf') {
        extractedContent = await new Promise<string>((resolve, reject) => {
            const textItems: string[] = [];
            new PdfReader().parseBuffer(buffer, (err: Error | null, item: any) => {
                if (err) {
                    reject(err);
                } else if (!item) {
                    resolve(textItems.join(' '));
                } else if (item.text) {
                    textItems.push(item.text);
                }
            });
        });
    } else if (extension === 'docx') {
        const result = await mammoth.extractRawText({buffer});
        extractedContent = result.value;
    } else if (extension === 'doc') {
        try {
            const result = await mammoth.extractRawText({buffer});
            extractedContent = result.value;
        } catch (error) {
            throw new FileError(ERROR_MESSAGES.FILE.LEGACY_DOC_UNSUPPORTED, error);
        }
    } else if (extension === 'txt') {
        extractedContent = buffer.toString('utf-8');
    } else {
        throw new FileError(ERROR_MESSAGES.FILE.UNSUPPORTED_FORMAT);
    }

    if (!extractedContent.trim()) {
        throw new FileError(ERROR_MESSAGES.FILE.NO_TEXT_EXTRACTED);
    }

    return extractedContent;
}

async function extractImageText(image: string): Promise<string> {
    try {
        const visionResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: 'Extract all text from this image. If there is no text in the image, respond with exactly: "NO_TEXT_FOUND". Otherwise, return only the extracted text without any additional commentary.',
                        },
                        {
                            type: 'image_url',
                            image_url: {url: image},
                        },
                    ],
                },
            ],
            max_tokens: 1000,
        });

        const extractedContent =
            visionResponse.choices[0]?.message?.content?.trim() ?? '';

        if (!extractedContent || extractedContent === 'NO_TEXT_FOUND') {
            throw new FileError(ERROR_MESSAGES.FILE.NO_TEXT_IN_IMAGE);
        }

        return extractedContent;
    } catch (visionError) {
        // If it's already an AppError, rethrow it
        if (visionError instanceof FileError) {
            throw visionError;
        }
        throw new ApiError(ERROR_MESSAGES.API.VISION_API_FAILED, visionError);
    }
}

function buildPrompt(text: string): string {
    return `You are an AI text analysis assistant. Your task is to analyze the user's input text and return all results strictly in the JSON structure described below.

Your goals:
1. Provide a detailed and complete summary that captures all major ideas, arguments, and important context from the text. The summary should be fuller and more informative than a minimal short summary, while still staying clear and focused.
2. Extract the most important key points as bullet list items.
3. Give a simple, easy-to-understand explanation of the text, written in plain language so that anyone can understand it.
4. Estimate the reading time in minutes (round up to the nearest whole number).
5. Perform a comprehensive reading complexity analysis:
   - Assess sentence structure complexity (simple, compound, complex sentences)
   - Evaluate vocabulary difficulty (common words vs. technical/specialized terms)
   - Analyze conceptual density (how many ideas per sentence/paragraph)
   - Consider syntactic complexity (sentence length, clause structure)
   - Determine appropriate grade level based on Flesch-Kincaid scale
   - Provide format: "Grade level (descriptor)" where descriptor indicates difficulty

Follow these rules:
- The output MUST be valid JSON.
- DO NOT include text outside the JSON object.
- DO NOT use markdown formatting inside the JSON.
- The summary should be well-developed but not overly long.
- The explanation must remain simple and beginner-friendly.
- Key points must be a clean array of strings.
- For reading_time_minutes, output only a number.
- For reading_level, analyze sentence structure, vocabulary, and conceptual complexity to determine accurate grade level
- Use format: "7th grade (easy to understand)" or "College level (advanced)" or "Graduate level (highly technical)".

Expected JSON structure:
{
  "summary": "...",
  "key_points": ["...", "...", "..."],
  "explanation": "...",
  "reading_time_minutes": 4,
  "reading_level": "7th grade (easy to understand)"
}

Now analyze the following text:

${text}`;
}

function buildAnalysisResult(
    text: string,
    parsedResponse: any
): AnalysisResult {
    const readingTime =
        parsedResponse.reading_time_minutes ?? calculateReadingTime(text);
    const speakingTime = calculateSpeakingTime(text);
    const wordCount = countWords(text);
    const uniqueWords = countUniqueWords(text);
    const averageSentenceLength = calculateAverageSentenceLength(text);
    const topWords = getMostFrequentWords(text, 15);
    const readingLevel =
        parsedResponse.reading_level ?? 'General audience';

    return {
        summary: parsedResponse.summary ?? 'No summary available',
        keyPoints: Array.isArray(parsedResponse.key_points)
            ? parsedResponse.key_points
            : [],
        explanation:
            parsedResponse.explanation ?? 'No explanation available',
        readingTime,
        wordCount,
        readingLevel,
        speakingTime,
        uniqueWords,
        averageSentenceLength,
        topWords,
    };
}

export async function POST(request: NextRequest) {
    try {
        const body: AnalyzeRequest = await request.json();
        const {
            text: inputText,
            image,
            document,
            documentName,
            youtubeUrl,
        } = body;

        let text = inputText ?? '';
        let extractedText: string | undefined;

        if (youtubeUrl) {
            const transcript = await fetchYouTubeTranscript(youtubeUrl);
            text = transcript;
            extractedText = transcript;
        } else if (document && documentName) {
            const content = await extractDocumentText(document, documentName);
            text = content;
            extractedText = content;
        } else if (image) {
            const content = await extractImageText(image);
            text = content;
            extractedText = content;
        }

        if (!text || !text.trim()) {
            throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_INPUT);
        }

        if (text.length > MAX_CHARS) {
            throw new ValidationError(ERROR_MESSAGES.VALIDATION.TEXT_TOO_LONG(MAX_CHARS));
        }

        if (text.trim().length < 10) {
            throw new ValidationError(ERROR_MESSAGES.VALIDATION.TEXT_TOO_SHORT);
        }

        requireEnvVar('OPENAI_API_KEY');

        const prompt = buildPrompt(text);

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a helpful assistant that analyzes text and responds only with valid JSON. ' +
                        'Never include markdown formatting or code blocks in your response, only raw JSON.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 1000,
            response_format: {type: 'json_object'},
        });

        const aiResponse = completion.choices[0]?.message?.content;
        if (!aiResponse) {
            throw new ApiError(ERROR_MESSAGES.API.NO_RESPONSE);
        }

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(aiResponse);
        } catch (parseError) {
            throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_JSON, parseError);
        }

        const result = buildAnalysisResult(text, parsedResponse);

        return NextResponse.json<AnalyzeResponse>(
            {
                success: true,
                data: result,
                extractedText,
            },
            {status: 200}
        );
    } catch (error) {
        // If it's already a NextResponse (from createErrorResponse), return it
        if (error instanceof NextResponse) {
            return error;
        }

        return createErrorResponse(error);
    }
}
