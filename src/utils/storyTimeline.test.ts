import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STORY_BEATS,
  STORY_CHAPTERS,
  TOTAL_TRACK_VH,
  TOTAL_STORY_FRAMES,
  DEFAULT_VIDEO_DURATION,
  clampProgress,
  computeScrollProgress,
  progressToVideoTime,
  progressToFrameIndex,
  frameIndexToProgress,
  getFramePath,
  getActiveChapter,
  getActiveBeat,
  getScrollYForProgress,
  formatVideoTime,
  getHarvestAtmosphereOpacity,
  getIdleLoopResetTime,
  computeTopViewportFade,
  getLandingVideoOpacity,
  LANDING_VIDEO_SRC,
  lerpProgress,
  smoothstep,
  computeStageTextMotion,
} from './storyTimeline';

test('STORY_BEATS section heights sum to TOTAL_TRACK_VH', () => {
  const sum = STORY_BEATS.reduce((acc, beat) => acc + beat.sectionHeightVh, 0);
  assert.equal(sum, TOTAL_TRACK_VH);
});

test('STORY_BEATS targetProgress values are monotonically increasing', () => {
  for (let i = 1; i < STORY_BEATS.length; i++) {
    assert.ok(
      STORY_BEATS[i].targetProgress > STORY_BEATS[i - 1].targetProgress,
      `Beat ${STORY_BEATS[i].id} should follow ${STORY_BEATS[i - 1].id}`
    );
    assert.ok(
      STORY_BEATS[i].videoEndSeconds > STORY_BEATS[i].videoStartSeconds,
      `Beat ${STORY_BEATS[i].id} should have valid video range`
    );
  }
});

test('clampProgress bounds invalid and out-of-range inputs', () => {
  assert.equal(clampProgress(-0.5), 0);
  assert.equal(clampProgress(1.4), 1);
  assert.equal(clampProgress(Number.NaN), 0);
  assert.equal(clampProgress(0.42), 0.42);
});

test('computeScrollProgress maps scrollY accurately', () => {
  assert.equal(computeScrollProgress(0, 9600, 900), 0);
  assert.equal(computeScrollProgress(8700, 9600, 900), 1);
  assert.equal(computeScrollProgress(4350, 9600, 900), 0.5);
  assert.equal(computeScrollProgress(100, 800, 900), 0);
});

test('progressToVideoTime maps 0..1 to video duration', () => {
  assert.equal(progressToVideoTime(0, DEFAULT_VIDEO_DURATION), 0);
  assert.equal(
    progressToVideoTime(1, DEFAULT_VIDEO_DURATION),
    DEFAULT_VIDEO_DURATION
  );
  assert.equal(progressToVideoTime(0.5, 60), 30);
  assert.equal(progressToVideoTime(0.5, 0), 0);
});

test('getActiveChapter transitions cleanly across farm, bakery, hotel, and customers', () => {
  assert.equal(getActiveChapter(0).id, 'farm');
  assert.equal(getActiveChapter(0.24).id, 'farm');
  assert.equal(getActiveChapter(0.35).id, 'bakery');
  assert.equal(getActiveChapter(0.56).id, 'hotel');
  assert.equal(getActiveChapter(0.85).id, 'customers');
  assert.equal(getActiveChapter(1.0).id, 'customers');
  assert.equal(STORY_CHAPTERS.length, 4);
});

test('getActiveBeat finds closest beat for each scroll milestone', () => {
  assert.equal(getActiveBeat(0).id, 'beat-prologue');
  assert.equal(getActiveBeat(0.14).id, 'beat-farm-barn');
  assert.equal(getActiveBeat(0.34).id, 'beat-bakery-arrival');
  assert.equal(getActiveBeat(0.54).id, 'beat-hotel-arrival');
  assert.equal(getActiveBeat(0.79).id, 'beat-customers-hall');
  assert.equal(getActiveBeat(0.94).id, 'beat-the-end');
  assert.equal(getActiveBeat(0.99).id, 'beat-the-end');
});

test('getScrollYForProgress computes exact scroll pixel offset', () => {
  assert.equal(getScrollYForProgress(0, 9600, 900), 0);
  assert.equal(getScrollYForProgress(0.5, 9600, 900), 4350);
  assert.equal(getScrollYForProgress(1, 9600, 900), 8700);
});

test('formatVideoTime formats seconds as MM:SS', () => {
  assert.equal(formatVideoTime(0), '00:00');
  assert.equal(formatVideoTime(9.8), '00:09');
  assert.equal(formatVideoTime(67.22), '01:07');
  assert.equal(formatVideoTime(-3), '00:00');
});

test('getHarvestAtmosphereOpacity stays full in Harvest chapters and fades out cleanly before Bakery', () => {
  assert.equal(getHarvestAtmosphereOpacity(0), 1);
  assert.equal(getHarvestAtmosphereOpacity(0.18), 1);
  assert.equal(getHarvestAtmosphereOpacity(0.24), 1);
  const midFade = getHarvestAtmosphereOpacity(0.285);
  assert.ok(midFade > 0.45 && midFade < 0.55);
  assert.equal(getHarvestAtmosphereOpacity(0.33), 0);
  assert.equal(getHarvestAtmosphereOpacity(0.75), 0);
});

test('getIdleLoopResetTime loops smoothly inside active stage window', () => {
  const bakeryBeat = STORY_BEATS[3];
  assert.equal(getIdleLoopResetTime(25.0, bakeryBeat), null);
  assert.equal(
    getIdleLoopResetTime(bakeryBeat.videoEndSeconds - 0.05, bakeryBeat),
    bakeryBeat.videoStartSeconds
  );
  assert.equal(
    getIdleLoopResetTime(bakeryBeat.videoStartSeconds - 1.0, bakeryBeat),
    bakeryBeat.videoStartSeconds
  );
});

test('computeTopViewportFade keeps full opacity in reading zone and fades out toward top of viewport', () => {
  // Lower reading zone (center at 650px / 900px = 0.722)
  const readingZone = computeTopViewportFade({
    elementTop: 550,
    elementHeight: 200,
    viewportHeight: 900,
  });
  assert.equal(readingZone.opacity, 1);
  assert.equal(readingZone.translateY, 0);

  // Mid-upper fade zone (center at 270px / 900px = 0.30, halfway between 0.48 and 0.12)
  const midUpper = computeTopViewportFade({
    elementTop: 170,
    elementHeight: 200,
    viewportHeight: 900,
  });
  assert.equal(midUpper.opacity, 0.5);
  assert.equal(midUpper.translateY, -7);

  // Near top of viewport (center at 80px / 900px = 0.088 <= 0.12)
  const topEdge = computeTopViewportFade({
    elementTop: -20,
    elementHeight: 200,
    viewportHeight: 900,
  });
  assert.equal(topEdge.opacity, 0);
  assert.equal(topEdge.translateY, -14);
});

test('getLandingVideoOpacity stays 1 on landing page and crossfades to 0 into story', () => {
  assert.equal(getLandingVideoOpacity(0), 1);
  assert.equal(getLandingVideoOpacity(0.01), 1);
  const mid = getLandingVideoOpacity(0.025);
  assert.equal(mid, 0.5);
  assert.equal(getLandingVideoOpacity(0.04), 0);
  assert.equal(getLandingVideoOpacity(0.12), 0);
  assert.equal(getLandingVideoOpacity(0.25), 0);
  assert.ok(LANDING_VIDEO_SRC.includes('landing_hero_loop.mp4'));
});

test('progressToFrameIndex maps 0..1 to 1..2016 accurately with zero-padding paths', () => {
  assert.equal(TOTAL_STORY_FRAMES, 2016);
  assert.equal(progressToFrameIndex(0), 1);
  assert.equal(progressToFrameIndex(1), 2016);
  assert.equal(progressToFrameIndex(-0.5), 1);
  assert.equal(progressToFrameIndex(1.5), 2016);
  assert.equal(progressToFrameIndex(Number.NaN), 1);

  // Midpoint
  const midFrame = progressToFrameIndex(0.5);
  assert.equal(midFrame, 1009);

  // Inverse mapping
  assert.equal(frameIndexToProgress(1), 0);
  assert.equal(frameIndexToProgress(2016), 1);
  assert.ok(Math.abs(frameIndexToProgress(1009) - 0.5) < 0.001);

  // Frame path formatting
  assert.equal(getFramePath(1), '/assets/frames/00001.jpg');
  assert.equal(getFramePath(9), '/assets/frames/00009.jpg');
  assert.equal(getFramePath(42), '/assets/frames/00042.jpg');
  assert.equal(getFramePath(1000), '/assets/frames/01000.jpg');
  assert.equal(getFramePath(2016), '/assets/frames/02016.jpg');
  assert.equal(getFramePath(3000), '/assets/frames/02016.jpg');
  assert.equal(getFramePath(-10), '/assets/frames/00001.jpg');
});

test('smoothstep calculates Hermite curves with zero slope at endpoints', () => {
  assert.equal(smoothstep(0, 10, 0), 0);
  assert.equal(smoothstep(0, 10, 5), 0.5);
  assert.equal(smoothstep(0, 10, 10), 1);
  assert.equal(smoothstep(0, 10, -5), 0);
  assert.equal(smoothstep(0, 10, 15), 1);
  // Equal edges edge case
  assert.equal(smoothstep(5, 5, 5), 1);
  assert.equal(smoothstep(5, 5, 3), 0);
});

test('computeStageTextMotion glides vertical drift y from +24px to -24px and fades with Hermite curves', () => {
  const startTime = 20.0;
  const endTime = 30.0; // 10s duration

  // Before stage: hidden with opacity 0
  const before = computeStageTextMotion(15.0, startTime, endTime);
  assert.equal(before.opacity, 0);

  // At start: y = +24px, opacity begins at 0
  const atStart = computeStageTextMotion(20.0, startTime, endTime);
  assert.equal(atStart.opacity, 0);
  assert.equal(atStart.y, 24);

  // At 22% entry: fully visible with opacity 1.0, y drifting upward
  const atEntry = computeStageTextMotion(22.2, startTime, endTime);
  assert.ok(atEntry.opacity >= 0.99);
  assert.ok(atEntry.y < 24 && atEntry.y > 0);

  // Midpoint (u = 0.5): y = 0px, opacity = 1.0
  const mid = computeStageTextMotion(25.0, startTime, endTime);
  assert.equal(mid.opacity, 1.0);
  assert.ok(Math.abs(mid.y) < 0.001);

  // Near exit (u = 0.89): opacity fading, y near -20px
  const nearExit = computeStageTextMotion(28.9, startTime, endTime);
  assert.ok(nearExit.opacity < 1.0 && nearExit.opacity > 0);
  assert.ok(nearExit.y < 0);

  // At end: opacity = 0, y = -24px
  const atEnd = computeStageTextMotion(30.0, startTime, endTime);
  assert.equal(atEnd.opacity, 0);
  assert.equal(atEnd.y, -24);

  // After stage: opacity = 0
  const after = computeStageTextMotion(35.0, startTime, endTime);
  assert.equal(after.opacity, 0);
  assert.equal(after.y, -24);
});

test('computeStageTextMotion handles prologue and epilogue special cases', () => {
  // Prologue is visible at start (landing) and drifts upward from 0 to -24px
  const prologueLanding = computeStageTextMotion(0, 0, 5, { isPrologue: true });
  assert.equal(prologueLanding.opacity, 1);
  assert.equal(prologueLanding.y, 0);

  // The End stage fades in and remains visible at the finale
  const theEndFinale = computeStageTextMotion(70, 64, 67, { isTheEnd: true });
  assert.equal(theEndFinale.opacity, 1);
  assert.equal(theEndFinale.y, 0);
});




