import { useEffect, useRef } from 'react';
import { ChapterId } from '../utils/storyTimeline';
import {
  AtmosphericParticle,
  getAtmosphereModeForChapter,
  createAtmosphericParticles,
  stepAtmosphericParticle,
} from '../utils/atmosphericParticles';

interface WheatChaffOverlayProps {
  intensity: number;
  chapterId?: ChapterId;
}

export function WheatChaffOverlay({
  intensity,
  chapterId = 'farm',
}: WheatChaffOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;
  const chapterIdRef = useRef(chapterId);
  chapterIdRef.current = chapterId;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: AtmosphericParticle[] = [];
    let currentMode = getAtmosphereModeForChapter(chapterIdRef.current);
    let rafId = 0;
    let isRunning = false;
    let lastTime = performance.now();
    let elapsed = 0;

    const computeCount = (w: number) => Math.min(36, Math.max(16, Math.floor(w / 45)));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = computeCount(width);
      particles = createAtmosphericParticles(count, width, height, currentMode);
    };

    const drawParticle = (p: AtmosphericParticle, globalAlpha: number) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = p.opacity * globalAlpha;

      if (p.kind === 'chaff') {
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        // Tapered curved wheat husk
        const halfL = p.size * 2;
        const halfW = p.size * 0.4;
        ctx.beginPath();
        ctx.moveTo(-halfL, 0);
        ctx.quadraticCurveTo(0, -halfW * 1.6, halfL, 0);
        ctx.quadraticCurveTo(0, halfW * 0.85, -halfL, 0);
        ctx.closePath();
        ctx.fill();
      } else if (p.kind === 'ember') {
        // Glowing ember spark with halo
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
      } else if (p.kind === 'steam') {
        // Soft rising steam curl
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.filter = 'blur(4px)';
        ctx.fill();
      } else if (p.kind === 'flour') {
        // Soft powdery dust speckle
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      ctx.restore();
    };

    const renderFrame = (now: number) => {
      const currentIntensity = intensityRef.current;
      if (currentIntensity <= 0.01) {
        ctx.clearRect(0, 0, width, height);
        isRunning = false;
        rafId = 0;
        return;
      }

      const activeChapter = chapterIdRef.current;
      const targetMode = getAtmosphereModeForChapter(activeChapter);
      if (targetMode !== currentMode) {
        currentMode = targetMode;
        const count = computeCount(width);
        particles = createAtmosphericParticles(count, width, height, currentMode);
      }

      const dt = Math.min(0.08, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      elapsed += dt;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const updated = stepAtmosphericParticle(
          particles[i],
          dt,
          elapsed,
          width,
          height
        );
        particles[i] = updated;
        drawParticle(updated, currentIntensity);
      }

      rafId = requestAnimationFrame(renderFrame);
    };

    const startLoopIfNeeded = () => {
      if (!isRunning && intensityRef.current > 0.01 && !motionQuery.matches) {
        isRunning = true;
        lastTime = performance.now();
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    resize();
    startLoopIfNeeded();

    const handleVisibilityOrMotion = () => {
      if (motionQuery.matches) {
        ctx.clearRect(0, 0, width, height);
        if (rafId) cancelAnimationFrame(rafId);
        isRunning = false;
        rafId = 0;
      } else {
        startLoopIfNeeded();
      }
    };

    window.addEventListener('resize', resize, { passive: true });
    motionQuery.addEventListener('change', handleVisibilityOrMotion);

    return () => {
      window.removeEventListener('resize', resize);
      motionQuery.removeEventListener('change', handleVisibilityOrMotion);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [intensity > 0.01, chapterId]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="wheat-chaff-canvas"
      data-active={intensity > 0.01 ? 'true' : 'false'}
      aria-hidden="true"
      className="fixed inset-0 z-[5] pointer-events-none"
      style={{ opacity: intensity }}
    />
  );
}
