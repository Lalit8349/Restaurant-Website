import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CHAPTER_THUMBNAILS,
  STORY_SPEED_OPTIONS,
  formatTimelineScrub,
  getChapterThumbnail,
  getNextStorySpeed,
} from './timelineControls';

test('timelineControls provides story speed options and cycling', () => {
  assert.equal(STORY_SPEED_OPTIONS.length, 3);
  assert.equal(STORY_SPEED_OPTIONS[0].speed, 0.75);
  assert.equal(STORY_SPEED_OPTIONS[1].speed, 1.0);
  assert.equal(STORY_SPEED_OPTIONS[2].speed, 1.5);

  assert.equal(getNextStorySpeed(0.75), 1.0);
  assert.equal(getNextStorySpeed(1.0), 1.5);
  assert.equal(getNextStorySpeed(1.5), 0.75);
});

test('timelineControls maps chapters to valid frame images', () => {
  const farmThumb = getChapterThumbnail('farm');
  assert.equal(farmThumb.frameSrc, '/assets/frames/00080.jpg');
  assert.match(farmThumb.title, /Valley/);

  const bakeryThumb = getChapterThumbnail('bakery');
  assert.equal(bakeryThumb.frameSrc, '/assets/frames/00500.jpg');

  const hotelThumb = getChapterThumbnail('hotel');
  assert.equal(hotelThumb.frameSrc, '/assets/frames/01008.jpg');

  const customersThumb = getChapterThumbnail('customers');
  assert.equal(customersThumb.frameSrc, '/assets/frames/01512.jpg');
});

test('formatTimelineScrub accurately computes percent and active chapter', () => {
  const start = formatTimelineScrub(0);
  assert.equal(start.percent, 0);
  assert.equal(start.timeFormatted, '00:00');
  assert.equal(start.chapterLabel, 'The Farm');

  const midBakery = formatTimelineScrub(0.35);
  assert.equal(midBakery.percent, 35);
  assert.equal(midBakery.chapterLabel, 'The Bakery');

  const end = formatTimelineScrub(0.9);
  assert.equal(end.percent, 90);
  assert.equal(end.chapterLabel, 'The Customers');
});
