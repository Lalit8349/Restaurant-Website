export type ChapterId = 'farm' | 'bakery' | 'hotel' | 'customers';

export interface StoryChapter {
  id: ChapterId;
  number: string;
  label: string;
  navLabel: string;
  startProgress: number;
  endProgress: number;
  jumpProgress: number;
}

export interface StoryBeat {
  id: string;
  chapterId: ChapterId;
  sectionHeightVh: number;
  targetProgress: number;
  videoStartSeconds: number;
  videoEndSeconds: number;
  kicker: string;
  title: string;
  story: string;
  details: string[];
  alignment: 'left' | 'right' | 'center';
  isPrologue?: boolean;
  isEpilogue?: boolean;
  isTheEnd?: boolean;
}

export const VIDEO_SRC =
  '/assets/aistudio/enhanced_1080p_mobile_playable_4K_upscaled__1__c06bcc5a.mp4';
export const STORY_VIDEO_SRC = '/assets/story_journey_video.mp4';
export const LANDING_VIDEO_SRC = '/assets/landing_hero_loop.mp4';
export const TOTAL_STORY_FRAMES = 2016;
export const STORY_FRAMES_DIR = '/assets/frames';

export const DEFAULT_VIDEO_DURATION = 67.22099;
export const TOTAL_TRACK_VH = 1100;
export const MAX_SCROLL_VH = TOTAL_TRACK_VH - 100;

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'farm',
    number: '01',
    label: 'The Farm',
    navLabel: '01. Farm',
    startProgress: 0,
    endProgress: 0.28,
    jumpProgress: 0.10,
  },
  {
    id: 'bakery',
    number: '02',
    label: 'The Bakery',
    navLabel: '02. Bakery',
    startProgress: 0.28,
    endProgress: 0.50,
    jumpProgress: 0.35,
  },
  {
    id: 'hotel',
    number: '03',
    label: 'The Hotel',
    navLabel: '03. Hotel',
    startProgress: 0.50,
    endProgress: 0.72,
    jumpProgress: 0.54,
  },
  {
    id: 'customers',
    number: '04',
    label: 'The Customers',
    navLabel: '04. Customers',
    startProgress: 0.72,
    endProgress: 1.0,
    jumpProgress: 0.79,
  },
];

export const STORY_BEATS: StoryBeat[] = [
  {
    id: 'beat-prologue',
    chapterId: 'farm',
    sectionHeightVh: 100,
    targetProgress: 0.0,
    videoStartSeconds: 0.0,
    videoEndSeconds: 1.8,
    kicker: 'Golden Grain Bakery',
    title: 'From Sunlit Fields to the Grand Table',
    story:
      'Follow our daily harvest—from country grain barns and morning ovens to the hotel pastry bench and the guest table.',
    details: ['Farm', 'Bakery', 'Hotel', 'Customers'],
    alignment: 'left',
    isPrologue: true,
  },
  {
    id: 'beat-farm-barn',
    chapterId: 'farm',
    sectionHeightVh: 100,
    targetProgress: 0.10,
    videoStartSeconds: 1.8,
    videoEndSeconds: 11.5,
    kicker: 'Stage 01 · The Barn',
    title: 'Raw Grains Sorted by Hand',
    story:
      'At dawn, farmers weigh and pack breathable sacks of wheat, corn, barley, and cocoa to lock in fresh aroma.',
    details: ['Wheat', 'Corn', 'Barley', 'Cocoa'],
    alignment: 'left',
  },
  {
    id: 'beat-farm-road',
    chapterId: 'farm',
    sectionHeightVh: 100,
    targetProgress: 0.20,
    videoStartSeconds: 11.5,
    videoEndSeconds: 21.5,
    kicker: 'Stage 01 · Morning Route',
    title: 'Bound for the City Ovens',
    story:
      'Loaded onto the tractor wagon, freshly harvested grain leaves the valley windmills for the city before midday.',
    details: ['Direct Harvest', 'Fresh Milled'],
    alignment: 'right',
  },
  {
    id: 'beat-bakery-arrival',
    chapterId: 'bakery',
    sectionHeightVh: 100,
    targetProgress: 0.35,
    videoStartSeconds: 21.5,
    videoEndSeconds: 29.6,
    kicker: 'Stage 02 · Bakery Door',
    title: 'Inspected & Signed at Dawn',
    story:
      'At our striped awning, the head baker checks each sack and signs the manifest before the morning bake begins.',
    details: ['Manifest Signed', 'Stone-Milled Flour'],
    alignment: 'left',
  },
  {
    id: 'beat-bakery-dispatch',
    chapterId: 'bakery',
    sectionHeightVh: 100,
    targetProgress: 0.46,
    videoStartSeconds: 29.6,
    videoEndSeconds: 35.3,
    kicker: 'Stage 02 · Courier Dispatch',
    title: 'Baked, Boxed & Sent Warm',
    story:
      'Fresh loaves and sponges are tied in kraft parcels and handed straight to our scooter rider while still warm.',
    details: ['Hand-Tied Parcels', 'Scooter Courier'],
    alignment: 'right',
  },
  {
    id: 'beat-hotel-arrival',
    chapterId: 'hotel',
    sectionHeightVh: 100,
    targetProgress: 0.54,
    videoStartSeconds: 35.3,
    videoEndSeconds: 38.6,
    kicker: 'Stage 03 · The Grand Hotel',
    title: 'Cobblestone Doorstep Delivery',
    story:
      'Across the sunlit plaza, our rider delivers the morning bake directly to the bellhop at The Grand Hotel.',
    details: ['The Grand Hotel', 'Morning Arrival'],
    alignment: 'left',
  },
  {
    id: 'beat-hotel-kitchen',
    chapterId: 'hotel',
    sectionHeightVh: 100,
    targetProgress: 0.65,
    videoStartSeconds: 38.6,
    videoEndSeconds: 49.0,
    kicker: 'Stage 03 · Pastry Kitchen',
    title: 'Crowned with Berries & Cream',
    story:
      'Hotel pastry chefs pipe whipped cream and crown dark chocolate layers with fresh berries right before service.',
    details: ['Pastry Finishing', 'Plated to Order'],
    alignment: 'right',
  },
  {
    id: 'beat-customers-hall',
    chapterId: 'customers',
    sectionHeightVh: 200,
    targetProgress: 0.79,
    videoStartSeconds: 49.0,
    videoEndSeconds: 58.0,
    kicker: 'Stage 04 · Grand Dining Hall',
    title: 'Served Beneath Chandeliers',
    story:
      'Waiters carry tiered cakes through mahogany doors to the grand dining room, where families gather and share joy in every bite.',
    details: ['Table Service', 'The Guest Table', 'Shared Joy'],
    alignment: 'left',
  },
  {
    id: 'beat-the-end',
    chapterId: 'customers',
    sectionHeightVh: 200,
    targetProgress: 0.95,
    videoStartSeconds: 58.0,
    videoEndSeconds: DEFAULT_VIDEO_DURATION,
    kicker: 'Golden Grain Bakery · Est. 1924',
    title: 'The End',
    story:
      'From sunlit field to morning hearth, our daily story rests. Tomorrow at dawn, the ovens will warm once more.',
    details: ['Handmade Daily', 'Pure Tradition', 'Baked with Love'],
    alignment: 'center',
    isTheEnd: true,
    isEpilogue: true,
  },
];

export function clampProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function lerpProgress(
  current: number,
  target: number,
  factor = 0.25
): number {
  if (!Number.isFinite(current)) return clampProgress(target);
  if (!Number.isFinite(target)) return clampProgress(current);
  const next = current + (target - current) * factor;
  return Math.abs(target - next) < 0.0001 ? target : next;
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 >= edge1) return x >= edge1 ? 1 : 0;
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export interface StageTextMotionResult {
  opacity: number;
  y: number;
}

export function computeStageTextMotion(
  currentTimeSeconds: number,
  startTime: number,
  endTime: number,
  options?: { isPrologue?: boolean; isTheEnd?: boolean }
): StageTextMotionResult {
  const duration = Math.max(0.1, endTime - startTime);
  const u = (currentTimeSeconds - startTime) / duration;

  if (options?.isPrologue) {
    const drift = smoothstep(0, 1, Math.max(0, Math.min(1, u)));
    const yPrologue = drift === 0 ? 0 : -24 * drift;
    const opacityPrologue = u <= 0 ? 1 : 1 - smoothstep(0.50, 0.95, u);
    return { opacity: opacityPrologue, y: yPrologue };
  }

  if (options?.isTheEnd) {
    const drift = smoothstep(0, 1, Math.max(0, Math.min(1, u)));
    const yEnd = drift === 1 ? 0 : 24 - 24 * drift;
    const opacityEnd = u >= 1 ? 1 : smoothstep(0, 0.14, u);
    return { opacity: opacityEnd, y: yEnd };
  }

  // Intermediate beats: vertical drift from +24px up to -24px (rising from bottom to top)
  const clampedU = Math.max(0, Math.min(1, u));
  const drift = smoothstep(0, 1, clampedU);
  const y = 24 - 48 * drift;

  let opacity = 0;
  if (u > 0 && u < 1) {
    const fadeIn = smoothstep(0, 0.14, u);
    const fadeOut = 1 - smoothstep(0.86, 1.0, u);
    opacity = fadeIn * fadeOut;
  }

  return { opacity, y };
}

export function computeScrollProgress(
  scrollY: number,
  scrollHeight: number,
  viewportHeight: number
): number {
  const maxScroll = scrollHeight - viewportHeight;
  if (!Number.isFinite(maxScroll) || maxScroll <= 0) {
    return 0;
  }
  return clampProgress(scrollY / maxScroll);
}

export function progressToVideoTime(
  progress: number,
  duration: number
): number {
  if (!Number.isFinite(duration) || duration <= 0) {
    return 0;
  }
  return clampProgress(progress) * duration;
}

export function progressToFrameIndex(
  progress: number,
  totalFrames: number = TOTAL_STORY_FRAMES
): number {
  if (!Number.isFinite(progress)) return 1;
  const clamped = clampProgress(progress);
  return Math.min(
    totalFrames,
    Math.max(1, Math.round(clamped * (totalFrames - 1)) + 1)
  );
}

export function frameIndexToProgress(
  frameIndex: number,
  totalFrames: number = TOTAL_STORY_FRAMES
): number {
  if (!Number.isFinite(frameIndex) || totalFrames <= 1) return 0;
  const clamped = Math.min(totalFrames, Math.max(1, frameIndex));
  return clampProgress((clamped - 1) / (totalFrames - 1));
}

export function getFramePath(
  frameIndex: number,
  baseDir: string = STORY_FRAMES_DIR
): string {
  const safeIndex = Math.min(
    TOTAL_STORY_FRAMES,
    Math.max(1, Math.round(Number.isFinite(frameIndex) ? frameIndex : 1))
  );
  return `${baseDir}/${String(safeIndex).padStart(5, '0')}.jpg`;
}

export function getActiveChapter(progress: number): StoryChapter {
  const p = clampProgress(progress);
  for (let i = STORY_CHAPTERS.length - 1; i >= 0; i--) {
    if (p >= STORY_CHAPTERS[i].startProgress) {
      return STORY_CHAPTERS[i];
    }
  }
  return STORY_CHAPTERS[0];
}

export function getActiveBeat(progress: number): StoryBeat {
  const p = clampProgress(progress);
  let closest = STORY_BEATS[0];
  let smallestDistance = Math.abs(p - closest.targetProgress);

  for (let i = 1; i < STORY_BEATS.length; i++) {
    const distance = Math.abs(p - STORY_BEATS[i].targetProgress);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closest = STORY_BEATS[i];
    }
  }
  return closest;
}

export function getIdleLoopResetTime(
  currentTime: number,
  beat: StoryBeat
): number | null {
  if (!Number.isFinite(currentTime)) return beat.videoStartSeconds;
  if (currentTime >= beat.videoEndSeconds - 0.12) {
    return beat.videoStartSeconds;
  }
  if (currentTime < beat.videoStartSeconds - 0.4) {
    return beat.videoStartSeconds;
  }
  return null;
}

export function getScrollYForProgress(
  targetProgress: number,
  scrollHeight: number,
  viewportHeight: number
): number {
  const maxScroll = Math.max(0, scrollHeight - viewportHeight);
  return clampProgress(targetProgress) * maxScroll;
}

export function formatVideoTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const whole = Math.floor(seconds);
  const mins = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function getLandingVideoOpacity(progress: number): number {
  const p = clampProgress(progress);
  const fadeStart = 0.01;
  const fadeEnd = 0.04;
  if (p <= fadeStart) return 1;
  if (p >= fadeEnd) return 0;
  const t = (p - fadeStart) / (fadeEnd - fadeStart);
  // Smoothstep ease curve for continuous film dissolve (~2s equivalent at 60fps)
  const smooth = 1 - t * t * (3 - 2 * t);
  return Number(smooth.toFixed(4));
}

export function getHarvestAtmosphereOpacity(progress: number): number {
  const p = clampProgress(progress);
  const fadeStart = 0.24;
  const fadeEnd = 0.33;
  if (p <= fadeStart) return 1;
  if (p >= fadeEnd) return 0;
  return 1 - (p - fadeStart) / (fadeEnd - fadeStart);
}

export interface TopViewportFadeState {
  opacity: number;
  translateY: number;
}

/**
 * Computes scroll-linked fade-out opacity and vertical drift for a story text
 * container as it moves toward the top of the viewport so the background video
 * remains the unobstructed focal point.
 *
 * - Below `fadeStartRatio` (default 0.48 of viewport height): opacity = 1, translateY = 0
 * - Between `fadeStartRatio` (0.48) and `fadeEndRatio` (0.12): smoothstep fade from 1 -> 0
 * - Above `fadeEndRatio` (0.12): opacity = 0, translateY = -14px
 */
export function computeTopViewportFade(params: {
  elementTop: number;
  elementHeight: number;
  viewportHeight: number;
  fadeStartRatio?: number;
  fadeEndRatio?: number;
}): TopViewportFadeState {
  const {
    elementTop,
    elementHeight,
    viewportHeight,
    fadeStartRatio = 0.48,
    fadeEndRatio = 0.12,
  } = params;

  if (
    !Number.isFinite(elementTop) ||
    !Number.isFinite(elementHeight) ||
    !Number.isFinite(viewportHeight) ||
    viewportHeight <= 0
  ) {
    return { opacity: 1, translateY: 0 };
  }

  const centerY = elementTop + Math.max(0, elementHeight) * 0.5;
  const normalizedCenterY = centerY / viewportHeight;

  if (normalizedCenterY >= fadeStartRatio) {
    return { opacity: 1, translateY: 0 };
  }

  if (normalizedCenterY <= fadeEndRatio) {
    return { opacity: 0, translateY: -14 };
  }

  const span = Math.max(0.001, fadeStartRatio - fadeEndRatio);
  const t = clampProgress((normalizedCenterY - fadeEndRatio) / span);
  // Smoothstep easing for natural visual attenuation
  const smooth = t * t * (3 - 2 * t);

  const opacity = Number(smooth.toFixed(4));
  const translateY = Number((-(1 - smooth) * 14).toFixed(2));

  return {
    opacity,
    translateY: Object.is(translateY, -0) ? 0 : translateY,
  };
}

