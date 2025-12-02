// Centralized error handling system
// Provides consistent error handling across client and server components

// Error categories
export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  API = 'API',
  FILE = 'FILE',
  UNKNOWN = 'UNKNOWN',
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',

}

// Base error class
export class AppError extends Error {
  constructor(
      message: string,
      public category: ErrorCategory = ErrorCategory.UNKNOWN,
      public severity: ErrorSeverity = ErrorSeverity.MEDIUM,
      public statusCode?: number,
      public originalError?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Specific error classes
export class ValidationError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, ErrorCategory.VALIDATION, ErrorSeverity.LOW, 400, originalError);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, originalError?: unknown, statusCode?: number) {
    super(message, ErrorCategory.NETWORK, ErrorSeverity.HIGH, statusCode ?? 500, originalError);
    this.name = 'NetworkError';
  }
}

export class ApiError extends AppError {
  constructor(message: string, originalError?: unknown, statusCode?: number) {
    super(message, ErrorCategory.API, ErrorSeverity.HIGH, statusCode ?? 500, originalError);
    this.name = 'ApiError';
  }
}

export class FileError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, ErrorCategory.FILE, ErrorSeverity.MEDIUM, 400, originalError);
    this.name = 'FileError';
  }
}
// Error handler options
export interface ErrorHandlerOptions {
  logError?: boolean;
  logLevel?: 'error' | 'warn' | 'info';
  includeStack?: boolean;
}

type LogLevel = NonNullable<ErrorHandlerOptions['logLevel']>;

function isObjectWithMessage(error: unknown): error is { message: unknown } {
  return typeof error === 'object' && error !== null && 'message' in error;
}

function getMessageFromUnknown(error: unknown): string | null {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (isObjectWithMessage(error)) {
    return String(error.message);
  }

  return null;
}

function matchesAnyKeyword(message: string, keywords: string[]): boolean {
  const lowerMessage = message.toLowerCase();
  return keywords.some((keyword) => lowerMessage.includes(keyword));
}

function createCategorizedErrorFromError(error: Error): AppError {
  const message = error.message;

  if (matchesAnyKeyword(message, ['validation', 'invalid', 'required'])) {
    return new ValidationError(message, error);
  }

  if (matchesAnyKeyword(message, ['network', 'fetch', 'timeout'])) {
    return new NetworkError(message, error);
  }

  if (matchesAnyKeyword(message, ['api', 'server'])) {
    return new ApiError(message, error);
  }

  if (matchesAnyKeyword(message, ['file', 'upload', 'document'])) {
    return new FileError(message, error);
  }

  return new AppError(message, ErrorCategory.UNKNOWN, ErrorSeverity.MEDIUM, undefined, error);
}

function getNormalizedLogOptions(options: ErrorHandlerOptions) {
  const {
    logError: shouldLog = true,
    logLevel = 'error',
    includeStack = false,
  } = options;

  return { shouldLog, logLevel, includeStack };
}

function buildLogData(normalizedError: AppError, includeStack: boolean): Record<string, unknown> {
  const logData: Record<string, unknown> = {
    message: normalizedError.message,
    category: normalizedError.category,
    severity: normalizedError.severity,
    statusCode: normalizedError.statusCode,
  };

  if (includeStack && normalizedError.originalError instanceof Error) {
    logData.stack = normalizedError.originalError.stack;
  }

  if (normalizedError.originalError) {
    logData.originalError = normalizedError.originalError;
  }

  return logData;
}

function logWithLevel(logLevel: LogLevel, logData: Record<string, unknown>): void {
  switch (logLevel) {
    case 'warn':
      console.warn('Error:', logData);
      break;
    case 'info':
      console.info('Error:', logData);
      break;
    case 'error':
    default:
      console.error('Error:', logData);
      break;
  }
}

// Extracts a user-friendly error message from any error
export function extractErrorMessage(
    error: unknown,
    fallback: string = 'An unexpected error occurred',
): string {
  if (error instanceof AppError) {
    return error.message;
  }

  const extractedMessage = getMessageFromUnknown(error);
  if (extractedMessage) {
    return extractedMessage;
  }

  return fallback;
}

// Creates an AppError from any error
export function normalizeError(error: unknown, defaultMessage?: string): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Try to categorize by message
    return createCategorizedErrorFromError(error);
  }

  if (typeof error === 'string') {
    return new AppError(error);
  }

  const fallbackMessage = defaultMessage ?? 'An unexpected error occurred';
  return new AppError(
      fallbackMessage,
      ErrorCategory.UNKNOWN,
      ErrorSeverity.MEDIUM,
      undefined,
      error,
  );
}

// Logs error with appropriate level
export function logError(error: unknown, options: ErrorHandlerOptions = {}): void {
  const { shouldLog, logLevel, includeStack } = getNormalizedLogOptions(options);

  if (!shouldLog) {
    return;
  }

  const normalizedError = normalizeError(error);
  const logData = buildLogData(normalizedError, includeStack);

  logWithLevel(logLevel, logData);
}

// Handles error and returns user-friendly message
