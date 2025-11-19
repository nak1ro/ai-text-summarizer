/**
 * Centralized Error Handling System
 * Provides consistent error handling across client and server components
 */

// Error Categories
export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  API = 'API',
  FILE = 'FILE',
  AUTH = 'AUTH',
  UNKNOWN = 'UNKNOWN',
}

// Error Severity Levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Base Error Class
export class AppError extends Error {
  constructor(
    message: string,
    public category: ErrorCategory = ErrorCategory.UNKNOWN,
    public severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Specific Error Classes
export class ValidationError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, ErrorCategory.VALIDATION, ErrorSeverity.LOW, 400, originalError);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, originalError?: unknown, statusCode?: number) {
    super(message, ErrorCategory.NETWORK, ErrorSeverity.HIGH, statusCode || 500, originalError);
    this.name = 'NetworkError';
  }
}

export class ApiError extends AppError {
  constructor(message: string, originalError?: unknown, statusCode?: number) {
    super(message, ErrorCategory.API, ErrorSeverity.HIGH, statusCode || 500, originalError);
    this.name = 'ApiError';
  }
}

export class FileError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, ErrorCategory.FILE, ErrorSeverity.MEDIUM, 400, originalError);
    this.name = 'FileError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, ErrorCategory.AUTH, ErrorSeverity.HIGH, 401, originalError);
    this.name = 'AuthError';
  }
}

// Error Handler Interface
export interface ErrorHandlerOptions {
  logError?: boolean;
  logLevel?: 'error' | 'warn' | 'info';
  includeStack?: boolean;
}

/**
 * Extracts a user-friendly error message from any error type
 */
export function extractErrorMessage(error: unknown, fallback: string = 'An unexpected error occurred'): string {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return fallback;
}

/**
 * Creates an AppError from any error type
 */
export function normalizeError(error: unknown, defaultMessage?: string): AppError {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof Error) {
    // Try to categorize based on error message patterns
    const message = error.message.toLowerCase();
    
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return new ValidationError(error.message, error);
    }
    
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return new NetworkError(error.message, error);
    }
    
    if (message.includes('api') || message.includes('server')) {
      return new ApiError(error.message, error);
    }
    
    if (message.includes('file') || message.includes('upload') || message.includes('document')) {
      return new FileError(error.message, error);
    }
    
    return new AppError(error.message, ErrorCategory.UNKNOWN, ErrorSeverity.MEDIUM, undefined, error);
  }
  
  if (typeof error === 'string') {
    return new AppError(error);
  }
  
  return new AppError(defaultMessage || 'An unexpected error occurred', ErrorCategory.UNKNOWN, ErrorSeverity.MEDIUM, undefined, error);
}

/**
 * Logs error with appropriate level
 */
export function logError(error: unknown, options: ErrorHandlerOptions = {}): void {
  const {
    logError: shouldLog = true,
    logLevel = 'error',
    includeStack = false,
  } = options;
  
  if (!shouldLog) return;
  
  const normalizedError = normalizeError(error);
  const logData: any = {
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

/**
 * Handles error and returns user-friendly message
 */
export function handleError(error: unknown, options: ErrorHandlerOptions = {}): string {
  logError(error, options);
  return extractErrorMessage(error);
}

