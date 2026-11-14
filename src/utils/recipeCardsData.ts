export interface RecipeCardInfo {
  tag: string;
  title: string;
  category: 'Farm & Harvest' | 'Mill & Hearth' | 'Courier & Craft' | 'Grand Service';
  origin: string;
  bakingTrivia: string;
  story: string;
  details: string[];
}

export const RECIPE_CARDS_DATA: Record<string, RecipeCardInfo> = {
  Farm: {
    tag: 'Farm',
    title: 'The Valley Grain Fields',
    category: 'Farm & Harvest',
    origin: 'Sunlit Valley Collective',
    bakingTrivia:
      'Our crops are grown without synthetic fungicides; cold nighttime mountain drafts provide natural disease resistance.',
    story:
      'Where the sun first crests the mountain ridge, our farmers walk the furrows testing soil moisture and kernel firmness before harvest.',
    details: ['Organic Soils', 'Mountain Draft Cooled', 'Sustainable Agriculture'],
  },
  Bakery: {
    tag: 'Bakery',
    title: 'The Hearth Stone Oven',
    category: 'Mill & Hearth',
    origin: 'Old Town Striped Awning',
    bakingTrivia:
      'Built with refractory clay bricks fired in 1924, retaining 280°C of radiant heat for an explosive oven spring.',
    story:
      'The morning ovens wake while the streetlamps still flicker. Every dawn brings the intoxicating aroma of caramelizing starches into the plaza.',
    details: ['Refractory Clay', '280°C Radiant Heat', 'Steam Injection'],
  },
  Hotel: {
    tag: 'Hotel',
    title: 'The Grand Hotel Bench',
    category: 'Grand Service',
    origin: 'The Grand Hotel Kitchen',
    bakingTrivia:
      'Dedicated pastry stations maintained at 18°C keep delicate puff pastry laminations crisp and butter sheets malleable.',
    story:
      'Behind the double swing doors of the grand ballroom, our pastry brigade crafts multi-layered delights for visitors from around the world.',
    details: ['18°C Pastry Room', 'Butter Lamination', 'Master Pâtissier'],
  },
  Customers: {
    tag: 'Customers',
    title: 'The Grand Dining Ballroom',
    category: 'Grand Service',
    origin: 'Grand Dining Hall Table #1',
    bakingTrivia:
      'Dessert service is timed to the second so warm sponges and cold berry coulis arrive at the exact peak of contrasting temperature.',
    story:
      'Beneath golden chandeliers, friends, travelers, and families gather to savor moments of sweetness and celebrate life together.',
    details: ['Table Service', 'Celebration Cakes', 'Golden Moments'],
  },
  Wheat: {
    tag: 'Wheat',
    title: 'Heritage Red Fife Grain',
    category: 'Farm & Harvest',
    origin: 'Sunlit Valley Meadow · Field #3',
    bakingTrivia:
      'High in mineral-rich bran with 13.8% natural protein, yielding deep nutty notes and an open, honeycomb crumb.',
    story:
      'Harvested at the dew-break when moisture levels are below 14%, these amber stalks are threshed gently to protect the wheat germ oils.',
    details: ['13.8% Protein', 'Cold-Threshed', 'Sun-Dried Stalks'],
  },
  Corn: {
    tag: 'Corn',
    title: 'Golden Sweet Flint Meal',
    category: 'Farm & Harvest',
    origin: 'South Terraces · Heirloom Plot',
    bakingTrivia:
      'Coarsely ground flint corn adds a golden hue and a tender, caramelized crust to our morning brioche loaves.',
    story:
      'Sun-dried on wooden racks beneath the valley breeze, this heirloom variety imparts a gentle sweetness without refined sugar.',
    details: ['Heirloom Flint', 'Stone Grated', 'Zero Additives'],
  },
  Barley: {
    tag: 'Barley',
    title: 'Malted Pearl Barley',
    category: 'Farm & Harvest',
    origin: 'Highland Brook Field',
    bakingTrivia:
      'Enzymatic malted barley converts complex starches into fermentable sugars, giving sourdough a glossy mahogany crust.',
    story:
      'Steeped in fresh mountain well-water and sprouted for four days before roasting in mild oak embers for rich aroma.',
    details: ['Slow Malted', 'Diastatic Power', 'Natural Caramelization'],
  },
  Cocoa: {
    tag: 'Cocoa',
    title: 'Single-Estate Criollo Cocoa',
    category: 'Farm & Harvest',
    origin: 'Valley Micro-Climate Grove',
    bakingTrivia:
      'Fermented for 6 days in banana leaves to unlock delicate red fruit and roasted hazelnut notes with mild acidity.',
    story:
      'Hand-sorted beans roasted slowly at 115°C to preserve natural cocoa butter before stone-grinding into dark velvet mass.',
    details: ['72% Dark Origin', 'Sun Fermented', 'Raw Cocoa Butter'],
  },
  'Direct Harvest': {
    tag: 'Direct Harvest',
    title: 'Same-Day Field Sourcing',
    category: 'Farm & Harvest',
    origin: 'Golden Valley Collective',
    bakingTrivia:
      'Grain milled within 48 hours of harvest preserves 98% of natural vitamin E and volatile aromatic lipids.',
    story:
      'No industrial storage silos or chemical fumigants. The grain moves from field wagon to milling stone in one unbroken rhythm.',
    details: ['48-Hour Fresh', 'Short-Chain Logistics', 'Zero Preservatives'],
  },
  'Fresh Milled': {
    tag: 'Fresh Milled',
    title: 'Stone-Ground Live Flour',
    category: 'Mill & Hearth',
    origin: 'Windmill Sifting Floor',
    bakingTrivia:
      'Low-speed stone grinding maintains flour below 38°C, preventing thermal degradation of delicate wild yeasts.',
    story:
      'We retain the germ and aleurone layer intact, resulting in a rich, buttery flour that smells of freshly cut hay and sweet clover.',
    details: ['Cold Milled <38°C', 'Live Enzymes', 'Full Germ Retained'],
  },
  'Manifest Signed': {
    tag: 'Manifest Signed',
    title: 'Head Baker Inspection Seal',
    category: 'Mill & Hearth',
    origin: 'Bakery Threshold · Awning Post',
    bakingTrivia:
      'Every sack is moisture-tested (target 13.5%) and aroma-checked before the master baker inks the daily manifest.',
    story:
      'At 5:15 AM, the lantern is hung on the awning peg. The manifest signature guarantees origin provenance before a single bag is cut open.',
    details: ['Provenance Certificate', 'Moisture-Checked', '5:15 AM Sign-Off'],
  },
  'Stone-Milled Flour': {
    tag: 'Stone-Milled Flour',
    title: 'French Granite Stone Milled',
    category: 'Mill & Hearth',
    origin: 'Hearth Mill Room',
    bakingTrivia:
      'Granite millstones shear rather than crush the grain, creating jagged particles that absorb 78% water for superior dough hydration.',
    story:
      'Dressed by hand with a diamond chisel twice a month, our granite stones spin at an unhurried 85 RPM powered by clean river water.',
    details: ['78% Hydration Yield', 'Granite Sheared', 'Natural Minerals'],
  },
  'Hand-Tied Parcels': {
    tag: 'Hand-Tied Parcels',
    title: 'Unbleached Kraft & Jute Twine',
    category: 'Courier & Craft',
    origin: 'Bakery Packaging Bench',
    bakingTrivia:
      'Breathable kraft paper prevents steam condensation, ensuring sourdough crust stays crisp while the crumb remains steaming warm.',
    story:
      'Wrapped in recycled unbleached kraft paper and tied with a sailor knot of natural jute twine, stamped with the wax seal of the day.',
    details: ['Vapor-Permeable Kraft', 'Jute Sailor Knot', 'Wax Imprinted'],
  },
  'Scooter Courier': {
    tag: 'Scooter Courier',
    title: 'Cobblestone Quick Express',
    category: 'Courier & Craft',
    origin: 'Old Town Delivery Route',
    bakingTrivia:
      'Transit within 18 minutes ensures loaves maintain an internal temperature above 45°C upon arrival at the hotel door.',
    story:
      'Our vintage yellow scooter navigates the winding cobblestone alleys with insulated wicker baskets to deliver warm breads while the town wakes.',
    details: ['18-Minute Express', 'Insulated Wicker', 'Zero Heat Loss'],
  },
  'The Grand Hotel': {
    tag: 'The Grand Hotel',
    title: 'Grand Hotel Bellhop Reception',
    category: 'Grand Service',
    origin: 'Hotel Plaza Courtyard',
    bakingTrivia:
      'Bellhops transfer bakery parcels directly to the subterranean pastry kitchen via copper dumbwaiters within 90 seconds.',
    story:
      'Beneath the sunlit neoclassical colonnade, parcels are received at the service entrance and hurried downstairs before breakfast begins.',
    details: ['Direct Dumbwaiter', '90-Second Transfer', 'White Glove Intake'],
  },
  'Morning Arrival': {
    tag: 'Morning Arrival',
    title: 'Dawn Kitchen Handoff',
    category: 'Grand Service',
    origin: 'Chef de Partie Station',
    bakingTrivia:
      'Warm sponges rest for 12 minutes in ambient room humidity before receiving chilled dairy glazes to prevent crust weeping.',
    story:
      'The sweet scent of warm flour fills the marble corridors as pastry chefs assemble row upon row of fresh breakfast Viennoiserie.',
    details: ['6:30 AM Reception', 'Controlled Humidity', 'Fresh Batch Logged'],
  },
  'Pastry Finishing': {
    tag: 'Pastry Finishing',
    title: 'Valrhona Ganache & Chantilly',
    category: 'Grand Service',
    origin: 'Cold Marble Bench',
    bakingTrivia:
      'Marble benches kept at 16°C prevent butter fat crystallization while piping multi-tier mascarpone rosettes.',
    story:
      'Layers of dark chocolate sponge are steeped in vanilla bean syrup, filled with whipped Madagascar Chantilly cream, and glossed to mirror shine.',
    details: ['16°C Chilled Marble', 'Madagascar Vanilla', 'Mirror Gloss Finish'],
  },
  'Plated to Order': {
    tag: 'Plated to Order',
    title: 'Minute Plating Technique',
    category: 'Grand Service',
    origin: 'Hotel Pastry Kitchen',
    bakingTrivia:
      'Fresh raspberries and blackberries are dusted with pulverized cane sugar just 45 seconds before the silver cloche covers the plate.',
    story:
      'No pastry sits waiting under hot service lamps. Every slice is carved and garnished to the exact second the guest orders.',
    details: ['45-Second Garnish', 'Silver Cloche', 'Zero Heat Lamp Holding'],
  },
  'Table Service': {
    tag: 'Table Service',
    title: 'Grand Chandelier Dining',
    category: 'Grand Service',
    origin: 'Grand Dining Hall',
    bakingTrivia:
      'Fine bone china warmed to 35°C keeps cake foundations tender while preserving the crisp snap of candied berry pearls.',
    story:
      'Waiters in burgundy vests balance tiered silver stands between the soaring columns and velvet banquettes of the grand ballroom.',
    details: ['Bone China 35°C', 'Silver Tiered Stands', 'Maître d’ Signature'],
  },
  'The Guest Table': {
    tag: 'The Guest Table',
    title: 'Family Gathering Table',
    category: 'Grand Service',
    origin: 'Central Rotunda Table #12',
    bakingTrivia:
      'Shared dining cakes are portioned into 8 symmetrical wedges designed to showcase cross-laminated crumb layers.',
    story:
      'Where generations meet over steaming porcelain cups, laughter echoes beneath crystal chandeliers, and every morning celebration begins.',
    details: ['8-Wedge Slices', 'Shared Centerpiece', 'Golden Spoon Service'],
  },
  'Shared Joy': {
    tag: 'Shared Joy',
    title: 'The Baker’s True Goal',
    category: 'Grand Service',
    origin: 'From Farm Field to Heart',
    bakingTrivia:
      'Freshly baked bread triggers the release of endorphins and olfactory memories, bridging agricultural soil and human warmth.',
    story:
      'A loaf of bread is never truly finished when it leaves the hearth oven—it is finished only when it is broken and shared with someone you love.',
    details: ['Universal Tradition', 'Broken & Shared', 'Daily Celebration'],
  },
  'Handmade Daily': {
    tag: 'Handmade Daily',
    title: 'Artisan Hearth Standard',
    category: 'Mill & Hearth',
    origin: 'Oven Master Workshop',
    bakingTrivia:
      'No automated mechanical shapers; each baguette and boule is shaped by hand with cupped palms on linen couches.',
    story:
      'The baker’s touch senses daily variations in air pressure, humidity, and flour hydration that no factory sensor can match.',
    details: ['Hand Shaped', 'Linen Proofed', 'Zero Conveyor Belts'],
  },
  'Pure Tradition': {
    tag: 'Pure Tradition',
    title: 'Centennial Mother Sourdough',
    category: 'Mill & Hearth',
    origin: 'Hearth Fermentation Crock · Est. 1924',
    bakingTrivia:
      'Our sourdough starter has been nurtured through continuous daily refreshments since 1924, developing over 40 distinct flavor esters.',
    story:
      'Kept in an earthenware crock behind the chimney brick, this living legacy provides the soul, leavening power, and tangy perfume of our loaves.',
    details: ['100-Year Heritage', 'Wild Yeast Culture', 'Wood Crock Nurtured'],
  },
  'Baked with Love': {
    tag: 'Baked with Love',
    title: 'Golden Grain Hearth Ethos',
    category: 'Grand Service',
    origin: 'The Golden Grain Family',
    bakingTrivia:
      'Baking requires patience, presence, and genuine passion. Time and temperature are mere tools for human dedication.',
    story:
      'From the tractor driver at dawn to the pastry chef at dusk, our team puts their whole heart into every grain, loaf, and cake.',
    details: ['Artisan Pride', 'Uncompromising Quality', 'Community Hearth'],
  },
};

export function getRecipeCard(tag: string): RecipeCardInfo | null {
  const normalized = tag.trim();
  if (RECIPE_CARDS_DATA[normalized]) {
    return RECIPE_CARDS_DATA[normalized];
  }

  // Case-insensitive fallback lookup
  const foundKey = Object.keys(RECIPE_CARDS_DATA).find(
    (key) => key.toLowerCase() === normalized.toLowerCase()
  );
  return foundKey ? RECIPE_CARDS_DATA[foundKey] : null;
}
