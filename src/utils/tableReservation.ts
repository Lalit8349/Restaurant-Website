export interface TableMood {
  id: 'hearthside' | 'garden-window' | 'courtyard-terrace';
  name: string;
  tagline: string;
  atmosphere: string;
  icon: string;
}

export const TABLE_MOODS: TableMood[] = [
  {
    id: 'hearthside',
    name: 'Hearthside Oven Counter',
    tagline: 'Warm & Bustling',
    atmosphere:
      'Front-row wooden stool overlooking wood-fire stone hearths and artisan peel craftsmanship.',
    icon: '🔥',
  },
  {
    id: 'garden-window',
    name: 'Sunlit Garden Window',
    tagline: 'Peaceful & Gentle',
    atmosphere:
      'Filtered morning sunshine through vintage arched paned glass beside climbing jasmine and herbs.',
    icon: '🌿',
  },
  {
    id: 'courtyard-terrace',
    name: 'The Courtyard Terrace',
    tagline: 'Fresh Morning Air',
    atmosphere:
      'Cobblestone patio with olive trees, morning birdsong, and open breeze beneath canvas awnings.',
    icon: '☕',
  },
];

export interface PrereserveLoaf {
  id: string;
  name: string;
  price: string;
  limitText: string;
}

export const PRERESERVE_LOAVES: PrereserveLoaf[] = [
  {
    id: 'country-boule',
    name: '100% Stone-Milled Country Sourdough Boule',
    price: '$9.50',
    limitText: 'Limit 2 per party',
  },
  {
    id: 'croissant-box',
    name: 'Artisan Laminated Croissant Box (4 pcs)',
    price: '$18.00',
    limitText: 'Fresh morning lamination',
  },
  {
    id: 'cardamom-buns',
    name: 'Cardamom & Brown Butter Buns (2 pcs)',
    price: '$8.50',
    limitText: 'Limited daily hearth batch',
  },
  {
    id: 'spelt-flax',
    name: 'Ancient Grain Spelt & Flax Batard',
    price: '$10.00',
    limitText: 'Stone-milled organic flour',
  },
];

export interface ReservationInput {
  name: string;
  email: string;
  partySize: number;
  date: string;
  timeSlot: string;
  moodId: 'hearthside' | 'garden-window' | 'courtyard-terrace';
  reservedLoafIds: string[];
}

export interface ReservationTicket {
  ticketNumber: string;
  guestName: string;
  partySize: number;
  date: string;
  timeSlot: string;
  moodName: string;
  reservedLoaves: string[];
  waxSealColor: string;
  issuedAt: string;
}

export function createReservationTicket(input: ReservationInput): ReservationTicket {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const mood = TABLE_MOODS.find((m) => m.id === input.moodId) || TABLE_MOODS[0];

  const selectedLoaves = input.reservedLoafIds
    .map((id) => PRERESERVE_LOAVES.find((l) => l.id === id)?.name)
    .filter((n): n is string => Boolean(n));

  return {
    ticketNumber: `GG-${input.moodId.slice(0, 3).toUpperCase()}-${randomSuffix}`,
    guestName: input.name.trim() || 'Honored Guest',
    partySize: Math.max(1, input.partySize),
    date: input.date || 'Tomorrow Morning',
    timeSlot: input.timeSlot || '08:30 AM',
    moodName: mood.name,
    reservedLoaves: selectedLoaves,
    waxSealColor: '#d4af37',
    issuedAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}
