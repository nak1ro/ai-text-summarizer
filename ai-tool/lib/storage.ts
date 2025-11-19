/**
 * LocalStorage Utility
 * Centralized localStorage access with error handling and type safety
 * Eliminates duplicated try-catch blocks and JSON parsing logic
 */

/**
 * Safely get an item from localStorage with JSON parsing
 * @param key Storage key
 * @param defaultValue Value to return if key doesn't exist or parsing fails
 * @returns Parsed value or default value
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to get storage item "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely set an item in localStorage with JSON stringification
 * @param key Storage key
 * @param value Value to store (will be JSON stringified)
 * @returns True if successful, false otherwise
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to set storage item "${key}":`, error);
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 * @param key Storage key
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove storage item "${key}":`, error);
  }
}

/**
 * Check if localStorage is available
 * @returns True if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

