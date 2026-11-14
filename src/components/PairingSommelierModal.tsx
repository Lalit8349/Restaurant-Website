import React, { useState, useEffect } from 'react';
import { X, Coffee, Sparkles, Check, Share2, Award } from 'lucide-react';
import {
  PAIRING_BREADS,
  PAIRING_SPREADS,
  PAIRING_BEVERAGES,
  generateTastingFlight,
} from '../utils/pairingSommelier';

interface PairingSommelierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PairingSommelierModal: React.FC<PairingSommelierModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedBread, setSelectedBread] = useState(PAIRING_BREADS[1].id); // Almond Croissant
  const [selectedSpread, setSelectedSpread] = useState(PAIRING_SPREADS[0].id); // Whipped Butter
  const [selectedBeverage, setSelectedBeverage] = useState(PAIRING_BEVERAGES[0].id); // Ethiopian Pour-Over
  const [mobileTab, setMobileTab] = useState<'bread' | 'spread' | 'beverage'>('bread');
  const [copied, setCopied] = useState(false);

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

  const flight = generateTastingFlight(selectedBread, selectedSpread, selectedBeverage);
  const breadObj = PAIRING_BREADS.find((b) => b.id === selectedBread)!;
  const spreadObj = PAIRING_SPREADS.find((s) => s.id === selectedSpread)!;
  const bevObj = PAIRING_BEVERAGES.find((b) => b.id === selectedBeverage)!;

  const handleCopyCard = async () => {
    const text = `✨ Golden Grain Artisanal Flight: ${flight.flightTitle}
🍞 Bread: ${breadObj.name}
🧈 Spread: ${spreadObj.name}
☕ Beverage: ${bevObj.name}
📜 Harmony Notes: ${flight.harmonySummary}
🏆 Sommelier Score: ${flight.sommelierScore}/100`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Artisan Pairing Sommelier"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92dvh] overflow-y-auto rounded-2xl bg-[#17181a] border-2 border-[#d4af37]/40 shadow-2xl p-4 sm:p-8 text-[#f7f3e8]"
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
          aria-label="Close Sommelier"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pb-5 border-b border-[#d4af37]/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs uppercase tracking-widest font-semibold mb-2">
            <Coffee className="w-3.5 h-3.5" />
            Morning Flight Builder
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif tracking-wide text-[#f7f3e8]">
            Artisan Pairing Sommelier
          </h2>
          <p className="text-xs sm:text-sm text-[#d4af37]/80 mt-1 font-serif italic">
            Select one bread, one artisanal spread, and one beverage to craft your harmonic morning pairing.
          </p>
        </div>

        {/* Mobile Category Tab Switcher */}
        <div className="mt-4 flex md:hidden items-center justify-between gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
          <button
            type="button"
            onClick={() => setMobileTab('bread')}
            className={`flex-1 py-2 text-xs font-mono font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer ${
              mobileTab === 'bread'
                ? 'bg-[#d4af37] text-black shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>🍞</span>
            <span>1. Bread</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('spread')}
            className={`flex-1 py-2 text-xs font-mono font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer ${
              mobileTab === 'spread'
                ? 'bg-[#d4af37] text-black shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>🧈</span>
            <span>2. Spread</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('beverage')}
            className={`flex-1 py-2 text-xs font-mono font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer ${
              mobileTab === 'beverage'
                ? 'bg-[#d4af37] text-black shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>☕</span>
            <span>3. Drink</span>
          </button>
        </div>

        {/* Pairing Pickers (3 columns on desktop, active tab on mobile) */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Bread Selection */}
          <div className={`space-y-3 ${mobileTab !== 'bread' ? 'hidden md:block' : ''}`}>
            <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider text-amber-400 font-bold border-b border-zinc-800 pb-2">
              <span>1. Artisan Bread</span>
            </div>
            <div className="space-y-2">
              {PAIRING_BREADS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedBread(item.id)}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer min-h-[44px] ${
                    selectedBread === item.id
                      ? 'bg-[#d4af37]/15 border-[#d4af37] shadow-md shadow-[#d4af37]/10'
                      : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xl sm:text-2xl shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-zinc-100 truncate">{item.name}</p>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-tight mt-0.5">{item.tagline}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Spread Selection */}
          <div className={`space-y-3 ${mobileTab !== 'spread' ? 'hidden md:block' : ''}`}>
            <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider text-amber-400 font-bold border-b border-zinc-800 pb-2">
              <span>2. Artisanal Spread</span>
            </div>
            <div className="space-y-2">
              {PAIRING_SPREADS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedSpread(item.id)}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer min-h-[44px] ${
                    selectedSpread === item.id
                      ? 'bg-[#d4af37]/15 border-[#d4af37] shadow-md shadow-[#d4af37]/10'
                      : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xl sm:text-2xl shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-zinc-100 truncate">{item.name}</p>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-tight mt-0.5">{item.tagline}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Beverage Selection */}
          <div className={`space-y-3 ${mobileTab !== 'beverage' ? 'hidden md:block' : ''}`}>
            <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider text-amber-400 font-bold border-b border-zinc-800 pb-2">
              <span>3. Morning Beverage</span>
            </div>
            <div className="space-y-2">
              {PAIRING_BEVERAGES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedBeverage(item.id)}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer min-h-[44px] ${
                    selectedBeverage === item.id
                      ? 'bg-[#d4af37]/15 border-[#d4af37] shadow-md shadow-[#d4af37]/10'
                      : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xl sm:text-2xl shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-zinc-100 truncate">{item.name}</p>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-tight mt-0.5">{item.tagline}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generated Tasting Card */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#201d18] via-[#1a1714] to-[#12100d] border-2 border-[#d4af37]/60 shadow-xl relative overflow-hidden">
          {/* Subtle gold watermark pattern */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Sparkles className="w-48 h-48 text-[#d4af37]" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#d4af37]/30 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] block font-bold">
                  Custom Curated Tasting Card
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-[#f7f3e8] mt-0.5">
                  {flight.flightTitle}
                </h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-xs font-mono font-bold">
                <Award className="w-4 h-4" />
                Score: {flight.sommelierScore}/100 Harmony
              </div>
            </div>

            {/* Selected Trio Pill row */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700 text-xs font-serif text-zinc-200">
                {breadObj.icon} {breadObj.name}
              </span>
              <span className="px-3 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700 text-xs font-serif text-zinc-200">
                {spreadObj.icon} {spreadObj.name}
              </span>
              <span className="px-3 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700 text-xs font-serif text-zinc-200">
                {bevObj.icon} {bevObj.name}
              </span>
            </div>

            {/* Harmony Note */}
            <div className="mt-4">
              <p className="text-sm sm:text-base font-serif italic text-amber-100/90 leading-relaxed">
                "{flight.harmonySummary}"
              </p>
              <div className="mt-3 text-xs font-mono text-zinc-400 bg-black/40 p-3 rounded-lg border border-zinc-800">
                {flight.palateJourney}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={handleCopyCard}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl bg-[#d4af37] hover:bg-amber-400 text-black font-semibold text-xs font-serif flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer min-h-[44px]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-black" />
                    Copy Tasting Card
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
