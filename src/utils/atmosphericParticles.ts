import { ChapterId } from './storyTimeline';

export type ParticleKind = 'chaff' | 'ember' | 'steam' | 'flour';

export interface AtmosphericParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  kind: ParticleKind;
  opacity: number;
  rotation: number;
  angularVelocity: number;
  swayPhase: number;
  swayFrequency: number;
  swayAmplitude: number;
  color: string;
}

export type AtmosphereMode = 'farm' | 'hearth' | 'pastry' | 'celebration';

export function getAtmosphereModeForChapter(chapterId: ChapterId): AtmosphereMode {
  switch (chapterId) {
    case 'farm':
      return 'farm';
    case 'bakery':
      return 'hearth';
    case 'hotel':
      return 'pastry';
    case 'customers':
    default:
      return 'celebration';
  }
}

const CHAFF_COLORS = ['#fde68a', '#f5d06c', '#eab308', '#fef3c7'];
const EMBER_COLORS = ['#ff4500', '#ff8c00', '#ffa500', '#ffd700'];
const STEAM_COLORS = ['rgba(240, 240, 245, 0.25)', 'rgba(255, 255, 255, 0.2)'];
const FLOUR_COLORS = ['rgba(255, 255, 255, 0.7)', 'rgba(254, 250, 235, 0.8)', 'rgba(245, 240, 220, 0.6)'];

export function createAtmosphericParticles(
  count: number,
  width: number,
  height: number,
  mode: AtmosphereMode,
  rng: () => number = Math.random
): AtmosphericParticle[] {
  const safeCount = Math.max(0, Math.floor(count));
  const particles: AtmosphericParticle[] = [];

  for (let i = 0; i < safeCount; i++) {
    let kind: ParticleKind = 'chaff';
    let vx = 15 + rng() * 25;
    let vy = 8 + rng() * 12;
    let size = 3 + rng() * 4;
    let color = CHAFF_COLORS[i % CHAFF_COLORS.length];
    let opacity = 0.25 + rng() * 0.35;

    if (mode === 'hearth') {
      // 70% embers rising upward, 30% soft steam curls
      if (rng() < 0.7) {
        kind = 'ember';
        vx = (rng() - 0.5) * 15;
        vy = -(25 + rng() * 35); // Rising upward
        size = 2 + rng() * 3.5;
        color = EMBER_COLORS[Math.floor(rng() * EMBER_COLORS.length)];
        opacity = 0.5 + rng() * 0.45;
      } else {
        kind = 'steam';
        vx = (rng() - 0.5) * 10;
        vy = -(12 + rng() * 18); // Gentle rising steam
        size = 14 + rng() * 22; // Soft cloud puffs
        color = STEAM_COLORS[Math.floor(rng() * STEAM_COLORS.length)];
        opacity = 0.12 + rng() * 0.15;
      }
    } else if (mode === 'pastry') {
      kind = 'flour';
      vx = (rng() - 0.5) * 14;
      vy = 8 + rng() * 14; // Soft falling powdery dust
      size = 1.5 + rng() * 2.5;
      color = FLOUR_COLORS[Math.floor(rng() * FLOUR_COLORS.length)];
      opacity = 0.35 + rng() * 0.4;
    } else if (mode === 'celebration') {
      // Warm golden sparkles and gentle chaff
      kind = rng() < 0.5 ? 'ember' : 'chaff';
      vx = (rng() - 0.5) * 20;
      vy = 5 + rng() * 15;
      size = 2.5 + rng() * 4;
      color = rng() < 0.5 ? '#ffd700' : '#f5d06c';
      opacity = 0.3 + rng() * 0.4;
    }

    particles.push({
      x: rng() * width,
      y: rng() * height,
      vx,
      vy,
      size,
      kind,
      opacity,
      rotation: rng() * Math.PI * 2,
      angularVelocity: (rng() - 0.5) * 2,
      swayPhase: rng() * Math.PI * 2,
      swayFrequency: 0.8 + rng() * 1.2,
      swayAmplitude: 6 + rng() * 12,
      color,
    });
  }

  return particles;
}

export function stepAtmosphericParticle(
  p: AtmosphericParticle,
  dtSeconds: number,
  elapsedSeconds: number,
  width: number,
  height: number
): AtmosphericParticle {
  const safeDt = Math.min(0.1, Math.max(0, dtSeconds));
  const swayOffset =
    Math.sin(elapsedSeconds * p.swayFrequency + p.swayPhase) * p.swayAmplitude;

  let nextX = p.x + (p.vx + (p.kind === 'flour' || p.kind === 'steam' ? swayOffset : 0)) * safeDt;
  let nextY = p.y + (p.vy + (p.kind === 'chaff' ? swayOffset : 0)) * safeDt;
  const nextRotation = p.rotation + p.angularVelocity * safeDt;

  const margin = p.size * 2 + 30;

  if (nextX > width + margin) {
    nextX = -margin;
  } else if (nextX < -margin) {
    nextX = width + margin;
  }

  if (nextY > height + margin) {
    nextY = -margin;
  } else if (nextY < -margin) {
    nextY = height + margin;
  }

  return {
    ...p,
    x: nextX,
    y: nextY,
    rotation: nextRotation,
  };
}
