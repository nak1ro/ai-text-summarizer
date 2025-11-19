// Analysis result from OpenAI API
export interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  explanation: string;
  readingTime: number; // in minutes
  wordCount: number; // total words in the text
  readingLevel: string; // e.g., "7th grade (easy to understand)"
  speakingTime: number; // estimated speaking time in minutes
  uniqueWords: number; // count of unique words
  averageSentenceLength: number; // average words per sentence
  topWords: Array<{word: string; count: number}>; // most frequent words
}

// API request body
export interface AnalyzeRequest {
  text?: string;
  image?: string; // Base64 encoded image
  document?: string; // Base64 encoded document
  documentName?: string; // Original filename with extension
  youtubeUrl?: string; // YouTube video URL
}

// API response
export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
  extractedText?: string; // Text extracted from image
}

