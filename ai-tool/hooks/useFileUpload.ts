// Reusable File Upload Hook
// Eliminates duplicated drag-drop and file validation logic
// Before: 3 duplicated implementations (image, document, paste)
// After: Single reusable hook

import {useCallback, useState} from 'react';
import type React from 'react';
import {FILE_LIMITS} from '@/lib/fileConstants';
import {ERROR_MESSAGES} from '@/lib/errorMessages';

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

interface FileLimitConfig {
    readonly MAX_SIZE: number;
    readonly MAX_SIZE_MB: number;
    readonly ALLOWED_TYPES: readonly string[];
    readonly ALLOWED_EXTENSIONS: readonly string[];
}

interface UseFileUploadResult {
    file: File | null;
    preview: string | null;
    isDragging: boolean;
    handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDragOver: (e: React.DragEvent<HTMLElement>) => void;
    handleDragLeave: (e: React.DragEvent<HTMLElement>) => void;
    handleDrop: (e: React.DragEvent<HTMLElement>) => void;
    clearFile: () => void;
    validateFile: (file: File) => FileValidationResult;
}

function getFileLimits(fileType: FileType): FileLimitConfig {
    return fileType === 'image' ? FILE_LIMITS.IMAGE : FILE_LIMITS.DOCUMENT;
}

function getAllowedExtensionsString(limits: FileLimitConfig): string {
    return limits.ALLOWED_EXTENSIONS.join(', ').toUpperCase();
}

function getMaxSizeString(limits: FileLimitConfig): string {
    return `${limits.MAX_SIZE_MB}MB`;
}

function validateFileType(
    file: File,
    fileType: FileType,
    limits: FileLimitConfig
): FileValidationResult {
    if (!(limits.ALLOWED_TYPES as readonly string[]).includes(file.type)) {
        const allowedStr = getAllowedExtensionsString(limits);
        return {
            valid: false,
            error: ERROR_MESSAGES.FILE.INVALID_TYPE(fileType, allowedStr),
        };
    }

    return {valid: true};
}

function validateFileSize(
    file: File,
    fileType: FileType,
    limits: FileLimitConfig
): FileValidationResult {
    if (file.size > limits.MAX_SIZE) {
        const maxSizeStr = getMaxSizeString(limits);
        return {
            valid: false,
            error: ERROR_MESSAGES.FILE.TOO_LARGE(fileType, maxSizeStr),
        };
    }

    return {valid: true};
}

function getFirstFile(files?: FileList | null): File | null {
    if (!files || files.length === 0) {
        return null;
    }
    return files[0];
}

function readImageAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(ERROR_MESSAGES.FILE.CORRUPTED);
        reader.readAsDataURL(file);
    });
}

export function useFileUpload({
                                  fileType,
                                  onSuccess,
                                  onError,
                              }: UseFileUploadOptions): UseFileUploadResult {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const validateFile = useCallback(
        (selectedFile: File): FileValidationResult => {
            const limits = getFileLimits(fileType);
            const typeValidation = validateFileType(selectedFile, fileType, limits);

            if (!typeValidation.valid) {
                return typeValidation;
            }

            return validateFileSize(selectedFile, fileType, limits);
        },
        [fileType]
    );

    const handleValidFile = useCallback(
        async (selectedFile: File) => {
            setFile(selectedFile);

            if (fileType !== 'image') {
                onSuccess?.(selectedFile);
                return;
            }

            try {
                const base64String = await readImageAsDataUrl(selectedFile);
                setPreview(base64String);
                onSuccess?.(selectedFile, base64String);
            } catch (error) {
                onError?.(String(error));
            }
        },
        [fileType, onSuccess, onError]
    );

    const processFile = useCallback(
        async (selectedFile: File) => {
            const validation = validateFile(selectedFile);

            if (!validation.valid) {
                if (validation.error) {
                    onError?.(validation.error);
                }
                return;
            }

            await handleValidFile(selectedFile);
        },
        [handleValidFile, onError, validateFile]
    );

    const handleFileFromList = useCallback(
        (files: FileList | null | undefined) => {
            const firstFile = getFirstFile(files);
            if (firstFile) {
                void processFile(firstFile);
            }
        },
        [processFile]
    );

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            handleFileFromList(e.target.files);
        },
        [handleFileFromList]
    );

    const handleDragEvent = useCallback(
        (e: React.DragEvent<HTMLElement>, dragging: boolean) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(dragging);
        },
        []
    );

    const handleDragOver = useCallback(
        (e: React.DragEvent<HTMLElement>) => {
            handleDragEvent(e, true);
        },
        [handleDragEvent]
    );

    const handleDragLeave = useCallback(
        (e: React.DragEvent<HTMLElement>) => {
            handleDragEvent(e, false);
        },
        [handleDragEvent]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            handleFileFromList(e.dataTransfer.files);
        },
        [handleFileFromList]
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
