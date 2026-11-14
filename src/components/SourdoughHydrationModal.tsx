import React, { useState, useEffect } from 'react';
import { X, Droplets, Flame, Clock, Award, Lightbulb, Sparkles } from 'lucide-react';
import { getHydrationProfile } from '../utils/sourdoughHydration';

interface SourdoughHydrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SourdoughHydrationModal: React.FC<SourdoughHydrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [hydration, setHydration] = useState<number>(75);

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

  const profile = getHydrationProfile(hydration);
  const factor = profile.alveoliFactor; // 0 to 1

  // Generate dynamic alveoli air pockets based on hydration factor
  // Base air bubble templates with relative positions [cx, cy, baseRx, baseRy, angle]
  const airBubbles = [
    { cx: 120, cy: 90, rx: 6 + factor * 22, ry: 4 + factor * 16, rot: 15 },
    { cx: 160, cy: 75, rx: 8 + factor * 28, ry: 5 + factor * 18, rot: -20 },
    { cx: 200, cy: 85, rx: 10 + factor * 32, ry: 7 + factor * 22, rot: 10 },
    { cx: 240, cy: 80, rx: 7 + factor * 25, ry: 5 + factor * 17, rot: -15 },
    { cx: 140, cy: 115, rx: 9 + factor * 30, ry: 6 + factor * 20, rot: 25 },
    { cx: 180, cy: 110, rx: 12 + factor * 38, ry: 8 + factor * 24, rot: -5 },
    { cx: 220, cy: 115, rx: 11 + factor * 34, ry: 7 + factor * 21, rot: 18 },
    { cx: 100, cy: 110, rx: 5 + factor * 18, ry: 4 + factor * 12, rot: -30 },
    { cx: 260, cy: 110, rx: 6 + factor * 19, ry: 4 + factor * 14, rot: 35 },
    { cx: 160, cy: 140, rx: 7 + factor * 22, ry: 5 + factor * 16, rot: -10 },
    { cx: 200, cy: 140, rx: 8 + factor * 24, ry: 5 + factor * 17, rot: 12 },
    // Smaller satellite bubbles
    { cx: 130, cy: 70, rx: 3 + factor * 10, ry: 2 + factor * 8, rot: 45 },
    { cx: 230, cy: 65, rx: 4 + factor * 12, ry: 3 + factor * 9, rot: -40 },
    { cx: 110, cy: 130, rx: 3 + factor * 9, ry: 2 + factor * 7, rot: 20 },
    { cx: 250, cy: 130, rx: 4 + factor * 11, ry: 3 + factor * 8, rot: -25 },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sourdough Hydration & Crumb Inspector"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92dvh] overflow-y-auto rounded-2xl bg-[#17181a] border-2 border-[#d4af37]/40 shadow-2xl p-4 sm:p-8 text-[#f7f3e8]"
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
          aria-label="Close Inspector"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pb-5 border-b border-[#d4af37]/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs uppercase tracking-widest font-semibold mb-2">
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
            Flour & Water Science
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif tracking-wide text-[#f7f3e8]">
            Sourdough Hydration & Crumb Inspector
          </h2>
          <p className="text-xs sm:text-sm text-[#d4af37]/80 mt-1 font-serif italic">
            Slide to explore how baker's hydration dictates alveoli aerations, ear rise, and crumb texture.
          </p>
        </div>

        {/* Interactive Hydration Slider Section */}
        <div className="mt-6 p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Baker's Hydration
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-[#d4af37]">
                {hydration}%
              </span>
              <span className="text-xs font-mono text-zinc-400">({profile.flourWaterRatio})</span>
            </div>
          </div>

          <input
            type="range"
            min={65}
            max={85}
            step={1}
            value={hydration}
            onChange={(e) => setHydration(Number(e.target.value))}
            className="w-full h-2.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
          />

          {/* Preset Buttons */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {[65, 72, 78, 85].map((preset) => (
              <button
                key={preset}
                onClick={() => setHydration(preset)}
                className={`py-2 px-2 rounded-lg text-xs font-mono transition-all min-h-[40px] flex items-center justify-center cursor-pointer ${
                  hydration === preset
                    ? 'bg-[#d4af37] text-black font-bold shadow'
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                }`}
              >
                {preset}% {preset === 65 ? 'Sandwich' : preset === 72 ? 'Boule' : preset === 78 ? 'Batard' : 'Wild'}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Sourdough Cross-Section Visualization */}
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-black border border-stone-800 flex flex-col items-center">
          <div className="w-full max-w-md">
            <svg
              viewBox="0 0 360 200"
              className="w-full h-auto drop-shadow-2xl transition-all duration-300"
            >
              <defs>
                {/* Crust gradient shifts from golden wheat (65%) to deep mahogany caramelized blister (85%) */}
                <linearGradient id="crustGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop
                    offset="0%"
                    stopColor={factor > 0.6 ? '#3d1c06' : factor > 0.3 ? '#7a3e10' : '#b07026'}
                  />
                  <stop
                    offset="40%"
                    stopColor={factor > 0.6 ? '#6d300b' : '#c27d2c'}
                  />
                  <stop
                    offset="100%"
                    stopColor={factor > 0.6 ? '#281103' : '#572d0b'}
                  />
                </linearGradient>

                {/* Crumb interior gradient */}
                <radialGradient id="crumbGrad" cx="50%" cy="65%" r="65%">
                  <stop
                    offset="0%"
                    stopColor={factor > 0.6 ? '#fbf4d4' : factor > 0.3 ? '#f6edca' : '#f5e9bd'}
                    stopOpacity="1"
                  />
                  <stop
                    offset="80%"
                    stopColor={factor > 0.6 ? '#ebd99f' : '#edd693'}
                    stopOpacity="0.95"
                  />
                  <stop
                    offset="100%"
                    stopColor="#d1b26a"
                    stopOpacity="0.9"
                  />
                </radialGradient>

                {/* Custard sheen glow for high hydration */}
                <filter id="custardGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Crust Outer Arch & Blistered Ear */}
              <path
                d={`M 40 160 C 40 45, 120 20, 180 20 C 240 20, 320 45, 320 160 Z`}
                fill="url(#crustGrad)"
                stroke="#1f0c02"
                strokeWidth={2 + factor * 2.5}
              />

              {/* Sourdough Blistered Ear Score Lift */}
              <path
                d={`M 175 20 Q ${165 - factor * 25} ${8 - factor * 8}, ${195 + factor * 15} 24`}
                fill="none"
                stroke="#2a1205"
                strokeWidth={3 + factor * 3}
                strokeLinecap="round"
              />

              {/* Interior Crumb Mass */}
              <path
                d={`M 48 156 C 48 55, 124 32, 180 32 C 236 32, 312 55, 312 156 Z`}
                fill="url(#crumbGrad)"
              />

              {/* Bread Bottom Floor Crust */}
              <rect
                x="40"
                y="155"
                width="280"
                height={8 + factor * 4}
                rx="4"
                fill="#2b1103"
              />

              {/* Alveoli Air Pockets */}
              {airBubbles.map((b, i) => (
                <ellipse
                  key={i}
                  cx={b.cx}
                  cy={b.cy}
                  rx={b.rx}
                  ry={b.ry}
                  transform={`rotate(${b.rot} ${b.cx} ${b.cy})`}
                  fill={factor > 0.6 ? '#d9bf79' : '#e6ce8a'}
                  stroke={factor > 0.5 ? '#bfa052' : '#d2b467'}
                  strokeWidth="1.2"
                  opacity={0.75 + factor * 0.25}
                />
              ))}

              {/* High hydration custard sheen highlights */}
              {factor > 0.5 && (
                <path
                  d="M 150 95 Q 180 85 210 95 Q 180 110 150 95"
                  fill="rgba(255, 255, 255, 0.35)"
                  filter="url(#custardGlow)"
                />
              )}
            </svg>
          </div>

          <div className="mt-4 flex items-center justify-between w-full text-xs text-stone-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Crumb Aeration: {Math.round(factor * 100)}% Open
            </span>
            <span className="text-[#d4af37] font-semibold">{profile.name}</span>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
            <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider text-amber-400 mb-1">
              <Clock className="w-3.5 h-3.5" />
              Fermentation Schedule
            </div>
            <p className="text-sm font-semibold text-zinc-100">{profile.fermentationTime}</p>
            <p className="text-xs text-zinc-400 mt-1 font-sans">{profile.crumbDescription}</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
            <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider text-amber-400 mb-1">
              <Flame className="w-3.5 h-3.5" />
              Crust & Character
            </div>
            <p className="text-sm font-semibold text-zinc-100">{profile.crustThickness}</p>
            <div className="mt-2 flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-xs text-zinc-300 font-medium">Difficulty Level:</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                {profile.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Baker's Tip Banner */}
        <div className="mt-4 p-4 rounded-xl bg-amber-950/20 border border-amber-600/30 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs uppercase font-mono tracking-wider text-amber-300 font-bold">
              Artisan Baker's Technique
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 mt-0.5 font-serif leading-relaxed">
              {profile.bakersTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
