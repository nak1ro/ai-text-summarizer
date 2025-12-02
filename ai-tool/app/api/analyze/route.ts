import {NextRequest, NextResponse} from 'next/server';
import OpenAI from 'openai';
import axios, {AxiosError} from 'axios';
import mammoth from 'mammoth';
import {
    AnalyzeRequest,
    AnalyzeResponse,
    AnalysisResult,
    SummaryLength,
    AnalysisStyle,
} from '@/types';
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
    FileError
} from '@/lib/errors';
import {ERROR_MESSAGES} from '@/lib/errorMessages';
import {PdfReader} from 'pdfreader';

const MAX_CHARS = 50000;
const YOUTUBE_REGEX =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type AiAnalysisResponse = {
    summary?: string;
    key_points?: string[];
    explanation?: string;
    reading_time_minutes?: number;
    reading_level?: string;
};

type TextSourceResult = {
    text: string;
    extractedText?: string;
};

function getYouTubeVideoId(url: string): string {
    const match = url.match(YOUTUBE_REGEX);
    if (!match) {
        throw new ValidationError(ERROR_MESSAGES.YOUTUBE.INVALID_URL);
    }
    return match[4];
}

function handleSearchApiAxiosError(error: AxiosError): never {
    if (error.code === 'ECONNABORTED') {
        throw new NetworkError(ERROR_MESSAGES.YOUTUBE.TIMEOUT, error);
    }

    const status = error.response?.status;
    const apiError = (error.response?.data as { error?: string } | undefined)?.error;

    if (status === 401) {
        throw new ApiError(ERROR_MESSAGES.API.SEARCHAPI_INVALID_KEY, error, 500);
    }

    if (status === 403) {
        throw new ApiError(ERROR_MESSAGES.API.SEARCHAPI_ACCESS_DENIED, error, 500);
    }

    if (apiError) {
        throw new ApiError(ERROR_MESSAGES.API.SEARCHAPI_ERROR(apiError), error, 500);
    }

    throw new NetworkError(ERROR_MESSAGES.YOUTUBE.FETCH_FAILED, error);
}

async function fetchYouTubeTranscript(youtubeUrl: string): Promise<string> {
    const apiKey = requireEnvVar('SEARCHAPI_API_KEY');
    const videoId = getYouTubeVideoId(youtubeUrl);

    try {
        const searchApiResponse = await axios.get('https://www.searchapi.io/api/v1/search', {
            params: {
                engine: 'youtube_transcripts',
                video_id: videoId,
                api_key: apiKey,
            },
            timeout: 30000,
        });

        const transcripts = (searchApiResponse.data as { transcripts?: { text?: string }[] })
            ?.transcripts;

        if (!Array.isArray(transcripts) || transcripts.length === 0) {
            throw new ValidationError(ERROR_MESSAGES.YOUTUBE.NO_TRANSCRIPT);
        }

        const transcriptText = transcripts
            .map((segment) => segment.text || '')
            .filter(Boolean)
            .join(' ');

        if (!transcriptText.trim()) {
            throw new ValidationError(ERROR_MESSAGES.YOUTUBE.EMPTY_TRANSCRIPT);
        }

        return transcriptText;
    } catch (youtubeError: unknown) {
        if (youtubeError instanceof ValidationError) {
            throw youtubeError;
        }

        if (axios.isAxiosError(youtubeError)) {
            handleSearchApiAxiosError(youtubeError);
        }

        throw new NetworkError(ERROR_MESSAGES.YOUTUBE.FETCH_FAILED, youtubeError);
    }
}

function getBase64Buffer(base64Document: string): Buffer {
    const base64Data = base64Document.includes(',')
        ? base64Document.split(',')[1]
        : base64Document;
    return Buffer.from(base64Data, 'base64');
}

function getFileExtension(documentName: string): string {
    const extension = documentName.split('.').pop()?.toLowerCase();
    if (!extension) {
        throw new FileError(ERROR_MESSAGES.DOCUMENT.UNKNOWN_TYPE);
    }
    return extension;
}

async function extractPdfText(buffer: Buffer): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const textItems: string[] = [];

        new PdfReader().parseBuffer(
            buffer,
            (err: unknown, item: unknown) => {
                if (err != null) {
                    reject(err);
                    return;
                }

                const typedItem = item as { text?: string } | null;

                if (!typedItem) {
                    resolve(textItems.join(' '));
                    return;
                }

                if (typedItem.text) {
                    textItems.push(typedItem.text);
                }
            }
        );
    });
}


async function extractWithMammoth(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({buffer});
    return result.value;
}

async function extractDocText(buffer: Buffer): Promise<string> {
    try {
        return await extractWithMammoth(buffer);
    } catch (error) {
        throw new FileError(ERROR_MESSAGES.FILE.LEGACY_DOC_UNSUPPORTED, error);
    }
}

function extractTxtText(buffer: Buffer): string {
    return buffer.toString('utf-8');
}

async function extractDocumentContent(
    extension: string,
    buffer: Buffer
): Promise<string> {
    if (extension === 'pdf') {
        return extractPdfText(buffer);
    }
    if (extension === 'docx') {
        return extractWithMammoth(buffer);
    }
    if (extension === 'doc') {
        return extractDocText(buffer);
    }
    if (extension === 'txt') {
        return extractTxtText(buffer);
    }
    throw new FileError(ERROR_MESSAGES.FILE.UNSUPPORTED_FORMAT);
}

async function extractDocumentText(
    base64Document: string,
    documentName: string
): Promise<string> {
    const buffer = getBase64Buffer(base64Document);
    const extension = getFileExtension(documentName);
    const extractedContent = await extractDocumentContent(extension, buffer);

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
    } catch (visionError: unknown) {
        if (visionError instanceof FileError) {
            throw visionError;
        }
        throw new ApiError(ERROR_MESSAGES.API.VISION_API_FAILED, visionError);
    }
}

function getLengthInstruction(summaryLength: SummaryLength): string {
    const lengthInstructions: Record<SummaryLength, string> = {
        short: 'Provide a concise, brief summary (2-3 sentences) that captures only the most essential points.',
        medium: 'Provide a balanced summary (1-2 paragraphs) that captures all major ideas, arguments, and important context.',
        long: 'Provide a comprehensive, detailed summary (2-3 paragraphs) that thoroughly covers all major points, supporting details, and important nuances.',
    };
    return lengthInstructions[summaryLength];
}

function getStyleInstruction(analysisStyle: AnalysisStyle): string {
    const styleInstructions: Record<AnalysisStyle, string> = {
        academic:
            'Use formal, scholarly language with precise terminology. Structure your analysis using academic conventions. Include appropriate terminology and maintain an objective, analytical tone throughout.',
        casual:
            'Use conversational, friendly language that is accessible and easy to understand. Write as if explaining to a friend. Keep it engaging and relatable while maintaining clarity.',
        technical:
            'Use professional, precise language with industry-specific terminology where appropriate. Be clear and direct. Focus on accuracy and detail while maintaining clarity for technical audiences.',
    };
    return styleInstructions[analysisStyle];
}

function buildPrompt(
    text: string,
    summaryLength: SummaryLength = 'medium',
    analysisStyle: AnalysisStyle = 'casual'
): string {
    const lengthInstruction = getLengthInstruction(summaryLength);
    const styleInstruction = getStyleInstruction(analysisStyle);

    return `You are an AI text analysis assistant. Your task is to analyze the user's input text and return all results strictly in the JSON structure described below.

ANALYSIS SETTINGS:
- Summary Length: ${summaryLength} - ${lengthInstruction}
- Analysis Style: ${analysisStyle} - ${styleInstruction}

Your goals:
1. Provide a summary that follows the ${summaryLength} length requirement: ${lengthInstruction}
2. Extract the most important key points as bullet list items. Adjust the depth and number of key points based on the summary length.
3. Give a simple, easy-to-understand explanation of the text using the ${analysisStyle} style: ${styleInstruction}
4. Estimate the reading time in minutes (round up to the nearest whole number).
5. Perform a comprehensive reading complexity analysis:
   - Assess sentence structure complexity (simple, compound, complex sentences)
   - Evaluate vocabulary difficulty (common words vs. technical/specialized terms)
   - Analyze conceptual density (how many ideas per sentence/paragraph)
   - Consider syntactic complexity (sentence length, clause structure)
   - Determine appropriate grade level based on Flesch-Kincaid scale
   - Provide format: "Grade level (descriptor)" where descriptor indicates difficulty

IMPORTANT STYLE REQUIREMENTS:
- Follow the ${analysisStyle} analysis style throughout: ${styleInstruction}
- The summary must be ${summaryLength} length as specified
- All output (summary, key points, explanation) should consistently reflect the ${analysisStyle} tone and style
- For academic style: use formal language, proper terminology, objective tone
- For casual style: use friendly, conversational language, relatable examples
- For technical style: use precise, professional language, industry terminology

Follow these rules:
- The output MUST be valid JSON.
- DO NOT include text outside the JSON object.
- DO NOT use markdown formatting inside the JSON.
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

Now analyze the following text using the specified settings:

${text}`;
}

function buildAnalysisResult(text: string, parsedResponse: AiAnalysisResponse): AnalysisResult {
    const readingTime =
        parsedResponse.reading_time_minutes ?? calculateReadingTime(text);
    const speakingTime = calculateSpeakingTime(text);
    const wordCount = countWords(text);
    const uniqueWords = countUniqueWords(text);
    const averageSentenceLength = calculateAverageSentenceLength(text);
    const topWords = getMostFrequentWords(text, 15);
    const readingLevel = parsedResponse.reading_level ?? 'General audience';

    return {
        summary: parsedResponse.summary ?? 'No summary available',
        keyPoints: Array.isArray(parsedResponse.key_points)
            ? parsedResponse.key_points
            : [],
        explanation: parsedResponse.explanation ?? 'No explanation available',
        readingTime,
        wordCount,
        readingLevel,
        speakingTime,
        uniqueWords,
        averageSentenceLength,
        topWords,
    };
}

function validateText(text: string): void {
    if (!text || !text.trim()) {
        throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_INPUT);
    }

    if (text.length > MAX_CHARS) {
        throw new ValidationError(
            ERROR_MESSAGES.VALIDATION.TEXT_TOO_LONG(MAX_CHARS)
        );
    }

    if (text.trim().length < 10) {
        throw new ValidationError(ERROR_MESSAGES.VALIDATION.TEXT_TOO_SHORT);
    }
}

async function resolveTextSource(body: AnalyzeRequest): Promise<TextSourceResult> {
    const {
        text: inputText,
        image,
        document,
        documentName,
        youtubeUrl,
    } = body;

    if (youtubeUrl) {
        const transcript = await fetchYouTubeTranscript(youtubeUrl);
        return {text: transcript, extractedText: transcript};
    }

    if (document && documentName) {
        const content = await extractDocumentText(document, documentName);
        return {text: content, extractedText: content};
    }

    if (image) {
        const content = await extractImageText(image);
        return {text: content, extractedText: content};
    }

    return {text: inputText ?? '', extractedText: undefined};
}

async function callOpenAiAnalysis(
    text: string,
    summaryLength: SummaryLength,
    analysisStyle: AnalysisStyle
): Promise<AiAnalysisResponse> {
    requireEnvVar('OPENAI_API_KEY');

    const prompt = buildPrompt(text, summaryLength, analysisStyle);

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

    try {
        return JSON.parse(aiResponse) as AiAnalysisResponse;
    } catch (parseError) {
        throw new ValidationError(
            ERROR_MESSAGES.VALIDATION.INVALID_JSON,
            parseError
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: AnalyzeRequest = await request.json();
        const {
            summaryLength = 'medium',
            analysisStyle = 'casual',
        } = body;

        const {text, extractedText} = await resolveTextSource(body);

        validateText(text);

        const parsedResponse = await callOpenAiAnalysis(
            text,
            summaryLength,
            analysisStyle
        );

        const result = buildAnalysisResult(text, parsedResponse);

        return NextResponse.json<AnalyzeResponse>(
            {
                success: true,
                data: result,
                extractedText,
            },
            {status: 200}
        );
    } catch (error: unknown) {
        if (error instanceof NextResponse) {
            return error;
        }

        return createErrorResponse(error);
    }
}
