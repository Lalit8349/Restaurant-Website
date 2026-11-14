import { useState } from 'react';
import { ChapterId, STORY_CHAPTERS } from '../utils/storyTimeline';
import { getChapterThumbnail } from '../utils/timelineControls';
import { Clock } from 'lucide-react';

interface JourneyProgressRailProps {
  activeChapterId: ChapterId;
  onJumpToChapter: (progress: number) => void;
}

export function JourneyProgressRail({
  activeChapterId,
  onJumpToChapter,
}: JourneyProgressRailProps) {
  const [hoveredChapterId, setHoveredChapterId] = useState<ChapterId | null>(null);

  return (
    <aside
      aria-label="Journey stage quick jump rail"
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-20 flex-col items-end"
    >
      <div className="bg-transparent px-2 py-2 flex flex-col items-end gap-3">
        {STORY_CHAPTERS.map((chapter) => {
          const isActive = chapter.id === activeChapterId;
          const thumb = getChapterThumbnail(chapter.id);
          const isHovered = hoveredChapterId === chapter.id;

          return (
            <div
              key={chapter.id}
              className="relative flex items-center justify-end"
              onMouseEnter={() => setHoveredChapterId(chapter.id)}
              onMouseLeave={() => setHoveredChapterId(null)}
            >
              {/* Live Hover Preview Thumbnail Card */}
              <div
                aria-hidden="true"
                className={`absolute right-full mr-4 w-52 rounded-2xl bg-gradient-to-b from-[#1c1813] via-[#14120e] to-[#0d0c09] border border-amber-400/40 p-2.5 shadow-[0_15px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(217,119,6,0.2)] pointer-events-none transition-all duration-200 z-50 ${
                  isHovered
                    ? 'opacity-100 translate-x-0 scale-100'
                    : 'opacity-0 translate-x-3 scale-95'
                }`}
              >
                {/* Thumbnail Image Frame */}
                <div className="relative w-full h-24 rounded-lg overflow-hidden border border-amber-400/25 bg-black/50">
                  <img
                    src={thumb.frameSrc}
                    alt={thumb.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] text-amber-200 font-mono">
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3 h-3 text-amber-300" />
                      <span>{thumb.timestamp}</span>
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-amber-100/90 font-medium">
                      Stage {chapter.number}
                    </span>
                  </div>
                </div>

                {/* Card Lore & Details */}
                <div className="mt-2 text-left">
                  <h4 className="text-xs font-display font-bold text-amber-100 truncate">
                    {chapter.number}. {thumb.title}
                  </h4>
                  <p className="mt-0.5 text-[10px] text-stone-300 line-clamp-1">
                    {thumb.subtitle}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1 text-[9px] text-amber-300/80 font-medium">
                    <span>✦ Tap to jump to chapter</span>
                  </div>
                </div>

                {/* Arrow Pointer */}
                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rotate-45 bg-[#14120e] border-t border-r border-amber-400/40" />
              </div>

              {/* Bookmark Rail Button */}
              <button
                type="button"
                onClick={() => onJumpToChapter(chapter.jumpProgress)}
                onFocus={() => setHoveredChapterId(chapter.id)}
                onBlur={() => setHoveredChapterId(null)}
                aria-label={`Jump to chapter ${chapter.number}: ${chapter.label}`}
                aria-current={isActive ? 'step' : undefined}
                className={`group flex items-center gap-2.5 py-1 text-xs transition-colors duration-200 cursor-pointer video-text-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 ${
                  isActive
                    ? 'text-amber-100 font-semibold'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                <span className="whitespace-nowrap">{chapter.label}</span>
                <span
                  aria-hidden="true"
                  className={`h-px transition-all duration-200 ${
                    isActive
                      ? 'w-6 bg-amber-200'
                      : 'w-3 bg-white/40 group-hover:w-5 group-hover:bg-white/80'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
