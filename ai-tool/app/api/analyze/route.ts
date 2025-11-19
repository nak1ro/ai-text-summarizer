import {NextRequest, NextResponse} from 'next/server';
import OpenAI from 'openai';
import {AnalyzeRequest, AnalyzeResponse, AnalysisResult} from '@/types';
import {
    calculateReadingTime,
    calculateSpeakingTime,
    countWords,
    countUniqueWords,
    calculateAverageSentenceLength,
    getMostFrequentWords
} from '@/lib/utils';
import mammoth from 'mammoth';
import axios from 'axios';

const {PdfReader} = require('pdfreader');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const MAX_CHARS = 50000;

export async function POST(request: NextRequest) {
    try {
        const body: AnalyzeRequest = await request.json();
        const {text: inputText, image, document, documentName, youtubeUrl} = body;

        let text = inputText || '';
        let extractedText: string | undefined;

        // If YouTube URL is provided, fetch transcript
        if (youtubeUrl) {
            try {
                // Validate YouTube URL
                const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
                const match = youtubeUrl.match(youtubeRegex);

                if (!match) {
                    return NextResponse.json<AnalyzeResponse>(
                        {
                            success: false,
                            error: 'Invalid YouTube URL. Please provide a valid YouTube video URL.',
                        },
                        {status: 400}
                    );
                }

                const videoId = match[4];

                // Check if SearchAPI key is configured
                if (!process.env.SEARCHAPI_API_KEY) {
                    return NextResponse.json<AnalyzeResponse>(
                        {
                            success: false,
                            error: 'SearchAPI key is not configured. Please add SEARCHAPI_API_KEY to your .env file.',
                        },
                        {status: 500}
                    );
                }

                // Fetch transcript from SearchAPI
                const searchApiResponse = await axios.get('https://www.searchapi.io/api/v1/search', {
                    params: {
                        engine: 'youtube_transcripts',
                        video_id: videoId,
                        api_key: process.env.SEARCHAPI_API_KEY,
                    },
                    timeout: 30000, // 30 second timeout
                });

                // Extract transcript text - transcripts is an array of segment objects
                const transcripts = searchApiResponse.data?.transcripts;

                if (!transcripts || !Array.isArray(transcripts) || transcripts.length === 0) {
                    console.error('No transcripts found in response');
                    return NextResponse.json<AnalyzeResponse>(
                        {
                            success: false,
                            error: 'No transcript found for this video. The video may not have captions available.',
                        },
                        {status: 400}
                    );
                }

                console.log('Found', transcripts.length, 'transcript segments');

                // SearchAPI returns an array of segments, each with { text, start, duration }
                // We need to extract the text from ALL segments and join them
                const transcriptText = transcripts
                    .map((segment: any) => segment.text || '')
                    .filter(Boolean)
                    .join(' ');

                console.log('Extracted transcript length:', transcriptText.length);
                console.log('First 200 chars:', transcriptText.substring(0, 200));
                console.log('Last 200 chars:', transcriptText.substring(Math.max(0, transcriptText.length - 200)));

                if (!transcriptText || transcriptText.trim().length === 0) {
                    console.error('Transcript text is empty after extraction');
                    return NextResponse.json<AnalyzeResponse>(
                        {
                            success: false,
                            error: 'Transcript is empty. The video may not have valid captions.',
                        },
                        {status: 400}
                    );
                }

                text = transcriptText;
                extractedText = transcriptText;

            } catch (youtubeError: any) {
                console.error('YouTube transcript error:', youtubeError);
                console.error('Error details:', {
                    message: youtubeError.message,
                    response: youtubeError.response?.data,
                    status: youtubeError.response?.status,
                });

                if (axios.isAxiosError(youtubeError)) {
                    if (youtubeError.code === 'ECONNABORTED') {
                        return NextResponse.json<AnalyzeResponse>(
                            {
                                success: false,
                                error: 'Request timeout. The video transcript is taking too long to fetch.',
                            },
                            {status: 500}
                        );
                    }
                    if (youtubeError.response?.status === 401) {
                        return NextResponse.json<AnalyzeResponse>(
                            {
                                success: false,
                                error: 'Invalid SearchAPI key. Please check your API key configuration.',
                            },
                            {status: 500}
                        );
                    }
                    if (youtubeError.response?.status === 403) {
                        return NextResponse.json<AnalyzeResponse>(
                            {
                                success: false,
                                error: 'SearchAPI access denied. Please check your API key or account status.',
                            },
                            {status: 500}
                        );
                    }
                    if (youtubeError.response?.data?.error) {
                        return NextResponse.json<AnalyzeResponse>(
                            {
                                success: false,
                                error: `SearchAPI error: ${youtubeError.response.data.error}`,
                            },
                            {status: 500}
                        );
                    }
                }

                return NextResponse.json<AnalyzeResponse>(
                    {
                        success: false,
                        error: 'Failed to fetch YouTube transcript. Please ensure the video has captions available. Check server logs for details.',
                    },
                    {status: 500}
                );
            }
        }
        // If document is provided, extract text from it first
        else if (document && documentName) {
            try {
                // Remove data URL prefix if present
                const base64Data = document.includes(',')
                    ? document.split(',')[1]
                    : document;

                const buffer = Buffer.from(base64Data, 'base64');
                const extension = documentName.split('.').pop()?.toLowerCase();

                let extractedContent = '';

                if (extension === 'pdf') {
                    // Parse PDF using pdfreader
                    extractedContent = await new Promise((resolve, reject) => {
                        const textItems: string[] = [];
                        new PdfReader().parseBuffer(buffer, (err: Error | null, item: any) => {
                            if (err) {
                                reject(err);
                            } else if (!item) {
                                // End of file
                                resolve(textItems.join(' '));
                            } else if (item.text) {
                                textItems.push(item.text);
                            }
                        });
                    });
                } else if (extension === 'docx') {
                    // Parse DOCX
                    const result = await mammoth.extractRawText({buffer});
                    extractedContent = result.value;
                } else if (extension === 'doc') {
                    // DOC files are harder to parse, try with mammoth anyway
                    try {
                        const result = await mammoth.extractRawText({buffer});
                        extractedContent = result.value;
                    } catch {
                        return NextResponse.json<AnalyzeResponse>(
                            {
                                success: false,
                                error: 'Legacy .doc format is not fully supported. Please convert to .docx or use PDF.',
                            },
                            {status: 400}
                        );
                    }
                } else if (extension === 'txt') {
                    // Plain text
                    extractedContent = buffer.toString('utf-8');
                } else {
                    return NextResponse.json<AnalyzeResponse>(
                        {
                            success: false,
                            error: 'Unsupported document format. Please use PDF, DOCX, or TXT.',
                        },
                        {status: 400}
                    );
                }

                if (!extractedContent || extractedContent.trim().length === 0) {
                    return NextResponse.json<AnalyzeResponse>(
                        {
                            success: false,
                            error: 'No text could be extracted from the document. The document may be empty or corrupted.',
                        },
                        {status: 400}
                    );
                }

                text = extractedContent;
                extractedText = extractedContent;
            } catch (documentError) {
                console.error('Document parsing error:', documentError);
                return NextResponse.json<AnalyzeResponse>(
                    {
                        success: false,
                        error: 'Failed to process the document. Please ensure the file is valid and try again.',
                    },
                    {status: 500}
                );
            }
        }
        // If image is provided, extract text from it
        else if (image) {
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
                                    image_url: {
                                        url: image,
                                    },
                                },
                            ],
                        },
                    ],
                    max_tokens: 1000,
                });

                const extractedContent = visionResponse.choices[0]?.message?.content?.trim();

                if (!extractedContent || extractedContent === 'NO_TEXT_FOUND') {
                    return NextResponse.json<AnalyzeResponse>(
                        {
                            success: false,
                            error: 'No text was found in the uploaded image. Please upload an image containing text.',
                        },
                        {status: 400}
                    );
                }

                text = extractedContent;
                extractedText = extractedContent;
            } catch (visionError) {
                console.error('Vision API error:', visionError);
                return NextResponse.json<AnalyzeResponse>(
                    {
                        success: false,
                        error: 'Failed to process the image. Please try again or enter text manually.',
                    },
                    {status: 500}
                );
            }
        }

        // Validate input
        if (!text || typeof text !== 'string') {
            return NextResponse.json<AnalyzeResponse>(
                {
                    success: false,
                    error: 'Invalid input: text or image is required',
                },
                {status: 400}
            );
        }

        if (text.length > MAX_CHARS) {
            return NextResponse.json<AnalyzeResponse>(
                {
                    success: false,
                    error: `Text exceeds maximum length of ${MAX_CHARS} characters`,
                },
                {status: 400}
            );
        }

        if (text.trim().length < 10) {
            return NextResponse.json<AnalyzeResponse>(
                {
                    success: false,
                    error: 'Text is too short. Please provide at least 10 characters.',
                },
                {status: 400}
            );
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json<AnalyzeResponse>(
                {
                    success: false,
                    error: 'OpenAI API key is not configured',
                },
                {status: 500}
            );
        }

        const prompt = `You are an AI text analysis assistant. Your task is to analyze the user's input text and return all results strictly in the JSON structure described below.

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
   
   Grade Level Guide:
   • Elementary (K-5th): Very simple, short sentences, basic vocabulary
   • Middle School (6th-8th): Moderate complexity, some longer sentences
   • High School (9th-12th): More complex structures, diverse vocabulary
   • College (13th-16th): Advanced concepts, sophisticated language
   • Graduate/Professional (17th+): Highly technical, specialized terminology
   
   Descriptors to use:
   • "very easy" - elementary level
   • "easy to understand" - middle school level
   • "moderately complex" - high school level
   • "advanced" - college level
   • "highly technical" - graduate/professional level

Follow these rules:
- The output MUST be valid JSON.
- DO NOT include text outside the JSON object.
- DO NOT use markdown formatting inside the JSON.
- The summary should be well-developed but not overly long.
- The explanation must remain simple and beginner-friendly.
- Key points must be a clean array of strings.
- For reading_time_minutes, output only a number.
- For reading_level, analyze sentence structure, vocabulary, and conceptual complexity to determine accurate grade level
- Use format: "7th grade (easy to understand)" or "College level (advanced)" or "Graduate level (highly technical)"
- If the input is unclear or incomplete, interpret it reasonably.

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

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a helpful assistant that analyzes text and responds only with valid JSON. Never include markdown formatting or code blocks in your response, only raw JSON.',
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

        // Parse AI response
        const aiResponse = completion.choices[0]?.message?.content;
        if (!aiResponse) {
            throw new Error('No response from OpenAI');
        }

        // Parse JSON response
        const parsedResponse = JSON.parse(aiResponse);

        // Calculate all statistics
        const readingTime = parsedResponse.reading_time_minutes || calculateReadingTime(text);
        const speakingTime = calculateSpeakingTime(text);
        const wordCount = countWords(text);
        const uniqueWords = countUniqueWords(text);
        const averageSentenceLength = calculateAverageSentenceLength(text);
        const topWords = getMostFrequentWords(text, 5);
        const readingLevel = parsedResponse.reading_level || 'General audience';

        const result: AnalysisResult = {
            summary: parsedResponse.summary || 'No summary available',
            keyPoints: Array.isArray(parsedResponse.key_points)
                ? parsedResponse.key_points
                : [],
            explanation: parsedResponse.explanation || 'No explanation available',
            readingTime,
            wordCount,
            readingLevel,
            speakingTime,
            uniqueWords,
            averageSentenceLength,
            topWords,
        };

        return NextResponse.json<AnalyzeResponse>(
            {
                success: true,
                data: result,
                extractedText,
            },
            {status: 200}
        );
    } catch (error) {
        console.error('Error in /api/analyze:', error);

        if (error instanceof SyntaxError) {
            return NextResponse.json<AnalyzeResponse>(
                {
                    success: false,
                    error: 'Invalid JSON in request body',
                },
                {status: 400}
            );
        }

        return NextResponse.json<AnalyzeResponse>(
            {
                success: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred',
            },
            {status: 500}
        );
    }
}

