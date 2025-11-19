'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnalysisHistoryEntry, AnalysisResult, AnalysisSettings, InputMode } from '@/types';
import { getStorageItem, setStorageItem } from '@/lib/storage';

const STORAGE_KEY = 'analysisHistory';
const MAX_HISTORY_ENTRIES = 50; // Limit history size

export interface UseAnalysisHistoryReturn {
  history: AnalysisHistoryEntry[];
  addToHistory: (
    inputMode: InputMode,
    input: {
      text?: string;
      imagePreview?: string;
      documentName?: string;
      youtubeUrl?: string;
    },
    settings: AnalysisSettings,
    result: AnalysisResult,
    extractedText?: string
  ) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  loadFromHistory: (entry: AnalysisHistoryEntry) => {
    inputMode: InputMode;
    input: {
      text?: string;
      imagePreview?: string;
      documentName?: string;
      youtubeUrl?: string;
    };
    settings: AnalysisSettings;
    result: AnalysisResult;
    extractedText?: string;
  };
}

export function useAnalysisHistory(): UseAnalysisHistoryReturn {
  const [history, setHistory] = useState<AnalysisHistoryEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = getStorageItem<AnalysisHistoryEntry[]>(STORAGE_KEY, []);
    setHistory(stored);
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0 || history.length === 0) {
      setStorageItem(STORAGE_KEY, history);
    }
  }, [history]);

  const addToHistory = useCallback(
    (
      inputMode: InputMode,
      input: {
        text?: string;
        imagePreview?: string;
        documentName?: string;
        youtubeUrl?: string;
      },
      settings: AnalysisSettings,
      result: AnalysisResult,
      extractedText?: string
    ) => {
      const entry: AnalysisHistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        inputMode,
        input,
        settings,
        result,
        extractedText,
      };

      setHistory((prev) => {
        // Add new entry at the beginning and limit size
        const updated = [entry, ...prev].slice(0, MAX_HISTORY_ENTRIES);
        return updated;
      });
    },
    []
  );

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const loadFromHistory = useCallback(
    (entry: AnalysisHistoryEntry) => {
      return {
        inputMode: entry.inputMode,
        input: entry.input,
        settings: entry.settings,
        result: entry.result,
        extractedText: entry.extractedText,
      };
    },
    []
  );

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    loadFromHistory,
  };
}

