// Date and Time Utility Functions
// Centralized date formatting logic

export interface TimeTranslations {
  justNow?: string;
  minuteAgo?: string;
  minutesAgo?: string;
  hourAgo?: string;
  hoursAgo?: string;
  dayAgo?: string;
  daysAgo?: string;
}

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

function createDate(timestamp: number): Date {
  return new Date(timestamp);
}

function getTimeDiffUnits(timestamp: number) {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / MILLISECONDS_IN_SECOND);
  const minutes = Math.floor(seconds / SECONDS_IN_MINUTE);
  const hours = Math.floor(minutes / MINUTES_IN_HOUR);
  const days = Math.floor(hours / HOURS_IN_DAY);

  return { seconds, minutes, hours, days };
}

// Format timestamp to relative time
export function formatRelativeTime(timestamp: number, translations: TimeTranslations): string {
  const { seconds, minutes, hours, days } = getTimeDiffUnits(timestamp);

  if (seconds < SECONDS_IN_MINUTE) {
    return translations.justNow || 'just now';
  }

  if (minutes === 1) {
    return translations.minuteAgo || 'minute ago';
  }

  if (minutes < MINUTES_IN_HOUR) {
    return `${minutes} ${translations.minutesAgo || 'minutes ago'}`;
  }

  if (hours === 1) {
    return translations.hourAgo || 'hour ago';
  }

  if (hours < HOURS_IN_DAY) {
    return `${hours} ${translations.hoursAgo || 'hours ago'}`;
  }

  if (days === 1) {
    return translations.dayAgo || 'day ago';
  }

  if (days < 7) {
    return `${days} ${translations.daysAgo || 'days ago'}`;
  }

  return createDate(timestamp).toLocaleDateString();
}

