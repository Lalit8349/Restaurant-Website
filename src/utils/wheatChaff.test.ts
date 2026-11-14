import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeChaffCount,
  createWheatChaffParticles,
  stepWheatChaffParticle,
} from './wheatChaff';

test('computeChaffCount scales responsibly across mobile and desktop viewports', () => {
  assert.equal(computeChaffCount(390), 12);
  assert.equal(computeChaffCount(1440), 27);
  assert.equal(computeChaffCount(2560), 28);
  assert.equal(computeChaffCount(0), 16);
});

test('createWheatChaffParticles creates bounded golden chaff motes within viewport', () => {
  const particles = createWheatChaffParticles(15, 1440, 900, () => 0.5);
  assert.equal(particles.length, 15);
  for (const p of particles) {
    assert.ok(p.x >= 0 && p.x <= 1440);
    assert.ok(p.y >= 0 && p.y <= 900);
    assert.ok(p.vx > 0);
    assert.ok(p.opacity > 0 && p.opacity < 0.7);
    assert.ok(p.length >= 6 && p.length <= 14);
  }
});

test('stepWheatChaffParticle advances position and wraps cleanly around edges', () => {
  const particle = createWheatChaffParticles(1, 1000, 800, () => 0.5)[0];
  const moved = stepWheatChaffParticle(particle, 0.05, 1.0, 1000, 800);
  assert.ok(moved.x > particle.x);

  const nearRightEdge = { ...particle, x: 1020, vx: 300 };
  const wrapped = stepWheatChaffParticle(nearRightEdge, 0.05, 1.0, 1000, 800);
  assert.equal(wrapped.x, -24);
});
