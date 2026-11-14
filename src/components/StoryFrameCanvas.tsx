import { useEffect, useRef, useState, useCallback } from 'react';
import {
  TOTAL_STORY_FRAMES,
  getFramePath,
  progressToFrameIndex,
} from '../utils/storyTimeline';

interface StoryFrameCanvasProps {
  progress: number;
  opacity?: number;
  onFirstFrameReady?: () => void;
}

const KEYFRAME_INTERVAL = 35;

// Generate persistent anchor keyframe indices across the 2016-frame story
const ANCHOR_KEYFRAMES: number[] = (() => {
  const list: number[] = [1];
  for (let i = KEYFRAME_INTERVAL; i < TOTAL_STORY_FRAMES; i += KEYFRAME_INTERVAL) {
    list.push(i);
  }
  if (!list.includes(TOTAL_STORY_FRAMES)) {
    list.push(TOTAL_STORY_FRAMES);
  }
  return list;
})();

const KEYFRAME_SET = new Set(ANCHOR_KEYFRAMES);

function getMobileLimits() {
  const isMobile =
    typeof window !== 'undefined' &&
    (window.innerWidth < 768 || (navigator.maxTouchPoints && navigator.maxTouchPoints > 1));
  return {
    isMobile,
    maxCacheSize: isMobile ? 70 : 180,
    prefetchForward: isMobile ? 28 : 64,
    prefetchBackward: isMobile ? 10 : 20,
    dprCap: isMobile ? 1.5 : 2.0,
  };
}

export function StoryFrameCanvas({
  progress,
  opacity = 1,
  onFirstFrameReady,
}: StoryFrameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingFramesRef = useRef<Set<number>>(new Set());
  const rafIdRef = useRef<number>(0);
  const currentTargetFrameRef = useRef(1);
  const smoothFrameRef = useRef(1.0);
  const lastTimestampRef = useRef(performance.now());
  const lastDrawnFloatRef = useRef<number>(-1);

  const [isInitialReady, setIsInitialReady] = useState(false);
  const renderFrameCompositeRef = useRef<((floatFrame: number) => void) | null>(null);

  // Compute target frame from progress
  currentTargetFrameRef.current = progressToFrameIndex(
    progress,
    TOTAL_STORY_FRAMES
  );

  const loadFrame = useCallback(
    (frameIndex: number): Promise<HTMLImageElement | null> => {
      const safeIndex = Math.min(TOTAL_STORY_FRAMES, Math.max(1, frameIndex));
      if (imageCacheRef.current.has(safeIndex)) {
        return Promise.resolve(imageCacheRef.current.get(safeIndex)!);
      }
      if (loadingFramesRef.current.has(safeIndex)) {
        return Promise.resolve(null);
      }

      loadingFramesRef.current.add(safeIndex);
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFramePath(safeIndex);
        img.onload = () => {
          loadingFramesRef.current.delete(safeIndex);
          imageCacheRef.current.set(safeIndex, img);

          // If this frame just loaded and matches or is adjacent to the current active smooth frame, repaint immediately
          const currentF = smoothFrameRef.current;
          if (Math.abs(safeIndex - currentF) <= 1.2) {
            renderFrameCompositeRef.current?.(currentF);
          }
          resolve(img);
        };
        img.onerror = () => {
          loadingFramesRef.current.delete(safeIndex);
          resolve(null);
        };
      });
    },
    []
  );

  // Prune non-keyframe images to maintain strict device memory limits
  const pruneCache = useCallback((centerFrame: number) => {
    const { maxCacheSize } = getMobileLimits();
    const cache = imageCacheRef.current;
    if (cache.size <= maxCacheSize) return;

    const evictable: { frame: number; dist: number }[] = [];
    cache.forEach((_, frame) => {
      // Protect keyframes and a generous safety window around current position
      if (!KEYFRAME_SET.has(frame) && Math.abs(frame - centerFrame) > 20) {
        evictable.push({
          frame,
          dist: Math.abs(frame - centerFrame),
        });
      }
    });

    evictable.sort((a, b) => b.dist - a.dist);
    const toRemove = cache.size - maxCacheSize;
    for (let i = 0; i < toRemove && i < evictable.length; i++) {
      cache.delete(evictable[i].frame);
    }
  }, []);

  // Responsive drawing with aspect-ratio cover
  const drawImageOnCanvas = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      canvasWidth: number,
      canvasHeight: number,
      alpha: number = 1.0
    ) => {
      const imgWidth = img.naturalWidth || 3840;
      const imgHeight = img.naturalHeight || 2160;
      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) * 0.5;
        offsetY = 0;
      } else {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) * 0.5;
      }

      if (alpha < 1.0) {
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      }
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      if (alpha < 1.0) {
        ctx.globalAlpha = 1.0;
      }
    },
    []
  );

  // Sub-frame optical blending for liquid 60/120fps scrubbing
  const renderFrameComposite = useCallback(
    (floatFrame: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      if (canvasWidth === 0 || canvasHeight === 0) return;

      const floorFrame = Math.max(1, Math.min(TOTAL_STORY_FRAMES, Math.floor(floatFrame)));
      const ceilFrame = Math.max(1, Math.min(TOTAL_STORY_FRAMES, Math.ceil(floatFrame)));
      const fraction = floatFrame - floorFrame;

      let baseImg = imageCacheRef.current.get(floorFrame);

      // If floorFrame is missing, find nearest available cached frame
      if (!baseImg || !baseImg.complete || baseImg.naturalWidth === 0) {
        let bestDist = Infinity;
        let bestFrame = 1;
        imageCacheRef.current.forEach((img, f) => {
          if (img.complete && img.naturalWidth > 0) {
            const dist = Math.abs(f - floorFrame);
            if (dist < bestDist) {
              bestDist = dist;
              bestFrame = f;
            }
          }
        });
        baseImg = imageCacheRef.current.get(bestFrame);
        loadFrame(floorFrame);
      }

      if (baseImg && baseImg.complete && baseImg.naturalWidth > 0) {
        drawImageOnCanvas(ctx, baseImg, canvasWidth, canvasHeight, 1.0);
      }

      // If between frames and ceil frame is available, crossfade sub-frame for continuous high-FPS motion
      if (fraction > 0.04 && ceilFrame !== floorFrame) {
        const ceilImg = imageCacheRef.current.get(ceilFrame);
        if (ceilImg && ceilImg.complete && ceilImg.naturalWidth > 0) {
          drawImageOnCanvas(ctx, ceilImg, canvasWidth, canvasHeight, fraction);
        } else {
          loadFrame(ceilFrame);
        }
      }

      lastDrawnFloatRef.current = floatFrame;
    },
    [drawImageOnCanvas, loadFrame]
  );

  renderFrameCompositeRef.current = renderFrameComposite;

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { dprCap } = getMobileLimits();
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    const rect = canvas.getBoundingClientRect();
    const targetWidth = Math.round((rect.width || window.innerWidth) * dpr);
    const targetHeight = Math.round((rect.height || window.innerHeight) * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      if (lastDrawnFloatRef.current >= 1) {
        renderFrameComposite(lastDrawnFloatRef.current);
      }
    }
  }, [renderFrameComposite]);

  // Initial mount: load frame 1, schedule keyframes
  useEffect(() => {
    resizeCanvas();
    let isMounted = true;

    loadFrame(1).then((img) => {
      if (!isMounted || !img) return;
      setIsInitialReady(true);
      renderFrameComposite(1.0);
      if (onFirstFrameReady) {
        onFirstFrameReady();
      }

      // Preload first 35 frames so initial scrub and chapter 1 are instant
      for (let f = 2; f <= 35; f++) {
        loadFrame(f);
      }

      // Gentle keyframe background loading
      let idx = 0;
      const preloadKeyframeBatch = () => {
        if (!isMounted || idx >= ANCHOR_KEYFRAMES.length) return;
        const batch = ANCHOR_KEYFRAMES.slice(idx, idx + 4);
        idx += 4;
        Promise.all(batch.map((f) => loadFrame(f))).then(() => {
          if (isMounted) {
            if ('requestIdleCallback' in window) {
              (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(preloadKeyframeBatch);
            } else {
              setTimeout(preloadKeyframeBatch, 60);
            }
          }
        });
      };

      if ('requestIdleCallback' in window) {
        (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(preloadKeyframeBatch);
      } else {
        setTimeout(preloadKeyframeBatch, 60);
      }
    });

    const handleResize = () => resizeCanvas();
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
    };
  }, [loadFrame, renderFrameComposite, resizeCanvas, onFirstFrameReady]);

  // Continuous high-FPS animation loop (LERP interpolation)
  useEffect(() => {
    lastTimestampRef.current = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTimestampRef.current) / 1000);
      lastTimestampRef.current = now;

      const target = currentTargetFrameRef.current;
      const current = smoothFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.005) {
        // Frame-rate independent exponential smoothing (~14 rate gives responsive cinematic glide)
        const blend = 1 - Math.exp(-14 * dt);
        const next = current + diff * blend;
        smoothFrameRef.current = next;
        renderFrameComposite(next);
      } else if (Math.abs(lastDrawnFloatRef.current - target) > 0.01) {
        smoothFrameRef.current = target;
        renderFrameComposite(target);
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [renderFrameComposite]);

  // Preload frames ahead of scroll direction with mobile bandwidth budgeting
  useEffect(() => {
    const { prefetchForward, prefetchBackward } = getMobileLimits();
    const target = currentTargetFrameRef.current;
    const current = smoothFrameRef.current;
    const isForward = target >= current;

    const start = isForward
      ? Math.max(1, Math.round(current) - prefetchBackward)
      : Math.max(1, Math.round(current) - prefetchForward);
    const end = isForward
      ? Math.min(TOTAL_STORY_FRAMES, Math.round(current) + prefetchForward)
      : Math.min(TOTAL_STORY_FRAMES, Math.round(current) + prefetchBackward);

    for (let f = start; f <= end; f++) {
      if (!imageCacheRef.current.has(f) && !loadingFramesRef.current.has(f)) {
        loadFrame(f);
      }
    }

    pruneCache(Math.round(current));
  }, [progress, loadFrame, pruneCache]);

  return (
    <div
      className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-[2000ms] ease-in-out"
      style={{ opacity }}
      data-testid="story-frame-canvas-container"
      data-initial-ready={isInitialReady}
      data-current-frame={Math.round(smoothFrameRef.current)}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full object-cover"
        aria-label="Story mode 4K background scroll frame animation"
      />
    </div>
  );
}
