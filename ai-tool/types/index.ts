// Analysis result from OpenAI API
export interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  explanation: string;
  readingTime: number; // in minutes
}

// API request body
export interface AnalyzeRequest {
  text: string;
}

// API response
export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}

