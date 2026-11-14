export interface PostcardTemplate {
  id: string;
  title: string;
  subtitle: string;
  backgroundGradient: string;
  cardImagePlaceholder: string;
  themeColor: string;
}

export interface WaxSealColor {
  id: string;
  name: string;
  hex: string;
  borderHex: string;
  stampText: string;
}

export const POSTCARD_TEMPLATES: PostcardTemplate[] = [
  {
    id: 'wheat-fields',
    title: 'Sunlit Wheat Fields',
    subtitle: 'Golden Heritage Fields at Dawn',
    backgroundGradient: 'linear-gradient(135deg, #422800 0%, #784c0c 50%, #d4af37 100%)',
    cardImagePlaceholder: '🌾',
    themeColor: '#d4af37',
  },
  {
    id: 'hearth-fire',
    title: 'Midnight Hearth Fire',
    subtitle: 'Wood-Fired Clay Oven Embers',
    backgroundGradient: 'linear-gradient(135deg, #1c0802 0%, #541907 50%, #c44e1b 100%)',
    cardImagePlaceholder: '🔥',
    themeColor: '#e0682b',
  },
  {
    id: 'pastry-box',
    title: 'Grand French Pastry Box',
    subtitle: 'Viennoiserie & Powdered Brioche',
    backgroundGradient: 'linear-gradient(135deg, #2b1f1a 0%, #613e31 50%, #a87965 100%)',
    cardImagePlaceholder: '🥐',
    themeColor: '#c79d7d',
  },
  {
    id: 'rustic-table',
    title: 'Artisan Hearth Sourdough Table',
    subtitle: 'Blistered Boule, Butter & Wild Honey',
    backgroundGradient: 'linear-gradient(135deg, #1a1b16 0%, #3e4231 50%, #828a64 100%)',
    cardImagePlaceholder: '🍞',
    themeColor: '#a6b080',
  },
];

export const WAX_SEALS: WaxSealColor[] = [
  {
    id: 'gold',
    name: 'Imperial Gold Wax',
    hex: '#d4af37',
    borderHex: '#ffe885',
    stampText: 'GOLDEN GRAIN',
  },
  {
    id: 'crimson',
    name: 'Burgundy Crimson Wax',
    hex: '#821616',
    borderHex: '#c43333',
    stampText: 'HEARTH BAKE',
  },
  {
    id: 'forest',
    name: 'Alpine Pine Wax',
    hex: '#183822',
    borderHex: '#2d613d',
    stampText: 'WILD LEVAIN',
  },
  {
    id: 'navy',
    name: 'Midnight Navy Wax',
    hex: '#14223d',
    borderHex: '#28467d',
    stampText: 'EST. 1924',
  },
];

export const PRESET_MESSAGES = [
  'Breakfast is on me this Sunday. Meet me at the stone hearth!',
  'Sending you the warmth of freshly pulled sourdough and morning pour-over.',
  'A little golden crust and cardamom braid to brighten your day.',
  'May your week rise as gently and richly as our 24-hour wild levain.',
];

export interface PostcardData {
  recipientName: string;
  senderName: string;
  message: string;
  templateId: string;
  waxSealId: string;
}

export function encodePostcardShareLink(data: PostcardData, baseUrl: string = 'https://goldengrain.bakery'): string {
  const params = new URLSearchParams({
    to: data.recipientName.trim() || 'Friend',
    from: data.senderName.trim() || 'A Friend',
    msg: data.message.trim() || PRESET_MESSAGES[0],
    tpl: data.templateId,
    seal: data.waxSealId,
  });
  return `${baseUrl}/?postcard=true&${params.toString()}`;
}
