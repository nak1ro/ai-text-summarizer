/**
 * Reusable File Drop Zone Component
 * Eliminates duplicated drag-drop UI across image and document modes
 */

import React from 'react';

interface FileDropZoneProps {
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDragging: boolean;
  accept: string;
  disabled?: boolean;
  accentColor?: 'purple' | 'pink' | 'blue';
  title: string;
  description: string;
  buttonText: string;
  icon?: React.ReactNode;
}

export function FileDropZone({
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  isDragging,
  accept,
  disabled = false,
  accentColor = 'purple',
  title,
  description,
  buttonText,
  icon,
}: FileDropZoneProps) {
  const colorClasses = {
    purple: {
      border: 'border-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      hover: 'hover:border-purple-400 dark:hover:border-purple-600',
      icon: 'bg-purple-500',
      iconGradient: 'bg-gradient-to-br from-purple-400 to-purple-500',
      text: 'text-purple-700 dark:text-purple-300',
    },
    pink: {
      border: 'border-pink-500',
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      hover: 'hover:border-pink-400 dark:hover:border-pink-600',
      icon: 'bg-pink-500',
      iconGradient: 'bg-gradient-to-br from-pink-400 to-pink-500',
      text: 'text-pink-700 dark:text-pink-300',
    },
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      hover: 'hover:border-blue-400 dark:hover:border-blue-600',
      icon: 'bg-blue-500',
      iconGradient: 'bg-gradient-to-br from-blue-400 to-blue-500',
      text: 'text-blue-700 dark:text-blue-300',
    },
  };

  const colors = colorClasses[accentColor];

  const defaultIcon = (
    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  );

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative mb-4 p-8 border-2 border-dashed rounded-2xl transition-all duration-300 ${
        isDragging
          ? `${colors.border} ${colors.bg} scale-[1.02]`
          : `border-zinc-300 dark:border-zinc-700 ${colors.hover}`
      }`}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div
          className={`p-4 rounded-2xl mb-4 transition-all duration-300 ${
            isDragging ? `${colors.icon} scale-110` : colors.iconGradient
          }`}
        >
          {icon || defaultIcon}
        </div>
        <p
          className={`text-lg font-bold mb-2 transition-colors duration-300 ${
            isDragging ? colors.text : 'text-zinc-700 dark:text-zinc-300'
          }`}
        >
          {isDragging ? 'Drop your file here!' : title}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">or</p>
      </div>

      <div className="flex items-center gap-4 flex-wrap justify-center">
        <label
          htmlFor="file-upload"
          className={`px-7 py-4 bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 hover:from-zinc-200 hover:to-zinc-100 dark:hover:from-zinc-700 dark:hover:to-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl transition-all duration-300 flex items-center gap-3 border-2 border-zinc-300 dark:border-zinc-700 shadow-sm hover:shadow-md ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {buttonText}
        </label>
        <input
          id="file-upload"
          type="file"
          accept={accept}
          onChange={onFileSelect}
          className="hidden"
          disabled={disabled}
        />
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
          <span>{description}</span>
        </div>
      </div>
    </div>
  );
}

