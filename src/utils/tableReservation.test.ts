import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  TABLE_MOODS,
  PRERESERVE_LOAVES,
  createReservationTicket,
} from './tableReservation.js';

describe('tableReservation', () => {
  it('has 3 distinct table moods', () => {
    assert.strictEqual(TABLE_MOODS.length, 3);
    const ids = TABLE_MOODS.map((m) => m.id);
    assert.ok(ids.includes('hearthside'));
    assert.ok(ids.includes('garden-window'));
    assert.ok(ids.includes('courtyard-terrace'));
  });

  it('creates a formatted ticket voucher with wax seal metadata', () => {
    const ticket = createReservationTicket({
      name: 'Eleanor Vance',
      email: 'eleanor@example.com',
      partySize: 2,
      date: '2026-11-20',
      timeSlot: '09:00 AM',
      moodId: 'hearthside',
      reservedLoafIds: ['country-boule', 'croissant-box'],
    });

    assert.ok(ticket.ticketNumber.startsWith('GG-HEA-'));
    assert.strictEqual(ticket.guestName, 'Eleanor Vance');
    assert.strictEqual(ticket.partySize, 2);
    assert.strictEqual(ticket.moodName, 'Hearthside Oven Counter');
    assert.strictEqual(ticket.reservedLoaves.length, 2);
    assert.strictEqual(ticket.waxSealColor, '#d4af37');
  });

  it('handles default inputs safely', () => {
    const ticket = createReservationTicket({
      name: '',
      email: '',
      partySize: 0,
      date: '',
      timeSlot: '',
      moodId: 'courtyard-terrace',
      reservedLoafIds: [],
    });

    assert.strictEqual(ticket.guestName, 'Honored Guest');
    assert.strictEqual(ticket.partySize, 1);
    assert.strictEqual(ticket.reservedLoaves.length, 0);
  });
});
