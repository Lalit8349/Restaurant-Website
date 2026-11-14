export interface HydrationProfile {
  percentage: number;
  name: string;
  category: string;
  crumbDescription: string;
  fermentationTime: string;
  crustThickness: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master Baker';
  bakersTip: string;
  alveoliFactor: number; // 0 (dense/tight) to 1 (extremely wild/open)
  flourWaterRatio: string;
}

export function getHydrationProfile(percentage: number): HydrationProfile {
  // Clamp between 65 and 85
  const clamped = Math.max(65, Math.min(85, Math.round(percentage)));

  if (clamped <= 68) {
    return {
      percentage: clamped,
      name: 'Tightly-Crumbed Sandwich Loaf',
      category: 'Enriched & Soft Artisan',
      crumbDescription:
        'Uniform, tender, closed crumb with fine microscopic pores. Retains moisture evenly for delicate sandwich slicing.',
      fermentationTime: '8h Ambient Bulk + 4h Final Proof',
      crustThickness: '1.2mm · Soft, thin, golden-yellow crust',
      difficulty: 'Beginner',
      bakersTip:
        'Easy to shape by hand with minimal stickiness. Great for tin baking and toasted morning brioche.',
      alveoliFactor: (clamped - 65) / 20, // 0.00 to 0.15
      flourWaterRatio: '1000g Flour : 650g Water',
    };
  }

  if (clamped <= 74) {
    return {
      percentage: clamped,
      name: 'Classic Rustic Country Boule',
      category: 'Standard Artisan Sourdough',
      crumbDescription:
        'Balanced crumb structure with medium-sized aerated alveoli, subtle chew, and pleasant lactic acid tang.',
      fermentationTime: '12h Bulk Ferment + 14h Cold Retard',
      crustThickness: '2.5mm · Crisp, russet brown blistered shell',
      difficulty: 'Intermediate',
      bakersTip:
        'Perform 3 sets of stretch-and-folds during the first 2 hours of bulk fermentation to build extensible gluten.',
      alveoliFactor: (clamped - 65) / 20, // 0.20 to 0.45
      flourWaterRatio: '1000g Flour : 720g Water',
    };
  }

  if (clamped <= 79) {
    return {
      percentage: clamped,
      name: 'Open Alveoli Hearth Batard',
      category: 'High-Hydration Hearth Sourdough',
      crumbDescription:
        'Large, irregular windowed holes, glistening gelatinized starch walls with a soft, custard-like crumb feel.',
      fermentationTime: '16h Bulk Ferment + 24h Cold Retard (4°C)',
      crustThickness: '3.2mm · Deep mahogany ear with glass-like shatter',
      difficulty: 'Advanced',
      bakersTip:
        'Handle with wet hands and bench scraper. Use gentle coil folds instead of rough stretching to preserve delicate gas pockets.',
      alveoliFactor: (clamped - 65) / 20, // 0.50 to 0.70
      flourWaterRatio: '1000g Flour : 770g Water',
    };
  }

  return {
    percentage: clamped,
    name: 'Wild Open-Crumb Master Sourdough',
    category: 'Ultra-Hydration Tartine Style',
    crumbDescription:
      'Glistening, translucent custard interior with massive irregular alveoli pockets and featherweight lightness.',
    fermentationTime: '20h Controlled Bulk + 36h Extended Cold Retard',
    crustThickness: '4.0mm · Blistered caramelized ear with dark roasted notes',
    difficulty: 'Master Baker',
    bakersTip:
      'Requires stone-milled high-protein flour (13.5%+), high levain peak activity, and aggressive Dutch oven steam injection.',
    alveoliFactor: (clamped - 65) / 20, // 0.75 to 1.00
    flourWaterRatio: `1000g Flour : ${clamped * 10}g Water`,
  };
}
