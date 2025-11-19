function normalizeWords(text: string): string[] {
    if (!text || !text.trim()) return [];
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 0);
}

function calculateTime(text: string, wordsPerMinute: number): number {
    const words = countWords(text);
    if (words === 0 || wordsPerMinute <= 0) return 1;
    const minutes = Math.ceil(words / wordsPerMinute);
    return Math.max(1, minutes);
}

export function calculateReadingTime(text: string): number {
    return calculateTime(text, 200);
}

export function calculateSpeakingTime(text: string): number {
    return calculateTime(text, 150);
}

export function countWords(text: string): number {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).length;
}

export function countUniqueWords(text: string): number {
    const words = normalizeWords(text);
    if (words.length === 0) return 0;
    return new Set(words).size;
}

export function calculateAverageSentenceLength(text: string): number {
    if (!text || !text.trim()) return 0;

    const sentences = text
        .split(/[.!?]+/)
        .filter(sentence => sentence.trim().length > 0);

    if (sentences.length === 0) return 0;

    const totalWords = sentences.reduce((sum, sentence) => {
        return sum + sentence.trim().split(/\s+/).length;
    }, 0);

    return Math.round(totalWords / sentences.length);
}

export function getMostFrequentWords(
    text: string,
    limit: number = 5
): Array<{ word: string; count: number }> {
    if (!text || !text.trim()) return [];

    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these',
        'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which',
        'who', 'when', 'where', 'why', 'how', 'not', 'no', 'yes'
    ]);

    const words = normalizeWords(text)
        .filter(word => word.length > 2 && !stopWords.has(word));

    const frequency: Record<string, number> = {};
    words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

export function formatCount(count: number): string {
    return count.toLocaleString();
}
