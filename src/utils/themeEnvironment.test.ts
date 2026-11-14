import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_IS_DAY,
  THEME_STORAGE_KEY,
  getNightAtmosphereClasses,
  getThemeFromStorage,
  saveThemeToStorage,
} from './themeEnvironment';

test('themeEnvironment handles storage persistence and atmosphere classes', () => {
  const mockStorage: Storage = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, val: string) => {
        store[key] = String(val);
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      key: (i: number) => Object.keys(store)[i] ?? null,
      get length() {
        return Object.keys(store).length;
      },
    };
  })();

  // Default when empty
  assert.equal(getThemeFromStorage(mockStorage), DEFAULT_IS_DAY);

  // Save night mode (isDay = false)
  saveThemeToStorage(false, mockStorage);
  assert.equal(mockStorage.getItem(THEME_STORAGE_KEY), 'false');
  assert.equal(getThemeFromStorage(mockStorage), false);

  // Save day mode (isDay = true)
  saveThemeToStorage(true, mockStorage);
  assert.equal(mockStorage.getItem(THEME_STORAGE_KEY), 'true');
  assert.equal(getThemeFromStorage(mockStorage), true);

  // Atmosphere overlay classes
  assert.match(getNightAtmosphereClasses(true), /opacity-0/);
  assert.match(getNightAtmosphereClasses(false), /opacity-100/);
});
