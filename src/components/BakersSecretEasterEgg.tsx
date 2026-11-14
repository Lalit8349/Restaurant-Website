import { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { EasterEggItem } from '../utils/bakersSecretHunt';

interface BakersSecretEasterEggProps {
  egg: EasterEggItem;
  isFound: boolean;
  onDiscover: (egg: EasterEggItem) => void;
  className?: string;
}

export function BakersSecretEasterEgg({
  egg,
  isFound,
  onDiscover,
  className = '',
}: BakersSecretEasterEggProps) {
  const [justClicked, setJustClicked] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setJustClicked(true);
    setTimeout(() => setJustClicked(false), 800);
    onDiscover(egg);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        title={
          isFound
            ? `You discovered ${egg.name}! (Already collected)`
            : `✦ Secret Baker's Companion: ${egg.name}. Click to collect!`
        }
        aria-label={`Easter egg: ${egg.name}. ${isFound ? 'Already found' : 'Click to collect'}`}
        className={`group relative flex items-center justify-center p-2 rounded-2xl transition-all duration-300 cursor-pointer active:scale-90 focus-visible:outline-2 focus-visible:outline-amber-200 ${
          isFound
            ? 'bg-amber-500/20 border border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
            : 'bg-black/50 hover:bg-black/75 border border-amber-300/40 hover:border-amber-200 shadow-[0_4px_16px_rgba(0,0,0,0.6)] animate-pulse'
        } ${justClicked ? 'scale-125 rotate-6' : ''}`}
      >
        {/* Subtle glowing halo */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl bg-amber-400/20 blur-md pointer-events-none group-hover:bg-amber-400/35 transition-colors"
        />

        {/* Avatar / Creature visual */}
        <span className="relative text-xl sm:text-2xl select-none filter drop-shadow">
          {egg.avatar}
        </span>

        {/* Found badge checkmark or sparkle */}
        {isFound ? (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-black shadow-sm"
          >
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-amber-400 text-stone-900 animate-spin"
            style={{ animationDuration: '6s' }}
          >
            <Sparkles className="w-2.5 h-2.5" />
          </span>
        )}
      </button>
    </div>
  );
}
