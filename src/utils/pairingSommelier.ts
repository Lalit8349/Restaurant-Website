export interface SommelierItem {
  id: string;
  name: string;
  category: 'bread' | 'spread' | 'beverage';
  tagline: string;
  flavorProfile: string;
  icon: string;
}

export const PAIRING_BREADS: SommelierItem[] = [
  {
    id: 'dark-rye',
    name: 'Dark Rye Batard',
    category: 'bread',
    tagline: 'Deep malted rye with caraway seed crackle',
    flavorProfile: 'Earthy, malty, robust acid tang',
    icon: '🥖',
  },
  {
    id: 'almond-croissant',
    name: 'Almond Croissant',
    category: 'bread',
    tagline: 'Twice-baked butter lamination with rich frangipane',
    flavorProfile: 'Sweet marzipan, toasted almond, flaky butter',
    icon: '🥐',
  },
  {
    id: 'heritage-spelt',
    name: 'Heritage Spelt Loaf',
    category: 'bread',
    tagline: 'Stone-milled ancient grains with golden flax',
    flavorProfile: 'Nutty, floral, delicate sweet crumb',
    icon: '🍞',
  },
  {
    id: 'french-baguette',
    name: 'Classic French Baguette',
    category: 'bread',
    tagline: 'Steam-injected crisp ear with light open crumb',
    flavorProfile: 'Toasted wheat, clean crumb, sea salt',
    icon: '🥖',
  },
];

export const PAIRING_SPREADS: SommelierItem[] = [
  {
    id: 'salted-butter',
    name: 'Whipped Cultured Butter',
    category: 'spread',
    tagline: 'Normandy sea salt crystals & rich lactic cream',
    flavorProfile: 'Velvety, rich dairy, mineral crunch',
    icon: '🧈',
  },
  {
    id: 'wild-honey',
    name: 'Wild Clover Honey',
    category: 'spread',
    tagline: 'Raw unfiltered honeycomb with wildflower nectar',
    flavorProfile: 'Floral jasmine, warm sunny sweetness',
    icon: '🍯',
  },
  {
    id: 'fig-thyme',
    name: 'Fig & Thyme Jam',
    category: 'spread',
    tagline: 'Slow-simmered mission figs with mountain herb thyme',
    flavorProfile: 'Jammy berry, herbal pine, subtle lemon',
    icon: '🫐',
  },
  {
    id: 'hazelnut-praline',
    name: 'Roasted Hazelnut Praline',
    category: 'spread',
    tagline: 'Stone-ground dark roast hazelnuts with cocoa nibs',
    flavorProfile: 'Dark cocoa, roasted praline, velvety nuttiness',
    icon: '🌰',
  },
];

export const PAIRING_BEVERAGES: SommelierItem[] = [
  {
    id: 'ethiopian-pourover',
    name: 'Single-Origin Ethiopian Pour-Over',
    category: 'beverage',
    tagline: 'Light roast washed Yirgacheffe with floral aromatics',
    flavorProfile: 'Bright citrus bergamot, peach nectar, jasmine',
    icon: '☕',
  },
  {
    id: 'masala-chai',
    name: 'Spiced Masala Chai',
    category: 'beverage',
    tagline: 'Assam black tea brewed with green cardamom & fresh ginger',
    flavorProfile: 'Warm warming spice, soothing sweetness, creamy',
    icon: '🫖',
  },
  {
    id: 'valley-cider',
    name: 'Cold-Pressed Valley Apple Cider',
    category: 'beverage',
    tagline: 'Orchard Honeycrisp apples infused with crushed cinnamon',
    flavorProfile: 'Tart orchard apple, crisp autumn fizz, cinnamon',
    icon: '🧃',
  },
  {
    id: 'sea-salt-cortado',
    name: 'Smoked Sea Salt Cortado',
    category: 'beverage',
    tagline: 'Double espresso with textured milk & Maldon salt',
    flavorProfile: 'Intense cocoa, caramel crema, saline finish',
    icon: '☕',
  },
];

export interface TastingFlightResult {
  flightTitle: string;
  harmonySummary: string;
  palateJourney: string;
  sommelierScore: number;
}

export function generateTastingFlight(
  breadId: string,
  spreadId: string,
  beverageId: string
): TastingFlightResult {
  const bread = PAIRING_BREADS.find((b) => b.id === breadId) || PAIRING_BREADS[0];
  const spread = PAIRING_SPREADS.find((s) => s.id === spreadId) || PAIRING_SPREADS[0];
  const beverage = PAIRING_BEVERAGES.find((b) => b.id === beverageId) || PAIRING_BEVERAGES[0];

  // Tailored titles based on selections
  let title = 'The Artisan Baker’s Flight';
  if (bread.id === 'almond-croissant' && beverage.id === 'ethiopian-pourover') {
    title = 'The Parisian Sunrise Flight';
  } else if (bread.id === 'dark-rye' && spread.id === 'salted-butter') {
    title = 'The Baltic Nordic Hearth Flight';
  } else if (beverage.id === 'masala-chai') {
    title = 'The Warm Spice Caravan Flight';
  } else if (bread.id === 'heritage-spelt' && spread.id === 'wild-honey') {
    title = 'The Wild Meadow Harvest Flight';
  } else if (spread.id === 'fig-thyme') {
    title = 'The Provencal Orchard Flight';
  }

  // Generate harmonious tasting evaluation
  let harmony = `${bread.name} provides a foundational rustic texture. Layered with ${spread.name}, the palate gains luscious depth, which is elevated and balanced by the character of ${beverage.name}.`;

  if (bread.id === 'almond-croissant' && beverage.id === 'ethiopian-pourover') {
    harmony =
      'Sweet almond marzipan and twice-baked buttery pastry are brilliantly cut by the bright citrus acidity and jasmine florals of the Ethiopian pour-over.';
  } else if (bread.id === 'dark-rye' && spread.id === 'salted-butter') {
    harmony =
      'Robust caraway and deep malty rye crust find their ideal match in creamy cultured butter, finishing cleanly alongside the warm beverage.';
  } else if (spread.id === 'wild-honey' && beverage.id === 'masala-chai') {
    harmony =
      'Wild clover honeycomb softens the sharp ginger and cardamom spice of the chai, making each bite extraordinarily comforting.';
  } else if (spread.id === 'fig-thyme') {
    harmony =
      'Simmered mission figs and piney wild thyme introduce a savory-sweet herbal dimension that harmonizes effortlessly with stone-milled grains.';
  }

  const palateJourney = `First Bite: ${spread.flavorProfile} · Mid-Palate: ${bread.flavorProfile} · Finish: ${beverage.flavorProfile}`;

  return {
    flightTitle: title,
    harmonySummary: harmony,
    palateJourney,
    sommelierScore: 96 + ((bread.name.length + spread.name.length + beverage.name.length) % 4),
  };
}
