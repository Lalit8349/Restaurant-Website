export interface WheatChaffParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  width: number;
  rotation: number;
  angularVelocity: number;
  swayPhase: number;
  swayFrequency: number;
  swayAmplitude: number;
  opacity: number;
  color: string;
}

const CHAFF_COLORS = [
  'rgba(253, 230, 138, 1)',
  'rgba(245, 208, 108, 1)',
  'rgba(234, 179, 8, 1)',
  'rgba(254, 243, 199, 1)',
];

export function computeChaffCount(viewportWidth: number): number {
  if (!Number.isFinite(viewportWidth) || viewportWidth <= 0) return 16;
  return Math.min(28, Math.max(12, Math.floor(viewportWidth / 52)));
}

export function createWheatChaffParticles(
  count: number,
  width: number,
  height: number,
  rng: () => number = Math.random
): WheatChaffParticle[] {
  const safeCount = Math.max(0, Math.floor(count));
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  const particles: WheatChaffParticle[] = [];

  for (let i = 0; i < safeCount; i++) {
    particles.push({
      x: rng() * safeWidth,
      y: rng() * safeHeight,
      vx: 20 + rng() * 28,
      vy: 6 + rng() * 14,
      length: 6 + rng() * 8,
      width: 1.4 + rng() * 1.8,
      rotation: rng() * Math.PI * 2,
      angularVelocity: (rng() - 0.5) * 1.4,
      swayPhase: rng() * Math.PI * 2,
      swayFrequency: 0.7 + rng() * 0.9,
      swayAmplitude: 8 + rng() * 14,
      opacity: 0.24 + rng() * 0.3,
      color: CHAFF_COLORS[i % CHAFF_COLORS.length],
    });
  }

  return particles;
}

export function stepWheatChaffParticle(
  particle: WheatChaffParticle,
  dtSeconds: number,
  elapsedSeconds: number,
  width: number,
  height: number
): WheatChaffParticle {
  const safeDt = Math.min(0.1, Math.max(0, dtSeconds));
  const swayOffset =
    Math.sin(elapsedSeconds * particle.swayFrequency + particle.swayPhase) *
    particle.swayAmplitude;

  let nextX = particle.x + particle.vx * safeDt;
  let nextY = particle.y + (particle.vy + swayOffset) * safeDt;
  const nextRotation = particle.rotation + particle.angularVelocity * safeDt;

  const margin = 24;
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
    ...particle,
    x: nextX,
    y: nextY,
    rotation: nextRotation,
  };
}
