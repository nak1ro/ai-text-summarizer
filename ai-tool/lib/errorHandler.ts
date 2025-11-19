/**
 * Server-side Error Handler
 * For use in API routes and server components
 */

import { NextResponse } from 'next/server';
import { AppError, normalizeError, extractErrorMessage, logError, ErrorCategory } from './errors';
import { AnalyzeResponse } from '@/types';

/**
 * Creates a standardized JSON error response for API routes
 */
export function createErrorResponse(
  error: unknown,
  defaultStatus: number = 500
): NextResponse<AnalyzeResponse> {
  const normalizedError = normalizeError(error);
  const statusCode = normalizedError.statusCode || defaultStatus;
  
  // Log error on server
  logError(normalizedError, {
    logError: true,
    logLevel: statusCode >= 500 ? 'error' : 'warn',
    includeStack: true,
  });
  
  return NextResponse.json<AnalyzeResponse>(
    {
      success: false,
      error: normalizedError.message,
    },
    { status: statusCode }
  );
}

/**
 * Wraps an async handler function with error handling
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      // If it's already a NextResponse (from createErrorResponse), return it
      if (error instanceof NextResponse) {
        return error;
      }
      
      // Otherwise, create a new error response
      throw createErrorResponse(error);
    }
  }) as T;
}

/**
 * Validates required environment variables
 */
export function requireEnvVar(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new AppError(
      `${name} is not configured. Please add it to your .env file.`,
      ErrorCategory.API,
      undefined,
      500
    );
  }
  return value;
}

