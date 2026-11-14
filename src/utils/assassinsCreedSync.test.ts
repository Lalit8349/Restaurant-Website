import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  MEMORY_SEQUENCES,
  getAnimusSyncPercent,
  getActiveMemorySequence,
  calculateAnimusPlayheadY,
} from './assassinsCreedSync.js';

describe('assassinsCreedSync', () => {
  it('contains 4 Assassin\'s Creed memory sequences', () => {
    assert.strictEqual(MEMORY_SEQUENCES.length, 4);
    assert.strictEqual(MEMORY_SEQUENCES[0].sequenceNumber, 'SEQ 01');
    assert.strictEqual(MEMORY_SEQUENCES[1].sequenceNumber, 'SEQ 02');
    assert.strictEqual(MEMORY_SEQUENCES[2].sequenceNumber, 'SEQ 03');
    assert.strictEqual(MEMORY_SEQUENCES[3].sequenceNumber, 'SEQ 04');
  });

  it('calculates Animus synchronization percentage accurately', () => {
    assert.strictEqual(getAnimusSyncPercent(0), 0);
    assert.strictEqual(getAnimusSyncPercent(0.5), 50);
    assert.strictEqual(getAnimusSyncPercent(0.742), 74);
    assert.strictEqual(getAnimusSyncPercent(1), 100);
    assert.strictEqual(getAnimusSyncPercent(1.5), 100);
    assert.strictEqual(getAnimusSyncPercent(-0.2), 0);
  });

  it('determines the active memory sequence across chapter thresholds', () => {
    assert.strictEqual(getActiveMemorySequence(0.05).id, 'farm');
    assert.strictEqual(getActiveMemorySequence(0.35).id, 'bakery');
    assert.strictEqual(getActiveMemorySequence(0.60).id, 'hotel');
    assert.strictEqual(getActiveMemorySequence(0.85).id, 'customers');
  });

  it('calculates vertical blade playhead offset correctly', () => {
    const trackHeight = 400;
    assert.strictEqual(calculateAnimusPlayheadY(0, trackHeight), 0);
    assert.strictEqual(calculateAnimusPlayheadY(0.5, trackHeight), 200);
    assert.strictEqual(calculateAnimusPlayheadY(1.0, trackHeight), 400);
  });
});
