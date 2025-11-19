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

// Analysis settings
export type SummaryLength = 'short' | 'medium' | 'long';
export type AnalysisStyle = 'academic' | 'casual' | 'technical';

export interface AnalysisSettings {
  summaryLength: SummaryLength;
  analysisStyle: AnalysisStyle;
}

// Input mode type
export type InputMode = 'text' | 'image' | 'document' | 'youtube';

// History entry
export interface AnalysisHistoryEntry {
  id: string;
  timestamp: number; // Date.now()
  inputMode: InputMode;
  input: {
    text?: string;
    imagePreview?: string; // Base64 preview for images
    documentName?: string;
    youtubeUrl?: string;
  };
  settings: AnalysisSettings;
  result: AnalysisResult;
  extractedText?: string;
}

// API request body
export interface AnalyzeRequest {
  text?: string;
  image?: string; // Base64 encoded image
  document?: string; // Base64 encoded document
  documentName?: string; // Original filename with extension
  youtubeUrl?: string; // YouTube video URL
  summaryLength?: SummaryLength;
  analysisStyle?: AnalysisStyle;
}

// API response
export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
  extractedText?: string; // Text extracted from image
}
