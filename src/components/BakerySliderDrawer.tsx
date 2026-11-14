import { useEffect, useRef, useState } from 'react';
import {
  X,
  Compass,
  Bell,
  Cake,
  Sparkles,
  MapPin,
  ChevronRight,
  Flame,
  ArrowRight,
  Droplets,
  Coffee,
  BookOpen,
  Heart,
} from 'lucide-react';
import { STORY_CHAPTERS } from '../utils/storyTimeline';
import { getChapterThumbnail } from '../utils/timelineControls';

interface BakerySliderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToChapter: (progress: number) => void;
  onOpenCakeFinisher: () => void;
  onOpenEasterEggModal: () => void;
  onOpenBakeSchedule: () => void;
  onOpenHydrationInspector: () => void;
  onOpenPairingSommelier: () => void;
  onOpenTableReservation: () => void;
  onOpenPostcardGenerator: () => void;
  onJumpToDirections: () => void;
  easterEggsFound: number;
  totalEasterEggs: number;
}

export function BakerySliderDrawer({
  isOpen,
  onClose,
  onJumpToChapter,
  onOpenCakeFinisher,
  onOpenEasterEggModal,
  onOpenBakeSchedule,
  onOpenHydrationInspector,
  onOpenPairingSommelier,
  onOpenTableReservation,
  onOpenPostcardGenerator,
  onJumpToDirections,
  easterEggsFound,
  totalEasterEggs,
}: BakerySliderDrawerProps) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let raf1: number | undefined;
    let raf2: number | undefined;

    if (isOpen) {
      setIsRendered(true);
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      timer = setTimeout(() => {
        setIsRendered(false);
      }, 350);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isRendered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      drawerRef.current?.focus();
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRendered, isVisible, onClose]);

  if (!isRendered) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bakery Story & Features Drawer"
      className="fixed inset-0 z-50 flex pointer-events-auto"
    >
      {/* Backdrop Overlay with Smooth Fade In/Out */}
      <div
        className={`fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sliding Window Panel with Smooth Slide In and Out */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        className={`relative w-[86vw] sm:w-full max-w-xs sm:max-w-sm h-[100dvh] overflow-y-auto bg-gradient-to-b from-[#1b1712] via-[#13110d] to-[#0a0907] border-r border-amber-400/35 p-4 sm:p-5 text-stone-200 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(217,119,6,0.15)] flex flex-col justify-between focus:outline-none transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] pt-[calc(1rem+env(safe-area-inset-top,0px))] will-change-transform transform-gpu ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-amber-400/20">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-amber-300/80 font-mono">
                ✦ Artisanal Story & Hearth ✦
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-amber-100 mt-0.5">
                Golden Grain
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close slider window"
              className="p-2 rounded-full text-stone-400 hover:text-white bg-stone-900/60 hover:bg-stone-800 border border-white/10 hover:border-amber-300/40 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Chapter Story Navigator */}
          <div className="mt-5">
            <h3 className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-200/70 font-semibold mb-2.5">
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>Story Chapters</span>
            </h3>

            <div className="space-y-1.5">
              {STORY_CHAPTERS.map((chapter) => {
                const thumb = getChapterThumbnail(chapter.id);
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => {
                      onJumpToChapter(chapter.jumpProgress);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-black/40 hover:bg-amber-500/15 border border-white/10 hover:border-amber-300/40 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-400/25 shrink-0 bg-black">
                        <img
                          src={thumb.frameSrc}
                          alt={thumb.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate group-hover:text-amber-200 transition-colors">
                          {chapter.number}. {chapter.label}
                        </p>
                        <p className="text-[10px] text-stone-400 truncate font-mono">
                          {thumb.timestamp} · {thumb.subtitle}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-300 transition-transform group-hover:translate-x-0.5 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Micro-Tools & Artisan Features */}
          <div className="mt-6">
            <h3 className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-200/70 font-semibold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Artisan Bakery Features</span>
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {/* Feature 1: Hearth Bake Schedule & Bell */}
              <button
                type="button"
                onClick={() => {
                  onOpenBakeSchedule();
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-600/10 hover:from-amber-500/25 hover:to-amber-600/20 border border-amber-400/35 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-100">
                      Hearth Bake Schedule & Bell
                    </p>
                    <p className="text-[10px] text-stone-300">
                      Live oven status & ring brass bell
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Feature 2: Sourdough Hydration Inspector */}
              <button
                type="button"
                onClick={() => {
                  onOpenHydrationInspector();
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-amber-300/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-200 group-hover:text-amber-100">
                      Sourdough Crumb Inspector
                    </p>
                    <p className="text-[10px] text-stone-400">
                      65%–85% interactive crumb alveoli
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Feature 3: Artisan Pairing Sommelier */}
              <button
                type="button"
                onClick={() => {
                  onOpenPairingSommelier();
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-amber-300/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-200 group-hover:text-amber-100">
                      Pairing Sommelier Flight
                    </p>
                    <p className="text-[10px] text-stone-400">
                      Build morning bread & coffee flight
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Feature 4: Reserve a Hearth Table */}
              <button
                type="button"
                onClick={() => {
                  onOpenTableReservation();
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-amber-300/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-700/20 text-amber-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-200 group-hover:text-amber-100">
                      Reserve a Hearth Table
                    </p>
                    <p className="text-[10px] text-stone-400">
                      Table moods & loaf pre-orders
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Feature 5: "Send a Fresh Loaf" Postcard */}
              <button
                type="button"
                onClick={() => {
                  onOpenPostcardGenerator();
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-amber-300/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-200 group-hover:text-amber-100">
                      "Send a Fresh Loaf" Postcard
                    </p>
                    <p className="text-[10px] text-stone-400">
                      Custom message & gold wax seal
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Cake Finisher Atelier */}
              <button
                type="button"
                onClick={() => {
                  onOpenCakeFinisher();
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-amber-300/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                    <Cake className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-200 group-hover:text-amber-100">
                      Cake Finisher Atelier
                    </p>
                    <p className="text-[10px] text-stone-400">
                      Garnish & plate sponge cakes
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Easter Egg Hunt */}
              <button
                type="button"
                onClick={() => {
                  onOpenEasterEggModal();
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-amber-300/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-200 group-hover:text-amber-100">
                      Baker's Secret Hunt
                    </p>
                    <p className="text-[10px] text-amber-300/80 font-mono">
                      {easterEggsFound}/{totalEasterEggs} Companions Found
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Daily Hearth Bake Schedule Preview Card */}
          <div className="mt-6 rounded-2xl bg-black/35 border border-white/10 p-3.5">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-200/90 mb-2">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Daily Hearth Schedule</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  onOpenBakeSchedule();
                  onClose();
                }}
                className="text-[10px] font-mono text-[#d4af37] underline hover:text-amber-300 font-medium cursor-pointer"
              >
                View Live Board
              </button>
            </div>
            <ul className="space-y-1.5 text-[11px] text-stone-300">
              <li className="flex justify-between items-center">
                <span>07:00 AM · Baguettes & Brioche</span>
                <span className="text-[10px] text-amber-300/80">Oven 1</span>
              </li>
              <li className="flex justify-between items-center">
                <span>09:30 AM · Country Sourdough</span>
                <span className="text-[10px] text-amber-300/80">Oven 2</span>
              </li>
              <li className="flex justify-between items-center">
                <span>02:00 PM · Cardamom Buns</span>
                <span className="text-[10px] text-amber-300/80">Hearth</span>
              </li>
              <li className="flex justify-between items-center">
                <span>04:30 PM · Afternoon Focaccia</span>
                <span className="text-[10px] text-amber-300/80">Deck 2</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer & Directions CTA */}
        <div className="mt-6 pt-4 border-t border-amber-400/20">
          <button
            type="button"
            onClick={() => {
              onJumpToDirections();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 active:scale-95 border border-amber-400/40 text-xs font-semibold text-amber-100 transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>Visit Bakery & Map</span>
          </button>

          <p className="mt-2 text-center text-[10px] text-stone-400">
            Open Daily 06:30 AM – 06:00 PM · Old Town Plaza
          </p>
        </div>
      </div>
    </div>
  );
}
