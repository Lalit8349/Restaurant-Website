import { FastForward } from 'lucide-react';
import {
  STORY_SPEED_OPTIONS,
  StorySpeed,
  getNextStorySpeed,
} from '../utils/timelineControls';

interface StorySpeedControlProps {
  storySpeed: StorySpeed;
  onSpeedChange: (speed: StorySpeed) => void;
  className?: string;
}

export function StorySpeedControl({
  storySpeed,
  onSpeedChange,
  className = '',
}: StorySpeedControlProps) {
  const handleCycleSpeed = () => {
    onSpeedChange(getNextStorySpeed(storySpeed));
  };

  return (
    <>
      {/* Mobile compact single tap cycle button */}
      <button
        type="button"
        onClick={handleCycleSpeed}
        title={`Current speed: ${storySpeed}x. Tap to cycle speed.`}
        aria-label={`Story speed: ${storySpeed}x. Tap to cycle speed.`}
        className={`sm:hidden inline-flex items-center gap-1 px-2 py-1 min-h-[36px] rounded-full bg-black/45 border border-white/20 active:scale-95 text-[11px] font-mono font-bold text-amber-200 cursor-pointer ${className}`}
      >
        <FastForward className="w-3 h-3 text-amber-300" />
        <span>{storySpeed}x</span>
      </button>

      {/* Desktop / tablet segmented control */}
      <div
        role="group"
        aria-label="Story auto-scroll playback speed"
        className={`hidden sm:inline-flex items-center p-0.5 rounded-full bg-black/45 border border-white/20 backdrop-blur-xs ${className}`}
      >
        <FastForward className="w-3 h-3 text-amber-300/80 ml-1.5 mr-0.5 shrink-0" />
        {STORY_SPEED_OPTIONS.map((opt) => {
          const isSelected = storySpeed === opt.speed;
          return (
            <button
              key={opt.speed}
              type="button"
              onClick={() => onSpeedChange(opt.speed)}
              aria-pressed={isSelected}
              title={`${opt.label} (${opt.description}) story speed`}
              className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold rounded-full transition-all duration-150 cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-amber-500/35 border border-amber-300 text-amber-100 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                  : 'text-stone-300 hover:text-white border border-transparent'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
