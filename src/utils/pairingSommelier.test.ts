import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  PAIRING_BREADS,
  PAIRING_SPREADS,
  PAIRING_BEVERAGES,
  generateTastingFlight,
} from './pairingSommelier.js';

describe('pairingSommelier', () => {
  it('contains valid pairing choices for all 3 categories', () => {
    assert.ok(PAIRING_BREADS.length >= 3);
    assert.ok(PAIRING_SPREADS.length >= 3);
    assert.ok(PAIRING_BEVERAGES.length >= 3);
  });

  it('generates the Parisian Sunrise flight for almond croissant and Ethiopian pour-over', () => {
    const flight = generateTastingFlight('almond-croissant', 'salted-butter', 'ethiopian-pourover');
    assert.strictEqual(flight.flightTitle, 'The Parisian Sunrise Flight');
    assert.ok(flight.harmonySummary.includes('Sweet almond marzipan'));
    assert.ok(flight.sommelierScore >= 95);
  });

  it('generates the Baltic Nordic Hearth flight for dark rye and butter', () => {
    const flight = generateTastingFlight('dark-rye', 'salted-butter', 'sea-salt-cortado');
    assert.strictEqual(flight.flightTitle, 'The Baltic Nordic Hearth Flight');
    assert.ok(flight.harmonySummary.includes('Robust caraway'));
  });

  it('handles fallbacks gracefully when ids are invalid', () => {
    const flight = generateTastingFlight('unknown-bread', 'unknown-spread', 'unknown-bev');
    assert.ok(flight.flightTitle.length > 0);
    assert.ok(flight.harmonySummary.length > 0);
    assert.ok(flight.palateJourney.length > 0);
  });
});
