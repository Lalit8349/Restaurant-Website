import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  DEFAULT_BAKERY_CONTACT_DETAILS,
  buildGoogleMapsDirectionsUrl,
  buildSocialShareLinks,
  formatRouteDistance,
  formatRouteDuration,
  isMapsQuotaError,
} from './bakeryLocationConfig.ts';

describe('bakeryLocationConfig pure helpers', () => {
  it('formats route distances across meters, kilometers, and invalid inputs', () => {
    assert.equal(formatRouteDistance(0), '—');
    assert.equal(formatRouteDistance(-50), '—');
    assert.equal(formatRouteDistance(Number.NaN), '—');
    assert.equal(formatRouteDistance(420), '420 m');
    assert.equal(formatRouteDistance(2450), '2.5 km');
    assert.equal(formatRouteDistance(18400), '18 km');
  });

  it('formats route durations across minutes, hours, and edge cases', () => {
    assert.equal(formatRouteDuration(0), '—');
    assert.equal(formatRouteDuration(-1000), '—');
    assert.equal(formatRouteDuration(20000), '1 min');
    assert.equal(formatRouteDuration(14 * 60000), '14 min');
    assert.equal(formatRouteDuration(60 * 60000), '1 hr');
    assert.equal(formatRouteDuration(85 * 60000), '1 hr 25 min');
  });

  it('builds a valid Google Maps universal directions link', () => {
    const url = buildGoogleMapsDirectionsUrl({
      origin: 'Union Square, San Francisco',
      destination: 'Ferry Building, San Francisco',
      travelMode: 'WALKING',
    });
    assert.ok(url.startsWith('https://www.google.com/maps/dir/?'));
    assert.ok(url.includes('destination=Ferry+Building'));
    assert.ok(url.includes('origin=Union+Square'));
    assert.ok(url.includes('travelmode=walking'));
  });

  it('detects Google Maps quota errors without false positives', () => {
    assert.equal(isMapsQuotaError(new Error('RESOURCE_EXHAUSTED: Quota exceeded')), true);
    assert.equal(isMapsQuotaError(new Error('OVER_QUERY_LIMIT')), true);
    assert.equal(isMapsQuotaError('HTTP status 429'), true);
    assert.equal(isMapsQuotaError(new Error('ZERO_RESULTS: No route found')), false);
    assert.equal(isMapsQuotaError(null), false);
  });

  it('provides editable placeholder contact details for the footer', () => {
    assert.ok(DEFAULT_BAKERY_CONTACT_DETAILS.bakeryName.length > 0);
    assert.ok(DEFAULT_BAKERY_CONTACT_DETAILS.addressLine1.length > 0);
    assert.ok(DEFAULT_BAKERY_CONTACT_DETAILS.phone.length > 0);
    assert.ok(DEFAULT_BAKERY_CONTACT_DETAILS.email.includes('@'));
  });

  it('builds encoded social share links for X, Facebook, LinkedIn, and WhatsApp', () => {
    const shareUrl = 'https://goldengrain.example/story?stage=farm';
    const links = buildSocialShareLinks({
      url: shareUrl,
      title: 'Golden Grain Bakery',
      text: 'Farm to Table Story',
    });

    assert.equal(links.length, 4);
    const platforms = links.map((l) => l.platform);
    assert.deepEqual(platforms, ['x', 'facebook', 'linkedin', 'whatsapp']);

    const encodedShareUrl = encodeURIComponent(shareUrl);
    for (const link of links) {
      assert.ok(link.href.includes(encodedShareUrl), `Expected ${link.platform} href to contain encoded URL`);
      assert.ok(link.label.length > 0);
      assert.ok(link.ariaLabel.length > 0);
    }
  });
});

