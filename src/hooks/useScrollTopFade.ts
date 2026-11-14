import { useEffect, useRef } from 'react';
import { computeTopViewportFade } from '../utils/storyTimeline';

interface UseScrollTopFadeOptions {
  disabled?: boolean;
  fadeStartRatio?: number;
  fadeEndRatio?: number;
}

/**
 * Scroll-linked animation hook that smoothly fades out story text containers
 * (and applies a subtle upward drift) as they move toward the top of the viewport,
 * keeping the 4K background video unobstructed in the upper/center frame.
 *
 * Updates DOM styles directly via requestAnimationFrame to maintain 60fps
 * scroll performance without React state re-renders.
 */
export function useScrollTopFade<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollTopFadeOptions = {}
) {
  const { disabled = false, fadeStartRatio = 0.48, fadeEndRatio = 0.12 } = options;
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    let rafId = 0;
    let ticking = false;

    const applyFade = () => {
      ticking = false;
      const target = elementRef.current;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 900;

      const { opacity, translateY } = computeTopViewportFade({
        elementTop: rect.top,
        elementHeight: rect.height,
        viewportHeight,
        fadeStartRatio,
        fadeEndRatio,
      });

      target.style.opacity = String(opacity);
      target.style.transform = disabled
        ? 'none'
        : `translate3d(0, ${translateY}px, 0)`;
      target.style.pointerEvents = opacity < 0.15 ? 'none' : '';
      target.dataset.topFadeOpacity = opacity.toFixed(2);
    };

    const scheduleUpdate = () => {
      if (!ticking) {
        ticking = true;
        rafId = window.requestAnimationFrame(applyFade);
      }
    };

    // Initial measurement on mount
    applyFade();

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [disabled, fadeStartRatio, fadeEndRatio]);

  return elementRef;
}
