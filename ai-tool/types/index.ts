// Analysis result from OpenAI API
export interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  explanation: string;
  readingTime: number; // in minutes
}

// API request body
export interface AnalyzeRequest {
  text?: string;
  image?: string; // Base64 encoded image
}

// API response
export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
  extractedText?: string; // Text extracted from image
}

