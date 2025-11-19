import {NextRequest, NextResponse} from 'next/server';
import OpenAI from 'openai';
import {AnalyzeRequest, AnalyzeResponse, AnalysisResult} from '@/types';
import {calculateReadingTime, countWords} from '@/lib/utils';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const MAX_CHARS = 5000;

export async function POST(request: NextRequest) {
    try {
        const body: AnalyzeRequest = await request.json();
        const {text: inputText, image} = body;

        let text = inputText || '';
        let extractedText: string | undefined;

        // If image is provided, extract text from it first
        if (image) {
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
1. Provide a concise and accurate summary.
2. Extract the most important key points as bullet list items.
3. Give a clear, easy-to-understand explanation of the text (simplified, as if teaching someone with no background knowledge).
4. Estimate the reading time in minutes (round up to the nearest whole number).

Follow these rules:
- The output MUST be valid JSON.
- DO NOT include text outside the JSON object.
- DO NOT use markdown formatting inside the JSON.
- Keep summary short and focused.
- Key points must be a clean array of strings.
- For reading_time_minutes, output only a number.
- If the input text is unclear, incomplete, or nonsensical, do your best to interpret it reasonably.

Expected JSON structure:
{
  "summary": "...",
  "key_points": ["...", "...", "..."],
  "explanation": "...",
  "reading_time_minutes": 4
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

        // Fallback to calculated reading time if AI doesn't provide it
        const readingTime = parsedResponse.reading_time_minutes || calculateReadingTime(text);
        const wordCount = countWords(text);

        const result: AnalysisResult = {
            summary: parsedResponse.summary || 'No summary available',
            keyPoints: Array.isArray(parsedResponse.key_points)
                ? parsedResponse.key_points
                : [],
            explanation: parsedResponse.explanation || 'No explanation available',
            readingTime,
            wordCount,
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

