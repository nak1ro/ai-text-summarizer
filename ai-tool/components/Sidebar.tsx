'use client';

import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';

interface SidebarProps {
  historyCount?: number;
  onHistoryClick: () => void;
}

export function Sidebar({ historyCount = 0, onHistoryClick }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Sidebar */}
      <div className="hidden lg:flex fixed top-0 left-0 h-full w-20 bg-white dark:bg-zinc-900 shadow-lg z-30 border-r border-zinc-200 dark:border-zinc-800 flex-col">
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 flex flex-col items-center">
            {/* History Section */}
            <div className="w-full flex flex-col items-center">
              <button
                onClick={onHistoryClick}
                className="relative w-14 h-14 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-300 group hover:scale-110"
                title={historyCount === 0 ? (t.noHistory || 'No analyses yet') : `${historyCount} ${historyCount === 1 ? 'analysis' : 'analyses'}`}
              >
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {historyCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
                    {historyCount > 9 ? '9+' : historyCount}
                  </span>
                )}
              </button>
            </div>

            {/* Language Selector Section */}
            <div className="w-full flex flex-col items-center">
              <div className="w-14 h-14">
                <LanguageSelector />
              </div>
            </div>

            {/* Theme Toggle Section */}
            <div className="w-full flex flex-col items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

