import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  getAtmosphereModeForChapter,
  createAtmosphericParticles,
  stepAtmosphericParticle,
} from './atmosphericParticles.js';

describe('atmosphericParticles', () => {
  it('maps chapter ids to correct atmosphere modes', () => {
    assert.strictEqual(getAtmosphereModeForChapter('farm'), 'farm');
    assert.strictEqual(getAtmosphereModeForChapter('bakery'), 'hearth');
    assert.strictEqual(getAtmosphereModeForChapter('hotel'), 'pastry');
    assert.strictEqual(getAtmosphereModeForChapter('customers'), 'celebration');
  });

  it('generates embers and steam for hearth mode', () => {
    const particles = createAtmosphericParticles(30, 800, 600, 'hearth');
    assert.strictEqual(particles.length, 30);
    const kinds = particles.map((p) => p.kind);
    assert.ok(kinds.includes('ember') || kinds.includes('steam'));
    // In hearth mode, embers and steam rise upwards (negative vy)
    const risingCount = particles.filter((p) => p.vy < 0).length;
    assert.ok(risingCount > 20);
  });

  it('generates flour dust particles for pastry mode', () => {
    const particles = createAtmosphericParticles(25, 800, 600, 'pastry');
    assert.strictEqual(particles.length, 25);
    const flourCount = particles.filter((p) => p.kind === 'flour').length;
    assert.strictEqual(flourCount, 25);
  });

  it('steps particle position within boundaries without NaN', () => {
    const initial = createAtmosphericParticles(1, 800, 600, 'farm')[0];
    const stepped = stepAtmosphericParticle(initial, 0.016, 1.0, 800, 600);
    assert.ok(Number.isFinite(stepped.x));
    assert.ok(Number.isFinite(stepped.y));
    assert.ok(Number.isFinite(stepped.rotation));
  });
});
