import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  POSTCARD_TEMPLATES,
  WAX_SEALS,
  PRESET_MESSAGES,
  encodePostcardShareLink,
} from './postcardGenerator.js';

describe('postcardGenerator', () => {
  it('has 4 distinct vintage postcard templates', () => {
    assert.strictEqual(POSTCARD_TEMPLATES.length, 4);
    assert.strictEqual(POSTCARD_TEMPLATES[0].id, 'wheat-fields');
    assert.strictEqual(POSTCARD_TEMPLATES[1].id, 'hearth-fire');
  });

  it('has 4 artisanal wax seal colors', () => {
    assert.strictEqual(WAX_SEALS.length, 4);
    const ids = WAX_SEALS.map((s) => s.id);
    assert.ok(ids.includes('gold'));
    assert.ok(ids.includes('crimson'));
    assert.ok(ids.includes('forest'));
    assert.ok(ids.includes('navy'));
  });

  it('correctly encodes a shareable URL with URLSearchParams', () => {
    const url = encodePostcardShareLink({
      recipientName: 'Claire',
      senderName: 'Julian',
      message: PRESET_MESSAGES[0],
      templateId: 'wheat-fields',
      waxSealId: 'gold',
    });

    assert.ok(url.includes('to=Claire'));
    assert.ok(url.includes('from=Julian'));
    assert.ok(url.includes('tpl=wheat-fields'));
    assert.ok(url.includes('seal=gold'));
  });
});
