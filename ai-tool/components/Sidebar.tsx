'use client';

import {ThemeToggle} from './ThemeToggle';
import {LanguageSelector} from './LanguageSelector';
import {useTranslation} from '@/hooks/useTranslation';

interface SidebarProps {
    historyCount?: number;
    onHistoryClick: () => void;
}

interface HistoryButtonProps {
    historyCount: number;
    title: string;
    onClick: () => void;
    buttonClassName: string;
    iconClassName: string;
}

interface MobileSidebarProps {
    historyCount: number;
    historyTitle: string;
    onHistoryClick: () => void;
}

interface DesktopSidebarProps {
    historyCount: number;
    historyTitle: string;
    onHistoryClick: () => void;
}

function getHistoryTitle(historyCount: number, noHistoryText?: string): string {
    if (historyCount === 0) {
        return noHistoryText ?? 'No analyses yet';
    }
    const label = historyCount === 1 ? 'analysis' : 'analyses';
    return `${historyCount} ${label}`;
}

function HistoryBadge({historyCount}: { historyCount: number }) {
    if (historyCount <= 0) {
        return null;
    }

    return (
        <span
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
      {historyCount > 9 ? '9+' : historyCount}
    </span>
    );
}

function HistoryIcon({className}: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
    );
}

const baseHistoryButtonClasses =
    'relative flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-300 group';

function HistoryButton({
                           historyCount,
                           title,
                           onClick,
                           buttonClassName,
                           iconClassName,
                       }: HistoryButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`${buttonClassName} ${baseHistoryButtonClasses}`}
            title={title}
        >
            <HistoryIcon className={iconClassName}/>
            <HistoryBadge historyCount={historyCount}/>
        </button>
    );
}

function MobileSidebar({historyCount, historyTitle, onHistoryClick}: MobileSidebarProps) {
    return (
        <div
            className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-zinc-900 shadow-lg z-30 border-t border-zinc-200 dark:border-zinc-800 flex flex-row items-center justify-center px-4 gap-10">
            <HistoryButton
                historyCount={historyCount}
                title={historyTitle}
                onClick={onHistoryClick}
                buttonClassName="w-28 max-w-28 h-14 gap-2 hover:scale-105 active:scale-95"
                iconClassName="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
            />
            <div className="w-28 max-w-28 h-14">
                <LanguageSelector isMobile/>
            </div>
            <div className="w-28 max-w-28 h-14">
                <ThemeToggle isMobile/>
            </div>
        </div>
    );
}

function DesktopSidebar({historyCount, historyTitle, onHistoryClick}: DesktopSidebarProps) {
    return (
        <div
            className="hidden lg:flex fixed top-0 left-0 h-full w-20 bg-white dark:bg-zinc-900 shadow-lg z-30 border-r border-zinc-200 dark:border-zinc-800 flex-col">
            <div className="flex-1 flex flex-col">
                <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                    <div
                        className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center">
                        <HistoryButton
                            historyCount={historyCount}
                            title={historyTitle}
                            onClick={onHistoryClick}
                            buttonClassName="w-14 h-14 hover:scale-110"
                            iconClassName="w-6 h-6 text-blue-600 dark:text-blue-400"
                        />
                    </div>
                    <div className="w-full flex flex-col items-center">
                        <div className="w-14 h-14">
                            <LanguageSelector isMobile={false}/>
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center">
                        <ThemeToggle isMobile={false}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Sidebar({historyCount = 0, onHistoryClick}: SidebarProps) {
    const {t} = useTranslation();
    const historyTitle = getHistoryTitle(historyCount, t.noHistory);

    return (
        <>
            <MobileSidebar
                historyCount={historyCount}
                historyTitle={historyTitle}
                onHistoryClick={onHistoryClick}
            />
            <DesktopSidebar
                historyCount={historyCount}
                historyTitle={historyTitle}
                onHistoryClick={onHistoryClick}
            />
        </>
    );
}
