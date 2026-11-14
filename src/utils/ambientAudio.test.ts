import test from 'node:test';
import assert from 'node:assert/strict';
import { AMBIENT_MAX_VOLUME, computeAmbientVolumes } from './ambientAudio';

test('computeAmbientVolumes plays only low-volume farm sounds at start of journey', () => {
  const start = computeAmbientVolumes(0);
  assert.equal(start.farmVolume, AMBIENT_MAX_VOLUME);
  assert.equal(start.bakeryVolume, 0);
  assert.ok(start.farmVolume <= 0.1, 'Ambient volume should remain very low');
});

test('computeAmbientVolumes crossfades smoothly from farm sounds to bakery bustle', () => {
  const mid = computeAmbientVolumes(0.3);
  assert.ok(mid.farmVolume > 0 && mid.farmVolume < AMBIENT_MAX_VOLUME);
  assert.ok(mid.bakeryVolume > 0 && mid.bakeryVolume < AMBIENT_MAX_VOLUME);
  assert.ok(
    Math.abs(mid.farmVolume + mid.bakeryVolume - AMBIENT_MAX_VOLUME) < 0.002
  );
});

test('computeAmbientVolumes shifts to bakery bustle in bakery and hotel chapters', () => {
  const bakery = computeAmbientVolumes(0.45);
  assert.equal(bakery.farmVolume, 0);
  assert.equal(bakery.bakeryVolume, AMBIENT_MAX_VOLUME);

  const end = computeAmbientVolumes(1.0);
  assert.equal(end.farmVolume, 0);
  assert.ok(end.bakeryVolume > 0 && end.bakeryVolume < AMBIENT_MAX_VOLUME);
});
