// LocalStorage utility
type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function withStorageErrorHandling<T>(
    operation: (storage: StorageLike) => T,
    fallbackValue: T,
    errorMessage: string,
    storage?: StorageLike,
): T {
    try {
        const activeStorage = storage ?? localStorage;
        return operation(activeStorage);
    } catch (error: unknown) {
        // Centralized storage error handling
        console.error(errorMessage, error);
        return fallbackValue;
    }
}

// Safely get an item from localStorage with JSON parsing
export function getStorageItem<T>(key: string, defaultValue: T, storage?: StorageLike): T {
    return withStorageErrorHandling<T>(
        (activeStorage) => {
            const item = activeStorage.getItem(key);
            if (item === null) {
                return defaultValue;
            }
            return JSON.parse(item) as T;
        },
        defaultValue,
        `Failed to get storage item "${key}":`,
        storage,
    );
}

// Safely set an item in localStorage with JSON stringification
export function setStorageItem<T>(key: string, value: T, storage?: StorageLike): boolean {
    return withStorageErrorHandling<boolean>(
        (activeStorage) => {
            activeStorage.setItem(key, JSON.stringify(value));
            return true;
        },
        false,
        `Failed to set storage item "${key}":`,
        storage,
    );
}

