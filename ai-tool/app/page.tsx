'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/types';
import { AnalysisResults } from '@/components/AnalysisResults';
import { formatCount } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/shared/Button';
import { ExtractedTextPreview } from '@/components/shared/ExtractedTextPreview';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { IconButton } from '@/components/shared/IconButton';

const MAX_CHARS = 50000;

type InputMode = 'text' | 'image' | 'document' | 'youtube';

export default function Home() {
  const {t} = useTranslation();
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [text, setText] = useState('');
  
  // Store results per mode
  const [results, setResults] = useState<Record<InputMode, AnalysisResult | null>>({
    text: null,
    image: null,
    document: null,
    youtube: null,
  });
  
  // Store extracted text per mode
  const [extractedTexts, setExtractedTexts] = useState<Record<InputMode, string | null>>({
    text: null,
    image: null,
    document: null,
    youtube: null,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingDocument, setIsDraggingDocument] = useState(false);
  
  // Get current mode's result and extracted text
  const result = results[inputMode];
  const extractedText = extractedTexts[inputMode];

  const processImageFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setImageBase64(base64String);
      setText(''); // Clear text input when image is uploaded
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(true);
  };

  const handleImageDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(false);
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    // Clear image mode's result and extracted text
    setResults(prev => ({ ...prev, image: null }));
    setExtractedTexts(prev => ({ ...prev, image: null }));
  };

  const handleModeChange = (mode: InputMode) => {
    setInputMode(mode);
    setError(null);
    // Don't clear results anymore - they're preserved per mode
    // Clear other inputs when switching modes
    if (mode !== 'text') setText('');
    if (mode !== 'image') {
      setImagePreview(null);
      setImageBase64(null);
    }
    if (mode !== 'document') setDocumentFile(null);
    if (mode !== 'youtube') setYoutubeUrl('');
  };

  const processDocumentFile = (file: File) => {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid document (PDF, DOCX, DOC, or TXT)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Document size must be less than 10MB');
      return;
    }

    setDocumentFile(file);
    setError(null);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processDocumentFile(file);
  };

  const handleDocumentDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingDocument(true);
  };

  const handleDocumentDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingDocument(false);
  };

  const handleDocumentDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingDocument(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processDocumentFile(file);
  };

  const handleRemoveDocument = () => {
    setDocumentFile(null);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    const files = e.clipboardData?.files;
    
    if (!items) return;

    // First, look for image in clipboard
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (!file) continue;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError('Image size must be less than 5MB');
          return;
        }

        // Convert to base64 and set preview
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setImagePreview(base64String);
          setImageBase64(base64String);
          setInputMode('image'); // Switch to image mode
          setText(''); // Clear text input when image is pasted
          setError(null);
        };
        reader.readAsDataURL(file);
        return;
      }
    }

    // Check for document files in clipboard
    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ];

      // Check if pasted file is a document
      if (allowedTypes.includes(file.type)) {
        e.preventDefault();
        processDocumentFile(file);
        setInputMode('document'); // Switch to document mode
      }
    }
  };

  const handleAnalyze = async () => {
    // Reset error but keep results for other modes
    setError(null);
    
    // Clear current mode's result and extracted text
    setResults(prev => ({ ...prev, [inputMode]: null }));
    setExtractedTexts(prev => ({ ...prev, [inputMode]: null }));

    // Validate input
    if (!text.trim() && !imageBase64 && !documentFile && !youtubeUrl.trim()) {
      setError('Please enter some text, upload an image, upload a document, or provide a YouTube URL to analyze');
      return;
    }

    // Validate YouTube URL if in YouTube mode
    if (inputMode === 'youtube' && youtubeUrl.trim()) {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      if (!youtubeRegex.test(youtubeUrl.trim())) {
        setError('Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=...)');
        return;
      }
    }

    if (text && text.length > MAX_CHARS) {
      setError(`Text exceeds maximum length of ${formatCount(MAX_CHARS)} characters`);
      return;
    }

    if (text && text.trim().length < 10) {
      setError('Text is too short. Please provide at least 10 characters.');
      return;
    }

    setLoading(true);

    try {
      const requestBody: { text?: string; image?: string; document?: string; documentName?: string; youtubeUrl?: string } = {};
      
      if (youtubeUrl.trim() && inputMode === 'youtube') {
        requestBody.youtubeUrl = youtubeUrl.trim();
      } else if (documentFile) {
        // Convert document to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(documentFile);
        });
        
        requestBody.document = await base64Promise;
        requestBody.documentName = documentFile.name;
      } else if (imageBase64) {
        requestBody.image = imageBase64;
      } else {
        requestBody.text = text;
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      // Store result for current mode
      setResults(prev => ({ ...prev, [inputMode]: data.data }));
      
      // Store extracted text for current mode if available
      if (data.extractedText) {
        setExtractedTexts(prev => ({ ...prev, [inputMode]: data.extractedText }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow Ctrl/Cmd + Enter to submit
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAnalyze();
    }
  };

  const charCount = text.length;
  const charPercentage = (charCount / MAX_CHARS) * 100;
  const charCountColor =
    charCount > MAX_CHARS
      ? 'text-red-600 dark:text-red-400'
      : charCount > MAX_CHARS * 0.9
      ? 'text-orange-600 dark:text-orange-400'
      : 'text-zinc-500 dark:text-zinc-400';

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20 py-8 px-4 relative overflow-hidden"
      onPaste={handlePaste}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400/10 dark:bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <main className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 relative animate-fadeIn">
          {/* Theme Toggle & Language Selector - Positioned in top right */}
          <div className="absolute top-0 right-0 flex items-center gap-3">
            <LanguageSelector />
            <ThemeToggle />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4 tracking-tight">
            {t.title}
          </h1>
          <p className="text-xl text-zinc-700 dark:text-zinc-300 font-medium max-w-2xl mx-auto">
            {t.subtitle}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t.pasteImageTip} • Paste documents with Ctrl+V</span>
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 mb-10 animate-scaleIn">
          {/* Mode Selector Tabs */}
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-1.5 bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 rounded-xl shadow-inner border border-zinc-200/50 dark:border-zinc-700/50">
              <button
                onClick={() => handleModeChange('text')}
                className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  inputMode === 'text'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/50'
                }`}
                disabled={loading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden sm:inline">{t.textMode}</span>
              </button>
              
              <button
                onClick={() => handleModeChange('image')}
                className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  inputMode === 'image'
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/50'
                }`}
                disabled={loading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">{t.imageMode}</span>
              </button>
              
              <button
                onClick={() => handleModeChange('document')}
                className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 relative ${
                  inputMode === 'document'
                    ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30 scale-105'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/50'
                }`}
                disabled={loading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">{t.documentMode}</span>
              </button>
              
              <button
                onClick={() => handleModeChange('youtube')}
                className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 relative ${
                  inputMode === 'youtube'
                    ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 scale-105'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/50'
                }`}
                disabled={loading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">{t.youtubeMode}</span>
              </button>
            </div>
          </div>

          {/* Text Input Mode */}
          {inputMode === 'text' && (
            <div className="mb-4">
              <label
                htmlFor="text-input"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                {t.yourText}
              </label>
              <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.textPlaceholder}
                className="w-full h-64 px-5 py-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 resize-none transition-all duration-300 shadow-sm focus:shadow-lg"
                disabled={loading}
              />
            </div>
          )}

          {/* Image Upload Mode */}
          {inputMode === 'image' && !imagePreview && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                {t.uploadOrPasteImage}
              </label>
              
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleImageDragOver}
                onDragLeave={handleImageDragLeave}
                onDrop={handleImageDrop}
                className={`relative mb-4 p-8 border-2 border-dashed rounded-2xl transition-all duration-300 ${
                  isDraggingImage
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-[1.02]'
                    : 'border-zinc-300 dark:border-zinc-700 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50/30 dark:hover:bg-purple-900/10'
                }`}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <div className={`p-4 rounded-2xl mb-4 transition-all duration-300 ${
                    isDraggingImage 
                      ? 'bg-purple-500 scale-110' 
                      : 'bg-gradient-to-br from-purple-400 to-purple-500'
                  }`}>
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                    isDraggingImage 
                      ? 'text-purple-700 dark:text-purple-300' 
                      : 'text-zinc-700 dark:text-zinc-300'
                  }`}>
                    {isDraggingImage ? 'Drop your image here!' : 'Drag & drop your image here'}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    or
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <label
                  htmlFor="image-upload"
                  className="px-7 py-4 bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 hover:from-zinc-200 hover:to-zinc-100 dark:hover:from-zinc-700 dark:hover:to-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl cursor-pointer transition-all duration-300 flex items-center gap-3 border-2 border-zinc-300 dark:border-zinc-700 shadow-sm hover:shadow-md"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {t.chooseImage}
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={loading}
                />
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                  <span>{t.uploadImageDesc}</span>
                </div>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {inputMode === 'image' && imagePreview && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                {t.uploadedImage}
              </label>
              <div className="relative inline-block group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-64 rounded-2xl border-2 border-zinc-300 dark:border-zinc-700 shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <IconButton
                  onClick={handleRemoveImage}
                  disabled={loading}
                  variant="danger"
                  size="sm"
                  className="absolute top-3 right-3 hover:scale-110"
                  title="Remove image"
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  }
                />
              </div>
              {extractedText && (
                <div className="mt-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl shadow-md">
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t.extractedText}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                    {extractedText.substring(0, 200)}
                    {extractedText.length > 200 ? '...' : ''}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Document Mode */}
          {inputMode === 'document' && (
            <div className="mb-4">
              {!documentFile ? (
                <>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                    {t.uploadDocument}
                  </label>
                  <div
                    onDragOver={handleDocumentDragOver}
                    onDragLeave={handleDocumentDragLeave}
                    onDrop={handleDocumentDrop}
                    className={`group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer ${
                      isDraggingDocument
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 scale-[1.02]'
                        : 'border-zinc-300 dark:border-zinc-700 hover:border-pink-500 dark:hover:border-pink-400 hover:bg-pink-50/30 dark:hover:bg-pink-900/10'
                    }`}
                  >
                    <label
                      htmlFor="document-upload"
                      className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                    >
                      <div className={`p-4 rounded-2xl mb-4 transition-all duration-300 ${
                        isDraggingDocument 
                          ? 'bg-pink-500 scale-110' 
                          : 'bg-gradient-to-br from-pink-400 to-pink-500 group-hover:scale-110'
                      }`}>
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                        isDraggingDocument 
                          ? 'text-pink-700 dark:text-pink-300' 
                          : 'text-zinc-700 dark:text-zinc-300 group-hover:text-pink-600 dark:group-hover:text-pink-400'
                      }`}>
                        {isDraggingDocument ? 'Drop your document here!' : 'Drag & drop or click to upload'}
                      </p>
                      <p className={`text-sm transition-colors duration-300 ${
                        isDraggingDocument 
                          ? 'text-pink-600 dark:text-pink-400' 
                          : 'text-zinc-500 dark:text-zinc-400'
                      }`}>
                        {t.documentFormats}
                      </p>
                    </label>
                    <input
                      id="document-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleDocumentUpload}
                      className="hidden"
                      disabled={loading}
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    {t.uploadedDocument}
                  </label>
                  <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl shadow-md">
                    <div className="p-3 bg-blue-500 rounded-xl">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {documentFile.name}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {(documentFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveDocument}
                      disabled={loading}
                      className="p-2.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all duration-300 hover:scale-110"
                      title="Remove document"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {extractedText && (
                    <ExtractedTextPreview text={extractedText} title={t.extractedText} />
                  )}
                </div>
              )}
            </div>
          )}

          {/* YouTube Mode */}
          {inputMode === 'youtube' && (
            <div className="mb-4">
              <label
                htmlFor="youtube-input"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                {t.youtubeUrl}
              </label>
              <input
                id="youtube-input"
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-5 py-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:border-red-500 transition-all duration-300 shadow-sm focus:shadow-lg"
                disabled={loading}
              />
              {extractedText && (
                <ExtractedTextPreview text={extractedText} title={t.extractedText} />
              )}
            </div>
          )}

          {/* Character Counter and Analyze Button */}
          <div className="flex items-center justify-between mb-4">
            {inputMode === 'text' && (
              <div className="flex items-center gap-3">
                <div className="w-40 h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full transition-all duration-300 shadow-sm ${
                      charCount > MAX_CHARS
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : charCount > MAX_CHARS * 0.9
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    }`}
                    style={{ width: `${Math.min(charPercentage, 100)}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold ${charCountColor}`}>
                  {formatCount(charCount)} / {formatCount(MAX_CHARS)}
                </span>
              </div>
            )}
            {inputMode !== 'text' && <div />}
              <Button
                onClick={handleAnalyze}
                disabled={
                  loading || 
                  (inputMode === 'text' && !text.trim()) || 
                  (inputMode === 'image' && !imageBase64) ||
                  (inputMode === 'document' && !documentFile) ||
                  (inputMode === 'youtube' && !youtubeUrl.trim())
                }
                variant="primary"
                size="lg"
                loading={loading}
                icon={!loading ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ) : undefined}
              >
                {loading ? t.analyzing : t.analyze}
              </Button>
          </div>

          {inputMode === 'text' && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t.tipCtrlEnter}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 mb-10 flex items-start gap-4 shadow-lg animate-scaleIn">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-red-900 dark:text-red-200 mb-1">
                {t.error}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && <AnalysisResults result={result} />}
      </main>
    </div>
  );
}
