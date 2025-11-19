'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnalysisHistoryEntry, AnalysisResult, AnalysisSettings, InputMode } from '@/types';

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
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load analysis history:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save analysis history:', error);
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

