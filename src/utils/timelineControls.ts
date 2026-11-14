import { ChapterId, STORY_CHAPTERS, clampProgress, formatVideoTime, progressToVideoTime } from './storyTimeline';

export type StorySpeed = 0.75 | 1.0 | 1.5;

export interface SpeedOption {
  speed: StorySpeed;
  label: string;
  description: string;
}

export const STORY_SPEED_OPTIONS: SpeedOption[] = [
  { speed: 0.75, label: '0.75x', description: 'Cinematic' },
  { speed: 1.0, label: '1x', description: 'Normal' },
  { speed: 1.5, label: '1.5x', description: 'Brisk' },
];

export interface ChapterThumbnailInfo {
  chapterId: ChapterId;
  frameSrc: string;
  title: string;
  subtitle: string;
  timestamp: string;
}

export const CHAPTER_THUMBNAILS: Record<ChapterId, ChapterThumbnailInfo> = {
  farm: {
    chapterId: 'farm',
    frameSrc: '/assets/frames/00080.jpg',
    title: 'The Valley Fields',
    subtitle: 'Sunlit Harvest & Morning Furrows',
    timestamp: '00:00',
  },
  bakery: {
    chapterId: 'bakery',
    frameSrc: '/assets/frames/00500.jpg',
    title: 'The Hearth Stone Oven',
    subtitle: '1924 Refractory Clay & Fire',
    timestamp: '00:07',
  },
  hotel: {
    chapterId: 'hotel',
    frameSrc: '/assets/frames/01008.jpg',
    title: 'The Grand Hotel Bench',
    subtitle: 'Pastry Lamination & Silver Service',
    timestamp: '00:15',
  },
  customers: {
    chapterId: 'customers',
    frameSrc: '/assets/frames/01512.jpg',
    title: 'The Guest Table',
    subtitle: 'Shared Joy & Fresh Sourdough',
    timestamp: '00:22',
  },
};

/**
 * Returns thumbnail info for a given chapter ID.
 */
export function getChapterThumbnail(chapterId: ChapterId): ChapterThumbnailInfo {
  return (
    CHAPTER_THUMBNAILS[chapterId] || {
      chapterId: 'farm',
      frameSrc: '/assets/frames/00080.jpg',
      title: 'The Farm',
      subtitle: 'Morning Harvest',
      timestamp: '00:00',
    }
  );
}

/**
 * Cycles to the next available story playback speed.
 */
export function getNextStorySpeed(current: StorySpeed): StorySpeed {
  switch (current) {
    case 0.75:
      return 1.0;
    case 1.0:
      return 1.5;
    case 1.5:
      return 0.75;
    default:
      return 1.0;
  }
}

/**
 * Formats scrubbing information for live tooltip and filmstrip slider.
 */
export function formatTimelineScrub(
  progress: number,
  durationSeconds: number = 30
): {
  clampedProgress: number;
  percent: number;
  timeFormatted: string;
  chapterLabel: string;
} {
  const clamped = clampProgress(progress);
  const percent = Math.round(clamped * 100);
  const timeSeconds = progressToVideoTime(clamped, durationSeconds);
  const timeFormatted = formatVideoTime(timeSeconds);

  // Find active chapter matching progress
  let matched = STORY_CHAPTERS[0];
  for (let i = STORY_CHAPTERS.length - 1; i >= 0; i--) {
    if (clamped >= STORY_CHAPTERS[i].jumpProgress) {
      matched = STORY_CHAPTERS[i];
      break;
    }
  }

  return {
    clampedProgress: clamped,
    percent,
    timeFormatted,
    chapterLabel: matched.label,
  };
}
