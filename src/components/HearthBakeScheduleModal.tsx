import React, { useEffect, useState } from 'react';
import { Bell, Flame, Clock, X, Sparkles, CheckCircle2 } from 'lucide-react';
import {
  BAKE_SLOTS,
  getActiveBakeStatus,
  formatMinutesCountdown,
  playOvenBellSound,
} from '../utils/hearthBakeSchedule';

interface HearthBakeScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HearthBakeScheduleModal: React.FC<HearthBakeScheduleModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [now, setNow] = useState(new Date());
  const [isRinging, setIsRinging] = useState(false);
  const [chimeFeedback, setChimeFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { currentSlot, nextSlot, minutesUntilNext } = getActiveBakeStatus(now);

  const handleRingBell = () => {
    setIsRinging(true);
    playOvenBellSound();
    setChimeFeedback('Oven bell rung! The baker has heard your call.');
    setTimeout(() => {
      setIsRinging(false);
    }, 800);
    setTimeout(() => {
      setChimeFeedback(null);
    }, 4000);
  };

  const formattedTime = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Daily Hearth Bake Schedule"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92dvh] overflow-y-auto rounded-2xl bg-[#181a1b] border-2 border-[#d4af37]/40 shadow-2xl p-4 sm:p-8 text-[#f7f3e8]"
        style={{
          boxShadow: '0 0 45px rgba(212, 175, 55, 0.2), inset 0 0 20px rgba(0, 0, 0, 0.8)',
          backgroundImage:
            'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.08), transparent 70%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-2 rounded-full text-[#d4af37]/70 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Close Schedule"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Vintage Chalkboard Header */}
        <div className="text-center pb-5 border-b border-[#d4af37]/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs uppercase tracking-widest font-semibold mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            Live Stone Hearth Monitor
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif tracking-wide text-[#f7f3e8]">
            Daily Hearth Bake Schedule
          </h2>
          <p className="text-xs sm:text-sm text-[#d4af37]/80 mt-1 font-serif italic">
            Synchronized to your local time · Real-world stone oven cycle
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-mono text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Local Hearth Time: <strong className="text-zinc-200">{formattedTime}</strong></span>
          </div>
        </div>

        {/* Live Status Banner */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-amber-950/40 border border-amber-600/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400/90 font-bold block">
                Fresh Right Now
              </span>
              <p className="text-sm font-semibold text-zinc-100">{currentSlot.name}</p>
              <p className="text-xs text-amber-200/70">{currentSlot.ovenDeck} · {currentSlot.temperature}</p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
              Next Bake Countdown
            </span>
            <div className="text-lg font-bold font-mono text-[#d4af37]">
              {formatMinutesCountdown(minutesUntilNext)}
            </div>
            <span className="text-[11px] text-zinc-400">
              {nextSlot.timeLabel} · {nextSlot.name.split('&')[0].trim()}
            </span>
          </div>
        </div>

        {/* Schedule Slate Slots */}
        <div className="mt-6 space-y-3">
          {BAKE_SLOTS.map((slot) => {
            const isCurrent = slot.id === currentSlot.id;
            const isNext = slot.id === nextSlot.id;

            return (
              <div
                key={slot.id}
                className={`p-4 rounded-xl transition-all border ${
                  isCurrent
                    ? 'bg-[#d4af37]/10 border-[#d4af37] shadow-lg shadow-[#d4af37]/10'
                    : isNext
                    ? 'bg-zinc-800/50 border-amber-500/40'
                    : 'bg-zinc-900/40 border-zinc-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                        isCurrent
                          ? 'bg-[#d4af37] text-black'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {slot.timeLabel}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-serif font-semibold text-zinc-100 flex items-center gap-2">
                        {slot.name}
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-sans font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            <CheckCircle2 className="w-3 h-3" /> Fresh Out Now
                          </span>
                        )}
                        {isNext && !isCurrent && (
                          <span className="text-[10px] uppercase font-sans font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Up Next
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-zinc-400 font-sans mt-0.5">{slot.description}</p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[11px] font-mono text-[#d4af37]/90 block">
                      {slot.temperature}
                    </span>
                    <span className="text-[10px] font-sans text-zinc-400 block">
                      {slot.ovenDeck}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Bell Section */}
        <div className="mt-6 pt-5 border-t border-[#d4af37]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="text-xs text-zinc-300 font-medium">Hearth Bell Service</div>
            <div className="text-[11px] text-zinc-500">Ring the brass oven bell to signal the baker's deck.</div>
            {chimeFeedback && (
              <div className="text-xs text-amber-400 mt-1 font-serif italic animate-fadeIn">
                {chimeFeedback}
              </div>
            )}
          </div>

          <button
            onClick={handleRingBell}
            className={`w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl font-serif text-sm font-semibold flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 cursor-pointer min-h-[44px] ${
              isRinging
                ? 'bg-amber-400 text-black scale-105 shadow-amber-400/50'
                : 'bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-600 text-black hover:brightness-110 shadow-amber-600/30'
            }`}
          >
            <Bell className={`w-4 h-4 ${isRinging ? 'animate-bounce text-black' : ''}`} />
            Ring for Next Batch
          </button>
        </div>
      </div>
    </div>
  );
};
