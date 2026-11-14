import { clampProgress } from './storyTimeline';

export const AMBIENT_MAX_VOLUME = 0.08;

export interface AmbientVolumes {
  farmVolume: number;
  bakeryVolume: number;
}

export function computeAmbientVolumes(
  progress: number,
  maxVolume: number = AMBIENT_MAX_VOLUME
): AmbientVolumes {
  const safeMax = Number.isFinite(maxVolume)
    ? Math.min(1, Math.max(0, maxVolume))
    : AMBIENT_MAX_VOLUME;
  const p = clampProgress(progress);

  // Pure farm ambiance on the farm/barn chapters (0.00 -> 0.24)
  if (p <= 0.24) {
    return { farmVolume: safeMax, bakeryVolume: 0 };
  }

  // Smooth crossfade from farm sounds to bakery bustle (0.24 -> 0.36)
  if (p < 0.36) {
    const t = (p - 0.24) / (0.36 - 0.24);
    return {
      farmVolume: Number((safeMax * (1 - t)).toFixed(4)),
      bakeryVolume: Number((safeMax * t).toFixed(4)),
    };
  }

  // Warm bakery & hotel kitchen bustle (0.36 -> 0.72)
  if (p <= 0.72) {
    return { farmVolume: 0, bakeryVolume: safeMax };
  }

  // Gentle fade toward soft dining-room ambiance at the end (0.72 -> 1.00)
  const tailT = (p - 0.72) / (1.0 - 0.72);
  const diningFactor = 1 - tailT * 0.35;
  return {
    farmVolume: 0,
    bakeryVolume: Number((safeMax * diningFactor).toFixed(4)),
  };
}
