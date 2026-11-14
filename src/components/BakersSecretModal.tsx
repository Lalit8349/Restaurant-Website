import { useEffect, useRef, useState } from 'react';
import { X, Sparkles, Copy, Check, Gift } from 'lucide-react';
import {
  EASTER_EGG_ITEMS,
  SECRET_PROMO_CODE,
  TOTAL_EASTER_EGGS,
  calculateHuntProgress,
} from '../utils/bakersSecretHunt';

interface BakersSecretModalProps {
  foundIds: string[];
  isOpen: boolean;
  onClose: () => void;
}

export function BakersSecretModal({
  foundIds,
  isOpen,
  onClose,
}: BakersSecretModalProps) {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const { allFound } = calculateHuntProgress(foundIds);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(SECRET_PROMO_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bakers-secret-title"
      data-testid="bakers-secret-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-md max-h-[92dvh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#1f1911] via-[#14120e] to-[#0d0c09] border border-amber-400/40 p-4 sm:p-7 text-stone-200 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(217,119,6,0.2)] focus:outline-none"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Baker's Secret dialog"
          className="absolute top-3.5 right-3.5 p-2 rounded-full text-stone-400 hover:text-white bg-stone-900/60 hover:bg-stone-800 border border-white/10 hover:border-amber-300/40 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Crest */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/35 text-[11px] font-semibold text-amber-300 uppercase tracking-widest shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Master Baker's Secret Hunt</span>
          </div>

          <h3
            id="bakers-secret-title"
            className="mt-3 font-display text-xl sm:text-2xl font-bold text-amber-100"
          >
            {allFound ? 'Secret Chamber Unlocked!' : 'The Baker\'s Companions'}
          </h3>

          <p className="mt-1.5 text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm">
            {allFound
              ? 'Congratulations! You uncovered all 3 hidden baker companions along the Golden Grain journey.'
              : `Search the story chapters to find all ${TOTAL_EASTER_EGGS} companions. Currently discovered: ${foundIds.length}/${TOTAL_EASTER_EGGS}.`}
          </p>
        </div>

        {/* Promo Code Card when All Found */}
        {allFound ? (
          <div className="mt-5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-stone-900/80 border border-amber-400/40 p-4 sm:p-5 text-center shadow-lg">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 uppercase tracking-wide">
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Official Bakery Door Voucher</span>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
              <code className="px-4 py-2 rounded-xl bg-black/60 border border-amber-400/50 font-mono text-xl sm:text-2xl font-bold tracking-widest text-amber-200 select-all">
                {SECRET_PROMO_CODE}
              </code>
              <button
                type="button"
                onClick={handleCopyCode}
                aria-label="Copy promo code"
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500/30 hover:bg-amber-500/50 active:scale-95 border border-amber-400/40 text-xs font-semibold text-white cursor-pointer transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-200" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <p className="mt-2.5 text-[11px] sm:text-xs text-amber-100/80 leading-relaxed">
              Whisper this password at the bakery counter for <span className="font-semibold text-amber-200">15% off</span> any wood-fired loaf or morning pastry!
            </p>
          </div>
        ) : null}

        {/* Companions Checklist & Clues */}
        <div className="mt-5 space-y-2.5">
          <h4 className="text-[11px] uppercase tracking-wider text-amber-200/70 font-semibold">
            Companion Field Roster
          </h4>
          {EASTER_EGG_ITEMS.map((egg) => {
            const isFound = foundIds.includes(egg.id);
            return (
              <div
                key={egg.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                  isFound
                    ? 'bg-amber-500/10 border-amber-400/35 text-amber-100'
                    : 'bg-black/30 border-white/10 text-stone-400'
                }`}
              >
                <span className="text-xl shrink-0 filter drop-shadow">
                  {egg.avatar}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-white truncate">
                      {egg.name}
                    </span>
                    {isFound ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Discovered</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-300/70 italic">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-stone-300">
                    {isFound ? egg.locationDescription : `Clue: ${egg.clue}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Dismiss Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-full text-xs sm:text-sm font-semibold text-stone-100 bg-amber-600/30 hover:bg-amber-600/50 active:scale-95 border border-amber-400/40 hover:border-amber-300 transition-all cursor-pointer"
          >
            {allFound ? 'Close Secret Chamber' : 'Continue Searching'}
          </button>
        </div>
      </div>
    </div>
  );
}
