export function calculateReadingTime(text: string): number {
    const wordsPerMinute = 200; // Average reading speed
    const words = countWords(text);
    const minutes = Math.ceil(words / wordsPerMinute);
    return Math.max(1, minutes); // Minimum 1 minute
}

export function countWords(text: string): number {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).length;
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

export function formatCount(count: number): string {
    return count.toLocaleString();
}

