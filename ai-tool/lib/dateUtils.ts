/**
 * Date and Time Utility Functions
 * Centralized date formatting logic
 */

/**
 * Format timestamp to relative time
 * @param timestamp Unix timestamp in milliseconds
 * @param translations Translation object with time-related keys
 * @returns Formatted relative time string
 */
export function formatRelativeTime(timestamp: number, t: any): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return t.justNow || 'just now';
  if (minutes === 1) return t.minuteAgo || 'minute ago';
  if (minutes < 60) return `${minutes} ${t.minutesAgo || 'minutes ago'}`;
  if (hours === 1) return t.hourAgo || 'hour ago';
  if (hours < 24) return `${hours} ${t.hoursAgo || 'hours ago'}`;
  if (days === 1) return t.dayAgo || 'day ago';
  if (days < 7) return `${days} ${t.daysAgo || 'days ago'}`;
  
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}

/**
 * Format date to localized string
 * @param timestamp Unix timestamp in milliseconds
 * @param locale Optional locale string (e.g., 'en-US', 'es-ES')
 * @returns Formatted date string
 */
export function formatDate(timestamp: number, locale?: string): string {
  return new Date(timestamp).toLocaleDateString(locale);
}

/**
 * Format date and time to localized string
 * @param timestamp Unix timestamp in milliseconds
 * @param locale Optional locale string
 * @returns Formatted date and time string
 */
export function formatDateTime(timestamp: number, locale?: string): string {
  return new Date(timestamp).toLocaleString(locale);
}

