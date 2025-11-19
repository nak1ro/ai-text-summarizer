/**
 * Reusable File Upload Hook
 * Eliminates duplicated drag-drop and file validation logic
 * 
 * Before: 3 duplicated implementations (image, document, paste)
 * After: Single reusable hook
 */

import { useState, useCallback } from 'react';
import { FILE_LIMITS } from '@/lib/fileConstants';
import { ERROR_MESSAGES } from '@/lib/errorMessages';

export type FileType = 'image' | 'document';

interface UseFileUploadOptions {
  fileType: FileType;
  onSuccess?: (file: File, preview?: string) => void;
  onError?: (error: string) => void;
}

interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function useFileUpload({ fileType, onSuccess, onError }: UseFileUploadOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const validateFile = useCallback(
    (file: File): FileValidationResult => {
      const limits = fileType === 'image' ? FILE_LIMITS.IMAGE : FILE_LIMITS.DOCUMENT;

      // Validate file type
      if (!(limits.ALLOWED_TYPES as readonly string[]).includes(file.type)) {
        const allowedStr = limits.ALLOWED_EXTENSIONS.join(', ').toUpperCase();
        return {
          valid: false,
          error: ERROR_MESSAGES.FILE.INVALID_TYPE(fileType, allowedStr),
        };
      }

      // Validate file size
      if (file.size > limits.MAX_SIZE) {
        const maxSizeStr = `${limits.MAX_SIZE_MB}MB`;
        return {
          valid: false,
          error: ERROR_MESSAGES.FILE.TOO_LARGE(fileType, maxSizeStr),
        };
      }

      return { valid: true };
    },
    [fileType]
  );

  const processFile = useCallback(
    async (file: File) => {
      // Validate
      const validation = validateFile(file);
      if (!validation.valid) {
        onError?.(validation.error!);
        return;
      }

      setFile(file);

      // Generate preview for images
      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setPreview(base64String);
          onSuccess?.(file, base64String);
        };
        reader.onerror = () => {
          onError?.(ERROR_MESSAGES.FILE.CORRUPTED);
        };
        reader.readAsDataURL(file);
      } else {
        onSuccess?.(file);
      }
    },
    [fileType, validateFile, onSuccess, onError]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const clearFile = useCallback(() => {
    setFile(null);
    setPreview(null);
  }, []);

  return {
    file,
    preview,
    isDragging,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearFile,
    validateFile,
  };
}

