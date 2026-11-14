import { ChapterId, STORY_CHAPTERS, clampProgress } from './storyTimeline';

export interface MemorySequence {
  id: ChapterId;
  sequenceNumber: string;
  codeName: string;
  shortLabel: string;
  targetProgress: number;
  syncPercent: number;
}

export const MEMORY_SEQUENCES: MemorySequence[] = [
  {
    id: 'farm',
    sequenceNumber: 'SEQ 01',
    codeName: 'VALLEY FIELDS & HARVEST',
    shortLabel: 'The Farm',
    targetProgress: 0.10,
    syncPercent: 25,
  },
  {
    id: 'bakery',
    sequenceNumber: 'SEQ 02',
    codeName: 'HEARTH FIRE & 1924 STONE',
    shortLabel: 'The Hearth',
    targetProgress: 0.35,
    syncPercent: 50,
  },
  {
    id: 'hotel',
    sequenceNumber: 'SEQ 03',
    codeName: 'GRAND HOTEL PASTRY BENCH',
    shortLabel: 'Pastry Bench',
    targetProgress: 0.54,
    syncPercent: 75,
  },
  {
    id: 'customers',
    sequenceNumber: 'SEQ 04',
    codeName: 'COMMUNION & GUEST TABLE',
    shortLabel: 'The Guests',
    targetProgress: 0.79,
    syncPercent: 100,
  },
];

/**
 * Returns formatted Animus synchronization percentage (0% to 100%).
 */
export function getAnimusSyncPercent(progress: number): number {
  const clamped = clampProgress(progress);
  return Math.min(100, Math.max(0, Math.round(clamped * 100)));
}

/**
 * Returns active Memory Sequence info based on story progress.
 */
export function getActiveMemorySequence(progress: number): MemorySequence {
  const clamped = clampProgress(progress);
  for (let i = STORY_CHAPTERS.length - 1; i >= 0; i--) {
    const ch = STORY_CHAPTERS[i];
    if (clamped >= ch.startProgress) {
      const seq = MEMORY_SEQUENCES.find((s) => s.id === ch.id);
      if (seq) return seq;
    }
  }
  return MEMORY_SEQUENCES[0];
}

/**
 * Calculates vertical pixel offset for the Animus blade playhead given the track height.
 */
export function calculateAnimusPlayheadY(progress: number, trackHeightPx: number): number {
  const clamped = clampProgress(progress);
  return Math.round(clamped * Math.max(0, trackHeightPx));
}
