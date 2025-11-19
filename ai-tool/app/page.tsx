'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/types';
import { AnalysisResults } from '@/components/AnalysisResults';
import { formatCount } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';

const MAX_CHARS = 5000;

type InputMode = 'text' | 'image' | 'document' | 'youtube';

export default function Home() {
  const {t} = useTranslation();
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      setExtractedText(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setExtractedText(null);
  };

  const handleModeChange = (mode: InputMode) => {
    setInputMode(mode);
    setError(null);
    setResult(null);
    // Clear other inputs when switching modes
    if (mode !== 'text') setText('');
    if (mode !== 'image') {
      setImagePreview(null);
      setImageBase64(null);
    }
    if (mode !== 'document') setDocumentFile(null);
    if (mode !== 'youtube') setYoutubeUrl('');
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  const handleRemoveDocument = () => {
    setDocumentFile(null);
  };

  const handleDocumentExtract = () => {
    setError('Document extraction is coming soon! This feature will allow you to extract and analyze text from PDF, Word, and other document formats.');
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    // Look for image in clipboard
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
          setExtractedText(null);
          setError(null);
        };
        reader.readAsDataURL(file);
        break;
      }
    }
  };

  const handleYoutubeExtract = () => {
    setError('YouTube video extraction is coming soon! This feature will allow you to extract and analyze text from video transcripts.');
  };

  const handleAnalyze = async () => {
    // Reset states
    setError(null);
    setResult(null);
    setExtractedText(null);

    // Validate input
    if (!text.trim() && !imageBase64) {
      setError('Please enter some text or upload an image to analyze');
      return;
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
      const requestBody: { text?: string; image?: string } = {};
      
      if (imageBase64) {
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

      setResult(data.data);
      if (data.extractedText) {
        setExtractedText(data.extractedText);
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
      className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 py-8 px-4"
      onPaste={handlePaste}
    >
      <main className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          {/* Theme Toggle & Language Selector - Positioned in top right */}
          <div className="absolute top-0 right-0 flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            {t.title}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {t.subtitle}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            {t.pasteImageTip}
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 mb-8">
          {/* Mode Selector Tabs */}
          <div className="mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <button
                onClick={() => handleModeChange('text')}
                className={`px-3 py-2.5 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  inputMode === 'text'
                    ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
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
                className={`px-3 py-2.5 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  inputMode === 'image'
                    ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
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
                className={`px-3 py-2.5 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 relative ${
                  inputMode === 'document'
                    ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                disabled={loading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">{t.documentMode}</span>
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-semibold bg-yellow-400 dark:bg-yellow-500 text-zinc-900 rounded-full">
                  {t.comingSoon.split('!')[0]}
                </span>
              </button>
              
              <button
                onClick={() => handleModeChange('youtube')}
                className={`px-3 py-2.5 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 relative ${
                  inputMode === 'youtube'
                    ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                disabled={loading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">{t.youtubeMode}</span>
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-semibold bg-yellow-400 dark:bg-yellow-500 text-zinc-900 rounded-full">
                  {t.comingSoon.split('!')[0]}
                </span>
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
                className="w-full h-64 px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                disabled={loading}
              />
            </div>
          )}

          {/* Image Upload Mode */}
          {inputMode === 'image' && !imagePreview && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                {t.uploadOrPasteImage}
              </label>
              <div className="flex items-center gap-4 flex-wrap">
                <label
                  htmlFor="image-upload"
                  className="px-6 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-2 border border-zinc-300 dark:border-zinc-700"
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
                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <span>{t.uploadImageDesc}</span>
                  <span className="hidden sm:inline text-zinc-400 dark:text-zinc-500">•</span>
                  <span className="hidden sm:inline flex items-center gap-1">
                    <kbd className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-xs font-mono border border-zinc-300 dark:border-zinc-700">
                      Ctrl+V
                    </kbd>
                    <span>to paste</span>
                  </span>
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
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-64 rounded-lg border border-zinc-300 dark:border-zinc-700"
                />
                <button
                  onClick={handleRemoveImage}
                  disabled={loading}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 disabled:opacity-50"
                  title="Remove image"
                >
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
                </button>
              </div>
              {extractedText && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                    {t.extractedText}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
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
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    {t.uploadDocument}
                  </label>
                  <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                    <label
                      htmlFor="document-upload"
                      className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                    >
                      <svg className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        {t.clickToUpload}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
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
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">
                          {t.comingSoon}
                        </h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          {t.documentComingSoonDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    {t.uploadedDocument}
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {documentFile.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {(documentFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveDocument}
                      disabled={loading}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove document"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
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
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={true}
              />
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">
                      {t.comingSoon}
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      {t.youtubeComingSoonDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Character Counter and Analyze Button */}
          <div className="flex items-center justify-between mb-4">
            {inputMode === 'text' && (
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      charCount > MAX_CHARS
                        ? 'bg-red-500'
                        : charCount > MAX_CHARS * 0.9
                        ? 'bg-orange-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(charPercentage, 100)}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${charCountColor}`}>
                  {formatCount(charCount)} / {formatCount(MAX_CHARS)}
                </span>
              </div>
            )}
            {inputMode !== 'text' && <div />}
            <button
              onClick={
                inputMode === 'youtube' ? handleYoutubeExtract :
                inputMode === 'document' ? handleDocumentExtract :
                handleAnalyze
              }
              disabled={
                loading || 
                (inputMode === 'text' && !text.trim()) || 
                (inputMode === 'image' && !imageBase64)
              }
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t.analyzing}
                </>
              ) : (
                <>
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
                  {t.analyze}
                </>
              )}
            </button>
          </div>

          {inputMode === 'text' && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t.tipCtrlEnter}
            </p>
          )}
          {inputMode === 'image' && !imagePreview && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t.tipCtrlV}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
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
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200">
                {t.error}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && <AnalysisResults result={result} />}
      </main>
    </div>
  );
}
