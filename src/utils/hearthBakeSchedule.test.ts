import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  BAKE_SLOTS,
  getActiveBakeStatus,
  formatMinutesCountdown,
} from './hearthBakeSchedule.js';

describe('hearthBakeSchedule', () => {
  it('should have 4 predefined bake slots', () => {
    assert.strictEqual(BAKE_SLOTS.length, 4);
    assert.strictEqual(BAKE_SLOTS[0].timeLabel, '07:00 AM');
    assert.strictEqual(BAKE_SLOTS[1].timeLabel, '09:30 AM');
    assert.strictEqual(BAKE_SLOTS[2].timeLabel, '02:00 PM');
    assert.strictEqual(BAKE_SLOTS[3].timeLabel, '04:30 PM');
  });

  it('determines correct slots before first morning bake (e.g. 05:00 AM)', () => {
    const earlyMorning = new Date(2026, 10, 14, 5, 0); // 05:00
    const status = getActiveBakeStatus(earlyMorning);
    assert.strictEqual(status.currentSlot.id, 'bake-4'); // Last slot from yesterday afternoon
    assert.strictEqual(status.nextSlot.id, 'bake-1'); // 07:00 AM
    assert.strictEqual(status.minutesUntilNext, 120); // 2 hours
  });

  it('determines correct slots mid-morning (e.g. 08:00 AM)', () => {
    const midMorning = new Date(2026, 10, 14, 8, 0); // 08:00
    const status = getActiveBakeStatus(midMorning);
    assert.strictEqual(status.currentSlot.id, 'bake-1'); // 07:00 AM
    assert.strictEqual(status.nextSlot.id, 'bake-2'); // 09:30 AM
    assert.strictEqual(status.minutesUntilNext, 90); // 1.5 hours
  });

  it('determines correct slots in evening (e.g. 08:00 PM)', () => {
    const evening = new Date(2026, 10, 14, 20, 0); // 20:00
    const status = getActiveBakeStatus(evening);
    assert.strictEqual(status.currentSlot.id, 'bake-4'); // 04:30 PM
    assert.strictEqual(status.nextSlot.id, 'bake-1'); // Next morning 07:00 AM
    // 20:00 to 07:00 is 11 hours = 660 mins
    assert.strictEqual(status.minutesUntilNext, 660);
  });

  it('formats countdown minutes correctly', () => {
    assert.strictEqual(formatMinutesCountdown(0), 'Baking Now');
    assert.strictEqual(formatMinutesCountdown(45), '45m');
    assert.strictEqual(formatMinutesCountdown(125), '2h 5m');
  });
});
