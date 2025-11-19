/**
 * Centralized Error Messages
 * Provides consistent error messages across the application
 */

export const ERROR_MESSAGES = {
  // Validation Errors
  VALIDATION: {
    REQUIRED_INPUT: 'Please enter some text, upload an image, upload a document, or provide a YouTube URL to analyze',
    TEXT_TOO_SHORT: 'Text is too short. Please provide at least 10 characters.',
    TEXT_TOO_LONG: (maxChars: number) => `Text exceeds maximum length of ${maxChars.toLocaleString()} characters`,
    INVALID_YOUTUBE_URL: 'Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=...)',
    INVALID_JSON: 'Invalid JSON in request body',
    INVALID_INPUT: 'Invalid input: text or a valid media source is required',
  },

  // File Errors
  FILE: {
    INVALID_TYPE: (fileType: string, allowedTypes: string) => 
      `Please upload a valid ${fileType} file (${allowedTypes})`,
    TOO_LARGE: (fileType: string, maxSize: string) => 
      `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} size must be less than ${maxSize}`,
    CORRUPTED: 'The file appears to be corrupted or cannot be read. Please try a different file.',
    NO_TEXT_EXTRACTED: 'No text could be extracted from the document. The document may be empty or corrupted.',
    UNSUPPORTED_FORMAT: 'Unsupported document format. Please use PDF, DOCX, or TXT.',
    LEGACY_DOC_UNSUPPORTED: 'Legacy .doc format is not fully supported. Please convert to .docx or use PDF.',
    NO_TEXT_IN_IMAGE: 'No text was found in the uploaded image. Please upload an image containing text.',
  },

  // Network Errors
  NETWORK: {
    TIMEOUT: 'Request timeout. The operation is taking too long.',
    CONNECTION_FAILED: 'Connection failed. Please check your internet connection and try again.',
    FETCH_FAILED: 'Failed to fetch data. Please try again.',
  },

  // API Errors
  API: {
    OPENAI_NOT_CONFIGURED: 'OpenAI API key is not configured',
    SEARCHAPI_NOT_CONFIGURED: 'SearchAPI key is not configured. Please add SEARCHAPI_API_KEY to your .env file.',
    SEARCHAPI_INVALID_KEY: 'Invalid SearchAPI key. Please check your API key configuration.',
    SEARCHAPI_ACCESS_DENIED: 'SearchAPI access denied. Please check your API key or account status.',
    SEARCHAPI_ERROR: (error: string) => `SearchAPI error: ${error}`,
    NO_RESPONSE: 'No response from the server. Please try again.',
    ANALYSIS_FAILED: 'Analysis failed. Please try again.',
    VISION_API_FAILED: 'Failed to process the image. Please try again or enter text manually.',
  },

  // YouTube Errors
  YOUTUBE: {
    INVALID_URL: 'Invalid YouTube URL. Please provide a valid YouTube video URL.',
    NO_TRANSCRIPT: 'No transcript found for this video. The video may not have captions available.',
    EMPTY_TRANSCRIPT: 'Transcript is empty. The video may not have valid captions.',
    FETCH_FAILED: 'Failed to fetch YouTube transcript. Please ensure the video has captions available.',
    TIMEOUT: 'Request timeout. The video transcript is taking too long to fetch.',
  },

  // Document Errors
  DOCUMENT: {
    UNKNOWN_TYPE: 'Unable to determine document type. Please provide a valid file.',
    EXTRACTION_FAILED: 'Failed to extract text from document. Please ensure the document is not corrupted.',
  },

  // Generic Errors
  GENERIC: {
    UNEXPECTED: 'An unexpected error occurred. Please try again.',
    UNKNOWN: 'An unknown error occurred.',
  },
} as const;

