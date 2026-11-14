import { RefObject } from 'react';
import { Menu, Pause, Play, Sparkles } from 'lucide-react';
import { ChapterId, STORY_CHAPTERS } from '../utils/storyTimeline';
import { StorySpeed } from '../utils/timelineControls';
import { EnvironmentThemeToggle } from './EnvironmentThemeToggle';
import { StorySpeedControl } from './StorySpeedControl';

interface TopBarProps {
  activeChapterId: ChapterId;
  progress: number;
  progressFillRef?: RefObject<HTMLDivElement | null>;
  isAutoScrolling: boolean;
  onJumpToChapter: (progress: number) => void;
  onToggleAutoScroll: () => void;
  isDay: boolean;
  onToggleEnvironment: (isDay: boolean) => void;
  easterEggsFound?: number;
  totalEasterEggs?: number;
  onOpenEasterEggModal?: () => void;
  storySpeed: StorySpeed;
  onSpeedChange: (speed: StorySpeed) => void;
  onToggleSliderWindow?: () => void;
}

export function TopBar({
  activeChapterId,
  progress,
  progressFillRef,
  isAutoScrolling,
  onJumpToChapter,
  onToggleAutoScroll,
  isDay,
  onToggleEnvironment,
  easterEggsFound = 0,
  totalEasterEggs = 3,
  onOpenEasterEggModal,
  storySpeed,
  onSpeedChange,
  onToggleSliderWindow,
}: TopBarProps) {
  const activeChapter =
    STORY_CHAPTERS.find((c) => c.id === activeChapterId) || STORY_CHAPTERS[0];

  const allEggsFound = easterEggsFound >= totalEasterEggs;

  return (
    <header className="fixed top-0 inset-x-0 z-30 bg-gradient-to-b from-black/80 via-black/45 to-transparent border-b border-white/20 pt-[env(safe-area-inset-top,0px)]">
      <div className="w-full px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-6">
        <div className="flex items-center shrink-0 min-w-0">
          {onToggleSliderWindow && (
            <button
              type="button"
              onClick={onToggleSliderWindow}
              aria-label="Open bakery slider window"
              title="Open Bakery Explorer & Drawer"
              className="group flex items-center justify-center p-2 bg-transparent hover:bg-amber-400/10 active:scale-90 border-0 rounded-full cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-amber-200"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 group-hover:text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-transform group-hover:scale-110" />
            </button>
          )}

          {/* Minimum 1 inch (96px) separation on desktop/tablet, compact on narrow mobile */}
          <div className="ml-2.5 sm:ml-[1in] flex items-center">
            <a
              href="#beat-prologue"
              onClick={(e) => {
                e.preventDefault();
                onJumpToChapter(0);
              }}
              className="font-display text-base sm:text-2xl font-semibold tracking-tight text-white video-text-shadow whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
            >
              Golden Grain
            </a>
          </div>
        </div>

        {/* Active chapter pill badge (shown when ample space permits) */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-amber-300/30 text-[10px] text-amber-200/90 video-text-shadow max-w-[130px] truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="truncate">{activeChapter.label}</span>
        </div>

        <nav
          aria-label="Story chapters"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {STORY_CHAPTERS.map((chapter) => {
            const isActive = chapter.id === activeChapterId;
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => onJumpToChapter(chapter.jumpProgress)}
                aria-current={isActive ? 'step' : undefined}
                className={`relative py-1.5 transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer video-text-shadow focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200 ${
                  isActive
                    ? 'text-amber-100 font-semibold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {chapter.navLabel}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-0.5 h-px bg-amber-200 transition-opacity duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Story Speed Control */}
          <StorySpeedControl
            storySpeed={storySpeed}
            onSpeedChange={onSpeedChange}
          />

          {/* Easter Egg Hunt Tracker */}
          {onOpenEasterEggModal && (
            <button
              type="button"
              onClick={onOpenEasterEggModal}
              title={
                allEggsFound
                  ? 'All 3 Baker\'s Secrets Found! Click to view secret promo code'
                  : `Baker's Secret: ${easterEggsFound}/${totalEasterEggs} Found. Click for clues!`
              }
              aria-label={`Baker's secret Easter egg tracker, ${easterEggsFound} of ${totalEasterEggs} found`}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 min-h-[36px] text-[11px] sm:text-xs font-semibold rounded-full border transition-all duration-200 cursor-pointer active:scale-95 video-text-shadow focus-visible:outline-2 focus-visible:outline-amber-200 ${
                allEggsFound
                  ? 'bg-amber-500/35 border-amber-300 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.35)] animate-pulse'
                  : 'bg-black/40 hover:bg-black/60 border-white/25 hover:border-amber-300/60 text-amber-200/90'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="hidden md:inline">Secrets:</span>
              <span className="font-mono text-amber-100 font-bold">
                {easterEggsFound}/{totalEasterEggs}
              </span>
            </button>
          )}

          {/* Day & Night Environment Toggle */}
          <EnvironmentThemeToggle
            isDay={isDay}
            onToggle={onToggleEnvironment}
          />

          {/* Auto-Scroll Play/Pause */}
          <button
            type="button"
            onClick={onToggleAutoScroll}
            aria-pressed={isAutoScrolling}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[44px] text-xs sm:text-sm font-semibold text-white bg-black/40 hover:bg-black/60 border border-white/35 hover:border-amber-200 active:scale-95 transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer rounded-full video-text-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
          >
            {isAutoScrolling ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-200 shrink-0" aria-hidden="true" />
                <span>Pause</span>
                <span className="hidden sm:inline">&nbsp;Story</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-200 shrink-0" aria-hidden="true" />
                <span>Play</span>
                <span className="hidden sm:inline">&nbsp;Story</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="h-[1.5px] w-full bg-white/10 overflow-hidden"
      >
        <div
          ref={progressFillRef}
          data-testid="topbar-progress-fill"
          className="h-full bg-amber-200/90 origin-left will-change-[transform,opacity]"
          style={{
            transformOrigin: 'left',
          }}
        />
      </div>
    </header>
  );
}
