export interface BakeSlot {
  id: string;
  timeLabel: string;
  hours: number;
  minutes: number;
  name: string;
  category: string;
  ovenDeck: string;
  temperature: string;
  description: string;
  statusText: string;
}

export const BAKE_SLOTS: BakeSlot[] = [
  {
    id: 'bake-1',
    timeLabel: '07:00 AM',
    hours: 7,
    minutes: 0,
    name: 'French Baguettes & Laminated Croissants',
    category: 'Viennoiserie & Crisp Crusts',
    ovenDeck: 'Deck 1 · Upper Clay Arch',
    temperature: '250°C Steam Injected',
    description: 'Golden honeycomb lamination and thin, crackling crusts fresh for opening.',
    statusText: 'Freshly Baked',
  },
  {
    id: 'bake-2',
    timeLabel: '09:30 AM',
    hours: 9,
    minutes: 30,
    name: '100% Stone-Milled Country Sourdough',
    category: 'Wild Fermentation Boules',
    ovenDeck: 'Deck 2 · Deep Hearth Stone',
    temperature: '280°C Radiant Floor',
    description: 'Deep blistered mahogany ear, open custard crumb, cold fermented for 24 hours.',
    statusText: 'Hot Out of Hearth',
  },
  {
    id: 'bake-3',
    timeLabel: '02:00 PM',
    hours: 14,
    minutes: 0,
    name: 'Warm Cardamom Buns & Cinnamon Braids',
    category: 'Sweet Swedish Doughs',
    ovenDeck: 'Deck 3 · Gentle Radiant Bed',
    temperature: '215°C Brown Butter Glazed',
    description: 'Crushed green cardamom pods with pearl sugar crystals and browned butter syrup.',
    statusText: 'Cooling on Racks',
  },
  {
    id: 'bake-4',
    timeLabel: '04:30 PM',
    hours: 16,
    minutes: 30,
    name: 'Afternoon Brioche & Herb Rustic Focaccia',
    category: 'Enriched & Olive Oil Bakes',
    ovenDeck: 'Deck 2 · Stone Deck',
    temperature: '230°C Sea Salt Finished',
    description: 'Dimpled olive oil dough studded with fresh rosemary, sea salt, and garlic confit.',
    statusText: 'In Hearth Oven',
  },
];

/**
 * Calculates current and next bake slots based on given or current time.
 */
export function getActiveBakeStatus(now: Date = new Date()): {
  currentSlot: BakeSlot;
  nextSlot: BakeSlot;
  minutesUntilNext: number;
} {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Find slot that occurred most recently
  let currentSlot = BAKE_SLOTS[BAKE_SLOTS.length - 1];
  let nextSlot = BAKE_SLOTS[0];

  for (let i = 0; i < BAKE_SLOTS.length; i++) {
    const slot = BAKE_SLOTS[i];
    const slotTotalMins = slot.hours * 60 + slot.minutes;
    if (currentMinutes >= slotTotalMins) {
      currentSlot = slot;
      nextSlot = BAKE_SLOTS[(i + 1) % BAKE_SLOTS.length];
    } else {
      nextSlot = slot;
      break;
    }
  }

  // Calculate minutes until next slot
  const nextTotalMins = nextSlot.hours * 60 + nextSlot.minutes;
  let diff = nextTotalMins - currentMinutes;
  if (diff <= 0) {
    diff += 24 * 60; // Next day
  }

  return {
    currentSlot,
    nextSlot,
    minutesUntilNext: diff,
  };
}

/**
 * Formats countdown minutes into "Xh Ym" or "Ym".
 */
export function formatMinutesCountdown(totalMinutes: number): string {
  if (totalMinutes <= 0) return 'Baking Now';
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

/**
 * Plays an authentic synthesized brass oven bell chime with subtle fire crackle via Web Audio API.
 */
export function playOvenBellSound(): void {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic bell tones (brass bell chime)
    const freqs = [880, 1320, 1760]; // A5, E6, A6 harmonics
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6 + idx * 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.2);
    });
  } catch {
    // Audio context may be restricted before user gesture
  }
}
