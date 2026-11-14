export type RouteTravelMode = 'DRIVING' | 'WALKING' | 'TRANSIT' | 'BICYCLING';

export interface BakeryContactDetails {
  bakeryName: string;
  tagline: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
  email: string;
  wholesaleEmail: string;
  openingHours: string[];
  hotelDispatchNote: string;
  copyrightNote: string;
}

/**
 * Editable template details for the footer & contact section.
 * Update any of these fields with your bakery's real contact details,
 * or edit them live using the "Customize Details" toggle in the footer.
 */
export const DEFAULT_BAKERY_CONTACT_DETAILS: BakeryContactDetails = {
  bakeryName: 'Golden Grain Bakery',
  tagline: 'Single-Origin Heritage Wheat · Hearth to Hospitality',
  addressLine1: '124 Harvest Mill Lane, Suite B (Edit Address)',
  addressLine2: 'Your City, State / Province, Postal Code',
  phone: '+1 (555) 019-2834',
  email: 'hello@goldengrain.example',
  wholesaleEmail: 'hotels@goldengrain.example',
  openingHours: [
    'Mon – Fri: 06:00 AM – 07:00 PM',
    'Sat – Sun: 06:30 AM – 06:00 PM',
  ],
  hotelDispatchNote: 'Daily Partner Hotel Dispatch: 04:00 AM – 06:00 AM',
  copyrightNote: 'Update these placeholder contact details anytime to match your bakery.',
};

/**
 * Default live search queries for the interactive Google Maps Directions planner.
 * Coordinates and place details are resolved dynamically at runtime via the
 * Google Maps Platform Places API (New) and Routes API.
 */
export const DEFAULT_DIRECTIONS_QUERIES = {
  origin: 'Union Square, San Francisco, CA',
  destination: 'Ferry Building, San Francisco, CA',
  travelMode: 'DRIVING' as RouteTravelMode,
};

/**
 * Formats a route distance in meters into a human-readable string.
 */
export function formatRouteDistance(distanceMeters: number): string {
  if (!Number.isFinite(distanceMeters) || distanceMeters <= 0) {
    return '—';
  }
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }
  const km = distanceMeters / 1000;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

/**
 * Formats a route duration in milliseconds into a human-readable string.
 */
export function formatRouteDuration(durationMillis: number): string {
  if (!Number.isFinite(durationMillis) || durationMillis <= 0) {
    return '—';
  }
  const totalMinutes = Math.max(1, Math.round(durationMillis / 60000));
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`;
}

/**
 * Builds an official Google Maps universal cross-platform directions URL.
 */
export function buildGoogleMapsDirectionsUrl(params: {
  origin?: string;
  destination: string;
  travelMode?: RouteTravelMode;
}): string {
  const destinationTrimmed = (params.destination || '').trim();
  const searchParams = new URLSearchParams({
    api: '1',
    destination: destinationTrimmed || 'Bakery',
  });

  const originTrimmed = (params.origin || '').trim();
  if (originTrimmed) {
    searchParams.set('origin', originTrimmed);
  }

  if (params.travelMode) {
    searchParams.set('travelmode', params.travelMode.toLowerCase());
  }

  return `https://www.google.com/maps/dir/?${searchParams.toString()}`;
}

/**
 * Detects whether an error thrown by a Google Maps Platform SDK call
 * indicates API quota exhaustion (without false positives on empty results).
 */
export function isMapsQuotaError(error: unknown): boolean {
  if (!error) return false;
  const text =
    error instanceof Error
      ? `${error.name} ${error.message}`
      : typeof error === 'object'
        ? JSON.stringify(error)
        : String(error);

  return (
    text.includes('OverQuotaMapError') ||
    text.includes('QuotaExceededError') ||
    text.includes('OVER_QUERY_LIMIT') ||
    text.includes('RESOURCE_EXHAUSTED') ||
    /\b429\b/.test(text)
  );
}

export type SocialSharePlatform = 'x' | 'facebook' | 'linkedin' | 'whatsapp';

export interface SocialShareLink {
  platform: SocialSharePlatform;
  label: string;
  ariaLabel: string;
  href: string;
}

export const DEFAULT_STORY_SHARE_TEXT =
  'Follow the Golden Grain Bakery journey—from sunlit wheat fields to the morning ovens, grand hotel kitchen, and guest table.';

/**
 * Builds properly encoded social media share URLs for the bakery story.
 */
export function buildSocialShareLinks(params: {
  url: string;
  title?: string;
  text?: string;
}): SocialShareLink[] {
  const safeUrl = (params.url || '').trim() || 'https://example.com';
  const safeTitle = (params.title || 'Golden Grain Bakery — Farm to Table Story').trim();
  const safeText = (params.text || DEFAULT_STORY_SHARE_TEXT).trim();
  const combinedText = `${safeTitle} — ${safeText}`;

  const encodedUrl = encodeURIComponent(safeUrl);
  const encodedText = encodeURIComponent(combinedText);

  return [
    {
      platform: 'x',
      label: 'X',
      ariaLabel: 'Share story on X (Twitter)',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      platform: 'facebook',
      label: 'Facebook',
      ariaLabel: 'Share story on Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      ariaLabel: 'Share story on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      platform: 'whatsapp',
      label: 'WhatsApp',
      ariaLabel: 'Share story on WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${combinedText} ${safeUrl}`)}`,
    },
  ];
}

