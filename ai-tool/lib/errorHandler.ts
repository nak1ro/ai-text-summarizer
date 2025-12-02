// Server-side error handler for API routes and server components

import { NextResponse } from 'next/server';
import { AppError, normalizeError, logError, ErrorCategory } from './errors';
import type { AnalyzeResponse } from '@/types';

// Creates a standardized JSON error response for API routes
function getStatusCodeFromError(normalizedError: AppError, defaultStatus: number): number {
  return normalizedError.statusCode ?? defaultStatus;
}

function getLogLevel(statusCode: number): 'error' | 'warn' {
  return statusCode >= 500 ? 'error' : 'warn';
}

function logServerError(normalizedError: AppError, statusCode: number): void {
  logError(normalizedError, {
    logError: true,
    logLevel: getLogLevel(statusCode),
    includeStack: true,
  });
}

function createErrorResponseBody(message: string): AnalyzeResponse {
  return {
    success: false,
    error: message,
  };
}

export function createErrorResponse(
    error: unknown,
    defaultStatus: number = 500
): NextResponse<AnalyzeResponse> {
  const normalizedError = normalizeError(error);
  const statusCode = getStatusCodeFromError(normalizedError, defaultStatus);

  // Log error on server
  logServerError(normalizedError, statusCode);

  return NextResponse.json<AnalyzeResponse>(createErrorResponseBody(normalizedError.message), {
    status: statusCode,
  });
}

// Validates required environment variables
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
