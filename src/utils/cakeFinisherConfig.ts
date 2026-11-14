export type ToppingType =
  | 'rosette'
  | 'strawberry'
  | 'blueberry'
  | 'chocolate'
  | 'gold-leaf'
  | 'cherry';

export interface ToppingOption {
  type: ToppingType;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export const TOPPING_OPTIONS: ToppingOption[] = [
  {
    type: 'rosette',
    name: 'Cream Rosette',
    emoji: '🍥',
    color: '#fffbf0',
    description: 'Chantilly whipped cream with Tahitian vanilla bean',
  },
  {
    type: 'strawberry',
    name: 'Wild Strawberry',
    emoji: '🍓',
    color: '#ef4444',
    description: 'Sun-ripened berry from the valley orchard',
  },
  {
    type: 'blueberry',
    name: 'Mountain Blueberry',
    emoji: '🫐',
    color: '#3b82f6',
    description: 'Hand-picked wild alpine blueberry',
  },
  {
    type: 'chocolate',
    name: 'Dark Chocolate Curl',
    emoji: '🍫',
    color: '#78350f',
    description: '72% Single-origin Ecuador cocoa shaving',
  },
  {
    type: 'gold-leaf',
    name: '24k Gold Leaf',
    emoji: '✨',
    color: '#fbbf24',
    description: 'Edible hammered gold leaf from pastry atelier',
  },
  {
    type: 'cherry',
    name: 'Glacé Cherry',
    emoji: '🍒',
    color: '#dc2626',
    description: 'Morello cherry glazed in kirsch blossom syrup',
  },
];

export interface PlacedDecoration {
  id: string;
  type: ToppingType;
  x: number; // percentage 0..100 across cake surface
  y: number; // percentage 0..100 down cake surface
  rotation: number; // degrees -30..30
}

export const CAKE_CENTER_X = 50;
export const CAKE_CENTER_Y = 50;
export const CAKE_RADIUS = 38; // percentage radius of cake top surface

/**
 * Validates whether (x, y) coordinates fall within the top surface of the round cake.
 */
export function isWithinCakeSurface(
  x: number,
  y: number,
  radius: number = CAKE_RADIUS
): boolean {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
  const dx = x - CAKE_CENTER_X;
  const dy = y - CAKE_CENTER_Y;
  return dx * dx + dy * dy <= radius * radius;
}

/**
 * Clamps coordinates to ensure they stay on the cake top surface.
 */
export function clampToCakeSurface(
  x: number,
  y: number,
  radius: number = CAKE_RADIUS
): { x: number; y: number } {
  const safeX = Number.isFinite(x) ? x : CAKE_CENTER_X;
  const safeY = Number.isFinite(y) ? y : CAKE_CENTER_Y;

  const dx = safeX - CAKE_CENTER_X;
  const dy = safeY - CAKE_CENTER_Y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist <= radius) {
    return { x: Math.round(safeX * 10) / 10, y: Math.round(safeY * 10) / 10 };
  }

  const factor = radius / dist;
  return {
    x: Math.round((CAKE_CENTER_X + dx * factor) * 10) / 10,
    y: Math.round((CAKE_CENTER_Y + dy * factor) * 10) / 10,
  };
}

/**
 * Default starter decorations so the cake starts partially decorated and inviting.
 */
export const DEFAULT_STARTER_DECORATIONS: PlacedDecoration[] = [
  { id: 'start-1', type: 'rosette', x: 50, y: 50, rotation: 0 },
  { id: 'start-2', type: 'strawberry', x: 42, y: 38, rotation: -12 },
  { id: 'start-3', type: 'blueberry', x: 60, y: 44, rotation: 8 },
  { id: 'start-4', type: 'chocolate', x: 52, y: 62, rotation: 18 },
];
