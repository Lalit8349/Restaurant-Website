import {
  APILoadingStatus,
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  Car,
  Compass,
  ExternalLink,
  Footprints,
  LocateFixed,
  MapPin,
  Navigation,
  TrainFront,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_DIRECTIONS_QUERIES,
  RouteTravelMode,
  buildGoogleMapsDirectionsUrl,
  formatRouteDistance,
  formatRouteDuration,
  isMapsQuotaError,
} from '../utils/bakeryLocationConfig';

const MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ||
  (process.env.GOOGLE_MAPS_PLATFORM_KEY as string | undefined) ||
  '';

// Neutral world view initial center before live Routes/Places API resolution
const INITIAL_WORLD_CENTER = { lat: 22.54992, lng: 0 };
const INITIAL_WORLD_ZOOM = 2;

// Custom warm pastel miniature toy diorama map styling
const MINIATURE_TOY_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f7f3eb' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#685444' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f7f3eb' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#a06e3b' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#886241' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#dfebd4' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e8dcce' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#fbd07e' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e2b35b' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c7e4e8' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#7eaab0' }],
  },
];

export interface LatLngCoordinates {
  lat: number;
  lng: number;
}

interface MapPolylineHandle {
  setMap: (mapInstance: unknown) => void;
  setOptions: (options: Record<string, unknown>) => void;
}

export interface ResolvedRouteSummary {
  distanceMeters: number;
  durationMillis: number;
  startAddress: string;
  endAddress: string;
  destinationPosition: LatLngCoordinates | null;
  originPosition: LatLngCoordinates | null;
}

interface RouteMapCanvasProps {
  originQuery: string;
  destinationQuery: string;
  travelMode: RouteTravelMode;
  onRouteResolved: (summary: ResolvedRouteSummary | null) => void;
  onStatusChange: (state: { loading: boolean; error: string | null }) => void;
}

function toLatLngLiteral(loc: unknown): LatLngCoordinates | null {
  if (!loc || typeof loc !== 'object') return null;
  const candidate = loc as {
    lat?: number | (() => number);
    lng?: number | (() => number);
    location?: unknown;
  };
  if (candidate.location) {
    return toLatLngLiteral(candidate.location);
  }
  const lat =
    typeof candidate.lat === 'function' ? candidate.lat() : candidate.lat;
  const lng =
    typeof candidate.lng === 'function' ? candidate.lng() : candidate.lng;
  if (typeof lat === 'number' && typeof lng === 'number') {
    return { lat, lng };
  }
  return null;
}

function RouteMapCanvas({
  originQuery,
  destinationQuery,
  travelMode,
  onRouteResolved,
  onStatusChange,
}: RouteMapCanvasProps) {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const routesLib = useMapsLibrary('routes');
  const placesLib = useMapsLibrary('places');
  const apiStatus = useApiLoadingStatus();

  const polylinesRef = useRef<MapPolylineHandle[]>([]);
  const [destinationPin, setDestinationPin] =
    useState<LatLngCoordinates | null>(null);
  const [destinationLabel, setDestinationLabel] = useState<string>('');
  const [originPin, setOriginPin] = useState<LatLngCoordinates | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const clearPolylines = useCallback(() => {
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
  }, []);

  useEffect(() => {
    if (
      apiStatus === APILoadingStatus.AUTH_FAILURE ||
      apiStatus === APILoadingStatus.FAILED
    ) {
      onStatusChange({
        loading: false,
        error: 'Unable to load Google Maps. Please check your connection or API configuration.',
      });
    }
  }, [apiStatus, onStatusChange]);

  useEffect(() => {
    if (!map || !routesLib || !destinationQuery.trim()) return;

    let cancelled = false;
    clearPolylines();
    onStatusChange({ loading: true, error: null });

    const computeDirections = async () => {
      try {
        const RouteClass = (routesLib as unknown as {
          Route?: {
            computeRoutes?: (req: Record<string, unknown>) => Promise<{ routes?: unknown[] }>;
          };
        }).Route;

        if (originQuery.trim() && RouteClass && typeof RouteClass.computeRoutes === 'function') {
          const request = {
            origin: originQuery.trim(),
            destination: destinationQuery.trim(),
            travelMode,
            fields: ['path', 'distanceMeters', 'durationMillis', 'viewport', 'legs'],
          };

          const response = await RouteClass.computeRoutes(request);
          if (cancelled) return;

          const primaryRoute = response?.routes?.[0] as
            | {
                distanceMeters?: number;
                durationMillis?: number;
                viewport?: unknown;
                createPolylines?: () => MapPolylineHandle[];
                path?: LatLngCoordinates[];
                legs?: Array<{
                  startLocation?: unknown;
                  endLocation?: unknown;
                  startAddress?: string;
                  endAddress?: string;
                }>;
              }
            | undefined;

          if (primaryRoute) {
            if (typeof primaryRoute.createPolylines === 'function') {
              const created = primaryRoute.createPolylines();
              created.forEach((polyline) => {
                polyline.setOptions({
                  strokeColor: '#fbbf24',
                  strokeOpacity: 0.95,
                  strokeWeight: 5,
                });
                polyline.setMap(map);
              });
              polylinesRef.current = created;
            } else if (
              Array.isArray(primaryRoute.path) &&
              primaryRoute.path.length > 0 &&
              mapsLib
            ) {
              const PolylineCtor = (
                mapsLib as unknown as {
                  Polyline?: new (opts: Record<string, unknown>) => MapPolylineHandle;
                }
              ).Polyline;
              if (PolylineCtor) {
                const fallbackPolyline = new PolylineCtor({
                  path: primaryRoute.path,
                  geodesic: true,
                  strokeColor: '#fbbf24',
                  strokeOpacity: 0.95,
                  strokeWeight: 5,
                  map,
                });
                polylinesRef.current = [fallbackPolyline];
              }
            }

            if (primaryRoute.viewport) {
              (map as unknown as { fitBounds: (bounds: unknown) => void }).fitBounds(
                primaryRoute.viewport
              );
            }

            const firstLeg = primaryRoute.legs?.[0];
            const resolvedOrigin = toLatLngLiteral(firstLeg?.startLocation);
            const resolvedDest =
              toLatLngLiteral(firstLeg?.endLocation) ??
              (Array.isArray(primaryRoute.path) && primaryRoute.path.length > 0
                ? toLatLngLiteral(primaryRoute.path[primaryRoute.path.length - 1])
                : null);

            setOriginPin(resolvedOrigin);
            setDestinationPin(resolvedDest);
            setDestinationLabel(firstLeg?.endAddress || destinationQuery.trim());

            onRouteResolved({
              distanceMeters: primaryRoute.distanceMeters ?? 0,
              durationMillis: primaryRoute.durationMillis ?? 0,
              startAddress: firstLeg?.startAddress || originQuery.trim(),
              endAddress: firstLeg?.endAddress || destinationQuery.trim(),
              destinationPosition: resolvedDest,
              originPosition: resolvedOrigin,
            });
            onStatusChange({ loading: false, error: null });
            return;
          }
        }

        // Fallback: resolve destination pin via Places API (New) searchByText if origin is empty or route unavailable
        const PlaceClass = (placesLib as unknown as {
          Place?: {
            searchByText?: (req: Record<string, unknown>) => Promise<{ places?: unknown[] }>;
          };
        })?.Place;

        if (PlaceClass && typeof PlaceClass.searchByText === 'function') {
          const placeResult = await PlaceClass.searchByText({
            textQuery: destinationQuery.trim(),
            fields: ['displayName', 'formattedAddress', 'location'],
          });
          if (cancelled) return;

          const firstPlace = placeResult?.places?.[0] as
            | {
                displayName?: string;
                formattedAddress?: string;
                location?: unknown;
              }
            | undefined;

          const loc = toLatLngLiteral(firstPlace?.location);
          if (loc) {
            setDestinationPin(loc);
            setOriginPin(null);
            const label =
              firstPlace?.formattedAddress ||
              firstPlace?.displayName ||
              destinationQuery.trim();
            setDestinationLabel(label);
            map.panTo(loc);
            map.setZoom(15);
            onRouteResolved({
              distanceMeters: 0,
              durationMillis: 0,
              startAddress: originQuery.trim(),
              endAddress: label,
              destinationPosition: loc,
              originPosition: null,
            });
            onStatusChange({ loading: false, error: null });
            return;
          }
        }

        onRouteResolved(null);
        onStatusChange({
          loading: false,
          error: 'No route found for the specified locations. Try refining the address.',
        });
      } catch (err) {
        if (cancelled) return;
        if (isMapsQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        onRouteResolved(null);
        onStatusChange({
          loading: false,
          error: 'Unable to calculate route for that address. Try another origin or destination.',
        });
      }
    };

    computeDirections();

    return () => {
      cancelled = true;
      clearPolylines();
    };
  }, [
    map,
    mapsLib,
    routesLib,
    placesLib,
    originQuery,
    destinationQuery,
    travelMode,
    clearPolylines,
    onRouteResolved,
    onStatusChange,
  ]);

  return (
    <>
      {originPin && (
        <AdvancedMarker position={originPin} title="Starting Location">
          <Pin
            background="#1c1917"
            borderColor="#fde68a"
            glyphColor="#fde68a"
            scale={0.95}
          />
        </AdvancedMarker>
      )}

      {destinationPin && (
        <AdvancedMarker
          ref={markerRef}
          position={destinationPin}
          title={destinationLabel || 'Bakery Destination'}
          onClick={() => setInfoOpen((prev) => !prev)}
        >
          <Pin
            background="#d97706"
            borderColor="#fef3c7"
            glyphColor="#fffbeb"
            scale={1.15}
          />
        </AdvancedMarker>
      )}

      {infoOpen && marker && destinationPin && (
        <InfoWindow
          anchor={marker}
          maxWidth={240}
          onCloseClick={() => setInfoOpen(false)}
        >
          <div className="text-stone-900 text-xs leading-snug p-0.5">
            <p className="font-semibold text-stone-950">Golden Grain Destination</p>
            <p className="mt-0.5 text-stone-700">{destinationLabel}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

const TRAVEL_MODES: Array<{
  mode: RouteTravelMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { mode: 'DRIVING', label: 'Drive', icon: Car },
  { mode: 'WALKING', label: 'Walk', icon: Footprints },
  { mode: 'TRANSIT', label: 'Transit', icon: TrainFront },
];

export function DirectionsMapSection() {
  const [originInput, setOriginInput] = useState(DEFAULT_DIRECTIONS_QUERIES.origin);
  const [destinationInput, setDestinationInput] = useState(
    DEFAULT_DIRECTIONS_QUERIES.destination
  );
  const [submittedOrigin, setSubmittedOrigin] = useState(
    DEFAULT_DIRECTIONS_QUERIES.origin
  );
  const [submittedDestination, setSubmittedDestination] = useState(
    DEFAULT_DIRECTIONS_QUERIES.destination
  );
  const [travelMode, setTravelMode] = useState<RouteTravelMode>(
    DEFAULT_DIRECTIONS_QUERIES.travelMode
  );
  const [routeSummary, setRouteSummary] = useState<ResolvedRouteSummary | null>(
    null
  );
  const [status, setStatus] = useState<{ loading: boolean; error: string | null }>({
    loading: false,
    error: null,
  });
  const [locatingUser, setLocatingUser] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  const handleRouteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedOrigin(originInput.trim());
    setSubmittedDestination(
      destinationInput.trim() || DEFAULT_DIRECTIONS_QUERIES.destination
    );
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setStatus({
        loading: false,
        error: 'Geolocation is not supported by your browser.',
      });
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocatingUser(false);
        const coordsString = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
        setOriginInput(coordsString);
        setSubmittedOrigin(coordsString);
      },
      () => {
        setLocatingUser(false);
        setStatus({
          loading: false,
          error: 'Location permission declined. Enter your starting address manually.',
        });
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  const externalDirectionsUrl = buildGoogleMapsDirectionsUrl({
    origin: submittedOrigin,
    destination: submittedDestination,
    travelMode,
  });

  return (
    <section
      id="visit-directions"
      data-testid="directions-map-section"
      aria-label="Bakery Location and Directions"
      className="relative z-10 w-full scroll-mt-16 px-4 pt-10 pb-12 sm:pt-14 sm:pb-16"
    >
      <div className="mx-auto max-w-lg sm:max-w-xl rounded-2xl bg-black/45 backdrop-blur-md border border-amber-300/35 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-left">
        {/* Miniature Toy Banner Header */}
        <div className="text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-300/40 text-amber-200 text-[10px] font-semibold tracking-wider uppercase mb-1.5 video-text-shadow">
            <span>🌾 Miniature Toy-Town Hearth · Mini Map 🍞</span>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white video-heading-shadow leading-tight">
            Find Your Way to Golden Grain
          </h2>
          <p className="mt-1 text-[11px] sm:text-xs text-white/85 leading-relaxed video-text-shadow max-w-[48ch]">
            Plan your miniature journey from your hotel or neighborhood straight to our morning ovens.
          </p>
        </div>

        {/* Interactive Compact Route Controls */}
        <form
          onSubmit={handleRouteSubmit}
          className="mt-3.5 space-y-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="directions-origin-input"
                className="block text-[10px] font-medium text-amber-100/90 video-text-shadow mb-0.5"
              >
                Starting Point
              </label>
              <div className="relative flex items-center">
                <Navigation
                  className="w-3.5 h-3.5 text-amber-200/85 absolute left-2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="directions-origin-input"
                  type="text"
                  value={originInput}
                  onChange={(e) => setOriginInput(e.target.value)}
                  placeholder="Enter starting address..."
                  className="w-full pl-7 pr-8 py-2 sm:py-1.5 min-h-[42px] sm:min-h-[34px] text-base sm:text-xs text-white placeholder:text-white/50 bg-black/35 border border-white/25 focus:border-amber-300 focus:outline-none rounded-lg transition-colors video-text-shadow"
                />
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={locatingUser}
                  title="Use my current location"
                  aria-label="Use my current location"
                  className="absolute right-1 w-8 h-8 flex items-center justify-center text-white/70 hover:text-amber-200 active:scale-95 transition-all cursor-pointer"
                >
                  <LocateFixed className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="directions-destination-input"
                className="block text-[10px] font-medium text-amber-100/90 video-text-shadow mb-0.5"
              >
                Bakery Destination
              </label>
              <div className="relative flex items-center">
                <MapPin
                  className="w-3.5 h-3.5 text-amber-200/85 absolute left-2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="directions-destination-input"
                  type="text"
                  value={destinationInput}
                  onChange={(e) => setDestinationInput(e.target.value)}
                  placeholder="Bakery address or landmark..."
                  className="w-full pl-7 pr-3 py-2 sm:py-1.5 min-h-[42px] sm:min-h-[34px] text-base sm:text-xs text-white placeholder:text-white/50 bg-black/35 border border-white/25 focus:border-amber-300 focus:outline-none rounded-lg transition-colors video-text-shadow"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
            <div
              role="group"
              aria-label="Travel mode"
              className="inline-flex items-center border border-white/25 bg-black/30 rounded-lg overflow-hidden"
            >
              {TRAVEL_MODES.map(({ mode, label, icon: Icon }) => {
                const active = travelMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTravelMode(mode)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-2 sm:py-1 min-h-[36px] sm:min-h-[30px] text-xs sm:text-[11px] font-medium transition-colors cursor-pointer video-text-shadow ${
                      active
                        ? 'text-amber-200 bg-amber-500/25 font-semibold'
                        : 'text-white/75 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-3 sm:h-3 shrink-0" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 min-h-[36px] sm:min-h-[30px] text-xs font-semibold text-white bg-amber-500/25 hover:bg-amber-500/40 active:scale-95 border border-amber-300/40 rounded-lg transition-all cursor-pointer video-text-shadow shrink-0"
            >
              <Compass className="w-3.5 h-3.5 text-amber-200 shrink-0" aria-hidden="true" />
              <span>Route</span>
            </button>
          </div>
        </form>

        {/* Live Route Telemetry & External Google Maps Link */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/85 video-text-shadow">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            {status.loading ? (
              <span className="text-amber-200">Tracing miniature route...</span>
            ) : status.error ? (
              <span className="text-amber-300">{status.error}</span>
            ) : routeSummary ? (
              <>
                {routeSummary.distanceMeters > 0 && (
                  <span className="font-medium text-amber-200">
                    Dist: {formatRouteDistance(routeSummary.distanceMeters)}
                  </span>
                )}
                {routeSummary.durationMillis > 0 && (
                  <>
                    <span aria-hidden="true" className="text-white/40">·</span>
                    <span className="font-medium text-amber-200">
                      Est: {formatRouteDuration(routeSummary.durationMillis)}
                    </span>
                  </>
                )}
              </>
            ) : (
              <span className="text-white/70">
                Ready to trace your route to the hearth.
              </span>
            )}
          </div>

          <a
            href={externalDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="open-google-maps-link"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-200 hover:text-amber-100 underline underline-offset-2 transition-colors video-text-shadow"
          >
            <span>Open in Maps</span>
            <ExternalLink className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
          </a>
        </div>

        {/* Miniature Toy Diorama Map Container (Compact Height & Tilt-Shift Vignette) */}
        <div
          data-testid="google-map-viewport"
          className="mt-3 h-[200px] sm:h-[220px] w-full rounded-xl overflow-hidden border border-amber-300/30 bg-stone-900/90 relative shadow-inner"
        >
          <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-xs text-[10px] text-amber-200/95 pointer-events-none border border-white/10 sm:hidden video-text-shadow">
            2 fingers to pan
          </div>
          {MAPS_API_KEY && !quotaExceeded ? (
            <APIProvider apiKey={MAPS_API_KEY}>
              <GoogleMap
                defaultCenter={INITIAL_WORLD_CENTER}
                defaultZoom={INITIAL_WORLD_ZOOM}
                mapId="DEMO_MAP_ID"
                options={{ styles: MINIATURE_TOY_MAP_STYLES }}
                gestureHandling="cooperative"
                fullscreenControl={false}
                streetViewControl={false}
                mapTypeControl={false}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                className="w-full h-full"
              >
                <RouteMapCanvas
                  originQuery={submittedOrigin}
                  destinationQuery={submittedDestination}
                  travelMode={travelMode}
                  onRouteResolved={setRouteSummary}
                  onStatusChange={setStatus}
                />
              </GoogleMap>
            </APIProvider>
          ) : (
            /* Animated Miniature Toy Diorama Graphic */
            <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-[#f7f3eb] via-[#f1ede2] to-[#e7e1d4] flex flex-col items-center justify-center p-3 text-center select-none">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/60 via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10 flex items-center justify-center gap-3">
                {/* Miniature Toy Windmill */}
                <div className="relative flex flex-col items-center">
                  <div className="w-3.5 h-3.5 border-2 border-amber-800 rounded-full animate-spin [animation-duration:8s] flex items-center justify-center text-amber-900 text-[10px]">
                    ✦
                  </div>
                  <div className="w-2 h-4 bg-amber-800/80 rounded-t-xs -mt-1" />
                  <span className="text-[9px] font-bold text-amber-900/80 mt-0.5">Mill</span>
                </div>

                {/* Animated Miniature Scooter on Cobblestones */}
                <div className="flex flex-col items-center px-1">
                  <div className="flex items-center gap-1.5 text-xs animate-bounce [animation-duration:2.5s]">
                    <span className="text-base">🛵</span>
                    <span className="text-[10px] text-amber-900 font-medium">·····&gt;</span>
                  </div>
                  <div className="h-[2px] w-20 bg-amber-700/30 rounded-full mt-1" />
                  <span className="text-[9px] text-stone-600 font-semibold tracking-wider uppercase mt-0.5">Artisan Route</span>
                </div>

                {/* Miniature Toy Bakery House */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] text-amber-700/70 animate-pulse">
                      ♨
                    </span>
                    <span className="text-xl">🏠</span>
                  </div>
                  <span className="text-[9px] font-bold text-amber-950 mt-0.5">Bakery Hearth</span>
                </div>
              </div>

              <div className="relative z-10 mt-2">
                <p className="text-[11px] font-semibold text-amber-950">
                  Golden Grain Bakery · Artisan Plaza Hearth
                </p>
                <a
                  href={externalDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold text-amber-900 bg-amber-200/70 hover:bg-amber-300 border border-amber-700/30 transition-colors shadow-xs"
                >
                  <span>Open Directions on Google Maps</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          )}

          {/* Miniature tilt-shift vignette overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_18px_rgba(0,0,0,0.45)] rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
