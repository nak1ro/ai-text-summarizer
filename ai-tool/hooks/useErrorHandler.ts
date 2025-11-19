/**
 * Client-side Error Handler Hook
 * Provides consistent error handling for React components
 */

import { useState, useCallback } from 'react';
import { AppError, normalizeError, extractErrorMessage, logError, ErrorHandlerOptions } from '@/lib/errors';

export interface UseErrorHandlerReturn {
  error: string | null;
  setError: (error: string | null) => void;
  handleError: (error: unknown, options?: ErrorHandlerOptions) => void;
  clearError: () => void;
  hasError: boolean;
}

/**
 * Hook for managing errors in React components
 * Provides consistent error handling and state management
 */
export function useErrorHandler(options: ErrorHandlerOptions = {}): UseErrorHandlerReturn {
  const [error, setErrorState] = useState<string | null>(null);

  const handleError = useCallback(
    (error: unknown, customOptions?: ErrorHandlerOptions) => {
      const mergedOptions = { ...options, ...customOptions };
      const errorMessage = extractErrorMessage(error);
      
      // Log error in development
      if (process.env.NODE_ENV === 'development') {
        logError(error, mergedOptions);
      }
      
      setErrorState(errorMessage);
    },
    [options]
  );

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const setError = useCallback((error: string | null) => {
    setErrorState(error);
  }, []);

  return {
    error,
    setError,
    handleError,
    clearError,
    hasError: error !== null,
  };
}

