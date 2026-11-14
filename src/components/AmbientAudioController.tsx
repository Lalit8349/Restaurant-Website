import { useEffect, useRef } from 'react';
import { computeAmbientVolumes } from '../utils/ambientAudio';

interface AmbientAudioControllerProps {
  progress: number;
}

export const FARM_AUDIO_SRC = '/assets/audio/farm-sounds.mp3';
export const BAKERY_AUDIO_SRC = '/assets/audio/bakery-bustle.mp3';

export function AmbientAudioController({
  progress,
}: AmbientAudioControllerProps) {
  const farmAudioRef = useRef<HTMLAudioElement | null>(null);
  const bakeryAudioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const { farmVolume, bakeryVolume } = computeAmbientVolumes(progress);

    if (farmAudioRef.current) {
      farmAudioRef.current.volume = farmVolume;
    }
    if (bakeryAudioRef.current) {
      bakeryAudioRef.current.volume = bakeryVolume;
    }
  }, [progress]);

  useEffect(() => {
    const tryStartAudio = () => {
      const farm = farmAudioRef.current;
      const bakery = bakeryAudioRef.current;
      if (!farm || !bakery) return;

      const { farmVolume, bakeryVolume } = computeAmbientVolumes(
        progressRef.current
      );
      farm.volume = farmVolume;
      bakery.volume = bakeryVolume;

      const startTrack = (el: HTMLAudioElement) => {
        if (!el.paused) return Promise.resolve(true);
        return el
          .play()
          .then(() => true)
          .catch(() => false);
      };

      Promise.all([startTrack(farm), startTrack(bakery)]).then(
        ([farmStarted, bakeryStarted]) => {
          if (farmStarted && bakeryStarted) {
            unlockedRef.current = true;
            window.removeEventListener('pointerdown', handleGesture);
            window.removeEventListener('keydown', handleGesture);
            window.removeEventListener('touchstart', handleGesture);
            window.removeEventListener('wheel', handleGesture);
          }
        }
      );
    };

    const handleGesture = () => {
      if (!unlockedRef.current) {
        tryStartAudio();
      }
    };

    tryStartAudio();

    window.addEventListener('pointerdown', handleGesture, { passive: true });
    window.addEventListener('keydown', handleGesture, { passive: true });
    window.addEventListener('touchstart', handleGesture, { passive: true });
    window.addEventListener('wheel', handleGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('wheel', handleGesture);
    };
  }, []);

  return (
    <div hidden aria-hidden="true" data-testid="ambient-audio-group">
      <audio
        ref={farmAudioRef}
        src={FARM_AUDIO_SRC}
        loop
        preload="auto"
        data-testid="ambient-farm-audio"
      />
      <audio
        ref={bakeryAudioRef}
        src={BAKERY_AUDIO_SRC}
        loop
        preload="auto"
        data-testid="ambient-bakery-audio"
      />
    </div>
  );
}
