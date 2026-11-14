import assert from 'node:assert/strict';
import test from 'node:test';
import {
  EASTER_EGG_ITEMS,
  SECRET_PROMO_CODE,
  TOTAL_EASTER_EGGS,
  calculateHuntProgress,
  getDiscoveredEggIds,
  isEggFound,
  markEggFound,
  saveDiscoveredEggIds,
} from './bakersSecretHunt';

test('bakersSecretHunt tracks 3 items and unlocks promo code upon completion', () => {
  assert.equal(TOTAL_EASTER_EGGS, 3);
  assert.equal(SECRET_PROMO_CODE, 'HEARTH1924');

  // Starts empty
  let found: string[] = [];
  let progress = calculateHuntProgress(found);
  assert.equal(progress.allFound, false);
  assert.equal(progress.unlockedPromoCode, null);
  assert.equal(isEggFound('egg-farm', found), false);

  // Find 1st egg (Farm)
  found = markEggFound('egg-farm', found);
  assert.equal(found.length, 1);
  assert.equal(isEggFound('egg-farm', found), true);
  assert.equal(isEggFound('egg-bakery', found), false);
  progress = calculateHuntProgress(found);
  assert.equal(progress.allFound, false);

  // Finding the same egg again is idempotent
  found = markEggFound('egg-farm', found);
  assert.equal(found.length, 1);

  // Find 2nd egg (Bakery)
  found = markEggFound('egg-bakery', found);
  assert.equal(found.length, 2);
  progress = calculateHuntProgress(found);
  assert.equal(progress.allFound, false);

  // Find 3rd egg (Hotel)
  found = markEggFound('egg-hotel', found);
  assert.equal(found.length, 3);
  progress = calculateHuntProgress(found);
  assert.equal(progress.allFound, true);
  assert.equal(progress.unlockedPromoCode, 'HEARTH1924');
});

test('bakersSecretHunt handles storage persistence safely', () => {
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

  // Default empty
  assert.deepEqual(getDiscoveredEggIds(mockStorage), []);

  // Save discovered eggs
  saveDiscoveredEggIds(['egg-farm', 'egg-bakery'], mockStorage);
  assert.deepEqual(getDiscoveredEggIds(mockStorage), ['egg-farm', 'egg-bakery']);

  // Filters invalid/corrupted IDs
  mockStorage.setItem('golden-grain-easter-eggs-found', JSON.stringify(['egg-farm', 'fake-id']));
  assert.deepEqual(getDiscoveredEggIds(mockStorage), ['egg-farm']);
});
