import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getHydrationProfile } from './sourdoughHydration.js';

describe('sourdoughHydration', () => {
  it('clamps values below 65 to 65', () => {
    const profile = getHydrationProfile(50);
    assert.strictEqual(profile.percentage, 65);
    assert.strictEqual(profile.difficulty, 'Beginner');
  });

  it('clamps values above 85 to 85', () => {
    const profile = getHydrationProfile(99);
    assert.strictEqual(profile.percentage, 85);
    assert.strictEqual(profile.difficulty, 'Master Baker');
  });

  it('provides correct profile for classic 72% hydration', () => {
    const profile = getHydrationProfile(72);
    assert.strictEqual(profile.percentage, 72);
    assert.strictEqual(profile.name, 'Classic Rustic Country Boule');
    assert.strictEqual(profile.difficulty, 'Intermediate');
    assert.ok(profile.alveoliFactor > 0.3 && profile.alveoliFactor < 0.45);
  });

  it('provides correct profile for 78% batard', () => {
    const profile = getHydrationProfile(78);
    assert.strictEqual(profile.percentage, 78);
    assert.strictEqual(profile.name, 'Open Alveoli Hearth Batard');
    assert.strictEqual(profile.difficulty, 'Advanced');
  });

  it('provides correct profile for 82% high-hydration sourdough', () => {
    const profile = getHydrationProfile(82);
    assert.strictEqual(profile.percentage, 82);
    assert.strictEqual(profile.name, 'Wild Open-Crumb Master Sourdough');
    assert.strictEqual(profile.difficulty, 'Master Baker');
    assert.ok(profile.alveoliFactor >= 0.75);
  });
});
