export const THEME_STORAGE_KEY = 'golden-grain-theme-is-day';

export const DEFAULT_IS_DAY = true;

/**
 * Safely reads the theme preference from storage.
 * Falls back to DEFAULT_IS_DAY if storage is unavailable or not set.
 */
export function getThemeFromStorage(storage?: Storage): boolean {
  try {
    const target = storage || (typeof window !== 'undefined' ? window.localStorage : undefined);
    if (!target) return DEFAULT_IS_DAY;
    const value = target.getItem(THEME_STORAGE_KEY);
    if (value === null) return DEFAULT_IS_DAY;
    return value === 'true';
  } catch {
    return DEFAULT_IS_DAY;
  }
}

/**
 * Safely saves the theme preference to storage.
 */
export function saveThemeToStorage(isDay: boolean, storage?: Storage): void {
  try {
    const target = storage || (typeof window !== 'undefined' ? window.localStorage : undefined);
    if (!target) return;
    target.setItem(THEME_STORAGE_KEY, String(isDay));
  } catch {
    // Ignore storage errors in restricted iframes/environments
  }
}

/**
 * Returns the CSS class names for the night candlelit atmosphere overlay.
 */
export function getNightAtmosphereClasses(isDay: boolean): string {
  if (isDay) {
    return 'opacity-0 pointer-events-none';
  }
  return 'opacity-100 pointer-events-none';
}
