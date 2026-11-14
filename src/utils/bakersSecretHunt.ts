export interface EasterEggItem {
  id: 'egg-farm' | 'egg-bakery' | 'egg-hotel';
  stageBeatId: string;
  name: string;
  title: string;
  clue: string;
  locationDescription: string;
  avatar: string; // Emoji / icon label
}

export const EASTER_EGG_ITEMS: EasterEggItem[] = [
  {
    id: 'egg-farm',
    stageBeatId: 'beat-stage-1',
    name: 'Brioche the Harvester Cat',
    title: 'Sunny Furrows of the Golden Valley',
    clue: 'Napping peacefully beside the sun-drenched wheat sheaves in Stage 1.',
    locationDescription: 'Hidden among the golden wheat harvest sheaves',
    avatar: '🌾🐱',
  },
  {
    id: 'egg-bakery',
    stageBeatId: 'beat-stage-2',
    name: 'Baker Brioche at the Hearth',
    title: 'The Old Town Stone Hearth',
    clue: 'Warming paws beside the century-old brick hearth oven in Stage 2.',
    locationDescription: 'Tucked near the cooling racks of the stone oven',
    avatar: '🥖🐱',
  },
  {
    id: 'egg-hotel',
    stageBeatId: 'beat-stage-3',
    name: 'Chef Brioche at the Grand Hotel',
    title: 'The Grand Hotel Marble Bench',
    clue: 'Inspecting the delicate puff pastry and silver cloche in Stage 3.',
    locationDescription: 'Perched beside the pastry finishing marble bench',
    avatar: '👨‍🍳🐱',
  },
];

export const TOTAL_EASTER_EGGS = EASTER_EGG_ITEMS.length; // 3
export const SECRET_PROMO_CODE = 'HEARTH1924';
export const EASTER_EGGS_STORAGE_KEY = 'golden-grain-easter-eggs-found';

export interface EasterEggProgress {
  foundIds: string[];
  allFound: boolean;
  unlockedPromoCode: string | null;
}

/**
 * Reads discovered egg IDs from storage.
 */
export function getDiscoveredEggIds(storage?: Storage): string[] {
  try {
    const target = storage || (typeof window !== 'undefined' ? window.localStorage : undefined);
    if (!target) return [];
    const raw = target.getItem(EASTER_EGGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const validIds = new Set(EASTER_EGG_ITEMS.map((item) => item.id));
      return parsed.filter((id): id is string => typeof id === 'string' && validIds.has(id as any));
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Saves discovered egg IDs to storage.
 */
export function saveDiscoveredEggIds(foundIds: string[], storage?: Storage): void {
  try {
    const target = storage || (typeof window !== 'undefined' ? window.localStorage : undefined);
    if (!target) return;
    target.setItem(EASTER_EGGS_STORAGE_KEY, JSON.stringify(foundIds));
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

/**
 * Calculates current Easter egg hunt progress.
 */
export function calculateHuntProgress(foundIds: string[]): EasterEggProgress {
  const uniqueFound = Array.from(new Set(foundIds));
  const allFound = EASTER_EGG_ITEMS.every((item) => uniqueFound.includes(item.id));
  return {
    foundIds: uniqueFound,
    allFound,
    unlockedPromoCode: allFound ? SECRET_PROMO_CODE : null,
  };
}

/**
 * Checks if a specific egg is found.
 */
export function isEggFound(eggId: string, foundIds: string[]): boolean {
  return foundIds.includes(eggId);
}

/**
 * Marks an egg as found and returns the updated ID list.
 */
export function markEggFound(eggId: string, currentFoundIds: string[]): string[] {
  if (currentFoundIds.includes(eggId)) {
    return currentFoundIds;
  }
  return [...currentFoundIds, eggId];
}
