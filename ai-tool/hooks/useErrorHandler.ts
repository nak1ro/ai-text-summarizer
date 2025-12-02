// Client-side error handler hook. Provides consistent error handling for React components.

import { useState, useCallback } from 'react';
import { extractErrorMessage, logError, ErrorHandlerOptions } from '@/lib/errors';

export interface UseErrorHandlerReturn {
  error: string | null;
  setError: (error: string | null) => void;
  handleError: (error: unknown, options?: ErrorHandlerOptions) => void;
  clearError: () => void;
  hasError: boolean;
}

// Hook for managing errors in React components. Provides consistent error handling and state management.
export function useErrorHandler(options: ErrorHandlerOptions = {}): UseErrorHandlerReturn {
  const [error, setErrorState] = useState<string | null>(null);

  const mergeOptions = useCallback(
      (customOptions?: ErrorHandlerOptions): ErrorHandlerOptions => ({
        ...options,
        ...customOptions,
      }),
      [options]
  );

  const shouldLogError = useCallback((): boolean => process.env.NODE_ENV === 'development', []);

  const handleError = useCallback(
      (errorInput: unknown, customOptions?: ErrorHandlerOptions) => {
        const mergedOptions = mergeOptions(customOptions);
        const errorMessage = extractErrorMessage(errorInput);

        if (shouldLogError()) {
          logError(errorInput, mergedOptions);
        }

        setErrorState(errorMessage);
      },
      [mergeOptions, shouldLogError]
  );

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const setError = useCallback((value: string | null) => {
    setErrorState(value);
  }, []);

  return {
    error,
    setError,
    handleError,
    clearError,
    hasError: error !== null,
  };
}
