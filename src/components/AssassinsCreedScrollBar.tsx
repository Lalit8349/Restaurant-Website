import { useState, useRef, useEffect, useCallback } from 'react';
import { Clock, Compass, Shield } from 'lucide-react';
import { ChapterId } from '../utils/storyTimeline';
import { getChapterThumbnail } from '../utils/timelineControls';
import {
  MEMORY_SEQUENCES,
  getAnimusSyncPercent,
  getActiveMemorySequence,
} from '../utils/assassinsCreedSync';

interface AssassinsCreedScrollBarProps {
  progress: number;
  activeChapterId: ChapterId;
  onJumpToProgress: (progress: number) => void;
}

export function AssassinsCreedScrollBar({
  progress,
  activeChapterId,
  onJumpToProgress,
}: AssassinsCreedScrollBarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSeqId, setHoveredSeqId] = useState<ChapterId | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const railTrackRef = useRef<HTMLDivElement | null>(null);

  const syncPercent = getAnimusSyncPercent(progress);
  const activeSeq = getActiveMemorySequence(progress);

  const handleSeekFromClientY = useCallback(
    (clientY: number) => {
      if (!railTrackRef.current) return;
      const rect = railTrackRef.current.getBoundingClientRect();
      const rawProgress = (clientY - rect.top) / rect.height;
      const clamped = Math.max(0, Math.min(1, rawProgress));
      onJumpToProgress(clamped);
    },
    [onJumpToProgress]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSeekFromClientY(e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleSeekFromClientY(e.clientY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleSeekFromClientY]);

  const thumbInfo = hoveredSeqId ? getChapterThumbnail(hoveredSeqId) : null;

  return (
    <aside
      aria-label="Assassin's Creed Animus Memory Synchronization Rail"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredSeqId(null);
      }}
      className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end select-none pointer-events-auto"
    >
      {/* Outer Animus HUD Container */}
      <div
        className={`relative flex flex-col items-center p-2 rounded-2xl transition-all duration-300 ${
          isHovered || isDragging
            ? 'bg-black/85 border border-[#d4af37]/60 shadow-[0_0_35px_rgba(212,175,55,0.35),inset_0_0_15px_rgba(0,0,0,0.9)] backdrop-blur-md'
            : 'bg-black/45 border border-white/10 hover:border-[#d4af37]/40'
        }`}
      >
        {/* Assassin's Creed Iconic Insignia Crest at the Apex */}
        <div
          title="Assassin's Creed · Animus Synchronization"
          className="relative group cursor-pointer mb-2 flex flex-col items-center"
          onClick={() => onJumpToProgress(0)}
        >
          {/* Outer Animus energy aura */}
          <div className="absolute -inset-1.5 rounded-full bg-[#d4af37]/20 blur-sm animate-pulse opacity-75 pointer-events-none" />

          {/* Assassin's Crest SVG */}
          <svg
            viewBox="0 0 100 120"
            className="w-5 h-6 sm:w-6 sm:h-7 drop-shadow-[0_0_10px_rgba(212,175,55,0.8)] transition-transform duration-300 group-hover:scale-110"
          >
            <defs>
              <linearGradient id="acGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff2a8" />
                <stop offset="45%" stopColor="#d4af37" />
                <stop offset="75%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#ffd700" />
              </linearGradient>
            </defs>

            {/* Iconic Outer Assassin Hood Arrowhead */}
            <path
              d="M50 6 L90 92 L72 92 L50 46 L28 92 L10 92 Z"
              fill="url(#acGoldGradient)"
              stroke="#261b05"
              strokeWidth="2.5"
            />

            {/* Inner Floating Chevron Blade */}
            <path
              d="M50 56 L66 98 L34 98 Z"
              fill="url(#acGoldGradient)"
              stroke="#261b05"
              strokeWidth="2"
            />
          </svg>

          {/* Micro HUD Tag */}
          <span className="hidden sm:block text-[8px] font-mono tracking-widest text-[#d4af37] font-bold uppercase mt-0.5">
            ANIMUS
          </span>
        </div>

        {/* Vertical Synchronization Memory Rail */}
        <div
          ref={railTrackRef}
          onMouseDown={handleMouseDown}
          className="relative w-7 sm:w-9 h-48 sm:h-64 flex justify-center cursor-pointer my-1"
        >
          {/* Subtle Animus Background Track with Scanline Grid */}
          <div className="absolute top-0 bottom-0 w-1 sm:w-1.5 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 rounded-full border border-[#d4af37]/30 shadow-inner">
            {/* Live Progress Fill Bar with Animus Scanline Pulse */}
            <div
              className="absolute top-0 inset-x-0 bg-gradient-to-b from-[#fef08a] via-[#d4af37] to-[#b45309] rounded-full shadow-[0_0_12px_rgba(212,175,55,0.7)]"
              style={{
                height: `${progress * 100}%`,
              }}
            />
          </div>

          {/* Memory Sequence Diamond Markers */}
          {MEMORY_SEQUENCES.map((seq) => {
            const isPassed = progress >= seq.targetProgress;
            const isCurrent = activeChapterId === seq.id;
            const topPercent = seq.targetProgress * 100;

            return (
              <div
                key={seq.id}
                style={{ top: `${topPercent}%` }}
                onMouseEnter={() => setHoveredSeqId(seq.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  onJumpToProgress(seq.targetProgress);
                }}
                className="absolute -translate-y-1/2 flex items-center justify-center cursor-pointer group/node"
              >
                {/* Diamond Node */}
                <div
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-45 border transition-all duration-200 flex items-center justify-center ${
                    isCurrent
                      ? 'bg-[#d4af37] border-white shadow-[0_0_14px_rgba(255,230,100,0.9)] scale-110'
                      : isPassed
                      ? 'bg-amber-600 border-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.5)]'
                      : 'bg-stone-900 border-stone-600 hover:border-[#d4af37]'
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isCurrent
                        ? 'bg-black animate-ping'
                        : isPassed
                        ? 'bg-[#fef08a]'
                        : 'bg-stone-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}

          {/* Gliding Assassin's Hidden Blade Playhead */}
          <div
            style={{
              top: `${progress * 100}%`,
              transform: 'translateY(-50%)',
            }}
            className="absolute pointer-events-none transition-transform duration-75 flex items-center justify-center"
          >
            {/* Glowing Animus Pulse Ring */}
            <div className="absolute w-8 h-8 rounded-full border border-amber-300/60 animate-ping opacity-40 pointer-events-none" />

            {/* Metallic Assassin Chevron Thumb */}
            <div className="relative flex items-center justify-center">
              <div
                className="w-5 h-5 sm:w-6 sm:h-6 rotate-45 rounded-sm bg-gradient-to-br from-[#fff4b8] via-[#d4af37] to-[#875412] border-2 border-white shadow-[0_0_15px_rgba(245,158,11,0.9),0_0_30px_rgba(212,175,55,0.6)] flex items-center justify-center"
              >
                {/* Inner chevron blade notch */}
                <div className="w-1.5 h-1.5 bg-black rotate-45" />
              </div>
            </div>
          </div>
        </div>

        {/* Live Digital Synchronization Display */}
        <div className="mt-1 flex flex-col items-center">
          <div className="px-1.5 py-0.5 rounded bg-black/70 border border-[#d4af37]/40 text-[9px] sm:text-[10px] font-mono font-bold text-[#d4af37] shadow-sm tracking-wider">
            {syncPercent}%
          </div>
          <span className="hidden sm:block text-[7px] font-mono text-zinc-400 uppercase tracking-widest mt-0.5">
            SYNC
          </span>
        </div>
      </div>

      {/* Hover Memory Sequence Hologram Card */}
      {hoveredSeqId && thumbInfo && (
        <div
          role="tooltip"
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-56 rounded-2xl bg-gradient-to-b from-[#191510] via-[#110f0b] to-[#0a0907] border-2 border-[#d4af37]/60 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(212,175,55,0.35)] pointer-events-none animate-in fade-in zoom-in-95 duration-150 z-50 text-left"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#d4af37]/20 text-[9px] font-mono uppercase text-[#d4af37] tracking-wider font-bold">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#d4af37]" />
              <span>Animus Memory</span>
            </span>
            <span>{thumbInfo.timestamp}</span>
          </div>

          {/* Thumbnail preview */}
          <div className="relative mt-2 w-full h-24 rounded-lg overflow-hidden border border-[#d4af37]/30 bg-black">
            <img
              src={thumbInfo.frameSrc}
              alt={thumbInfo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] text-amber-200 font-mono">
              <span className="flex items-center gap-1 font-semibold">
                <Clock className="w-3 h-3 text-amber-300" />
                <span>{thumbInfo.timestamp}</span>
              </span>
              <span className="text-[8px] uppercase tracking-wider text-amber-100 font-bold px-1.5 py-0.5 rounded bg-black/60 border border-[#d4af37]/40">
                Sequence
              </span>
            </div>
          </div>

          {/* Title & Lore */}
          <div className="mt-2">
            <h4 className="text-xs font-serif font-bold text-amber-100 truncate">
              {thumbInfo.title}
            </h4>
            <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5 font-sans">
              {thumbInfo.subtitle}
            </p>
          </div>

          <div className="mt-2 pt-1.5 border-t border-zinc-800 flex items-center justify-between text-[9px] font-mono text-[#d4af37]">
            <span className="flex items-center gap-1">
              <Compass className="w-3 h-3" /> Click to Synchronize
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
