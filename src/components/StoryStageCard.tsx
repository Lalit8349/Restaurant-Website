import { ArrowDown, ArrowUp, ChevronDown, Sparkles } from 'lucide-react';
import { memo, useRef } from 'react';
import { StoryBeat } from '../utils/storyTimeline';
import { EasterEggItem } from '../utils/bakersSecretHunt';
import { BakersSecretEasterEgg } from './BakersSecretEasterEgg';

interface StoryStageCardProps {
  beat: StoryBeat;
  isActive: boolean;
  onRegisterCard?: (beatId: string, node: HTMLDivElement | null) => void;
  onRegisterScrollIndicator?: (node: HTMLDivElement | null) => void;
  onStartJourney?: () => void;
  onReturnToTop?: () => void;
  onJumpToDirections?: () => void;
  onOpenRecipeCard?: (tag: string) => void;
  easterEggItem?: EasterEggItem;
  isEasterEggFound?: boolean;
  onDiscoverEasterEgg?: (egg: EasterEggItem) => void;
  onOpenCakeFinisher?: () => void;
}

export const StoryStageCard = memo(function StoryStageCard({
  beat,
  isActive,
  onRegisterCard,
  onRegisterScrollIndicator,
  onStartJourney,
  onReturnToTop,
  onJumpToDirections,
  onOpenRecipeCard,
  easterEggItem,
  isEasterEggFound,
  onDiscoverEasterEgg,
  onOpenCakeFinisher,
}: StoryStageCardProps) {
  const isTheEnd = Boolean(beat.isTheEnd);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const alignmentClasses =
    beat.alignment === 'center'
      ? 'justify-center text-center'
      : beat.alignment === 'right'
        ? 'justify-start md:justify-end text-left'
        : 'justify-start text-left';

  const maxWidthClass = isTheEnd
    ? 'max-w-[94vw] sm:max-w-lg mx-auto'
    : beat.isPrologue
      ? 'max-w-[92vw] sm:max-w-md'
      : 'max-w-[90vw] sm:max-w-md';

  const cardClassName =
    'w-full origin-center transition-all p-1 sm:p-3 bg-transparent border-none shadow-none';

  const renderCardContent = () => {
    if (isTheEnd) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-2">
          {/* Miniature Toy Storybook Wax Seal */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/40 border border-amber-300/35 text-amber-200 text-[10px] sm:text-[11px] font-medium tracking-widest uppercase mb-2.5 video-text-shadow">
            <span>🌾 Golden Grain Bakery · Miniature Hearth 🌾</span>
          </div>

          <h2 className="font-display font-bold tracking-tight text-white video-heading-shadow text-2xl sm:text-4xl md:text-5xl leading-tight">
            {beat.title}
          </h2>

          <div className="flex items-center justify-center gap-2 mt-1.5 text-amber-200/90 drop-shadow">
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-amber-200/80" />
            <span className="text-xs">✦ ❖ ✦</span>
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-amber-200/80" />
          </div>

          <p className="mt-3.5 text-sm sm:text-base md:text-lg leading-relaxed text-white font-normal video-text-shadow max-w-[48ch] [text-wrap:pretty]">
            {beat.story}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs text-amber-100 video-text-shadow">
            {beat.details.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onOpenRecipeCard?.(item)}
                title={`Inspect ${item} Field Note & Trivia`}
                aria-label={`Open field note for ${item}`}
                className="group/tag inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 hover:border-amber-300/60 backdrop-blur-xs font-medium cursor-pointer transition-all duration-200 active:scale-95 video-text-shadow focus-visible:outline-2 focus-visible:outline-amber-200"
              >
                <span className="text-[9px] text-amber-300/80 group-hover/tag:text-amber-200 transition-colors">✦</span>
                <span>{item}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {onReturnToTop && (
              <button
                type="button"
                onClick={onReturnToTop}
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold text-white bg-amber-500/25 hover:bg-amber-500/40 active:scale-95 border border-amber-300/45 hover:border-amber-200 rounded-full cursor-pointer video-text-shadow"
              >
                <ArrowUp className="w-3.5 h-3.5 text-amber-200 shrink-0" aria-hidden="true" />
                <span>Replay Story</span>
              </button>
            )}
            {onJumpToDirections && (
              <button
                type="button"
                onClick={onJumpToDirections}
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold text-white bg-black/45 hover:bg-black/65 active:scale-95 border border-white/35 hover:border-amber-200 rounded-full cursor-pointer video-text-shadow"
              >
                <span>Visit Bakery Map</span>
                <ArrowDown className="w-3.5 h-3.5 text-amber-200 shrink-0" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="flex items-center justify-between gap-2">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-amber-300/35 text-[10px] sm:text-[11px] font-medium text-amber-200 tracking-wide uppercase video-text-shadow ${
              beat.alignment === 'center' ? 'mx-auto' : ''
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span>{beat.kicker}</span>
          </div>

          {/* Hidden Easter Egg Companion if present on this beat */}
          {easterEggItem && onDiscoverEasterEgg && (
            <BakersSecretEasterEgg
              egg={easterEggItem}
              isFound={Boolean(isEasterEggFound)}
              onDiscover={onDiscoverEasterEgg}
            />
          )}
        </div>

        <h2
          className={`mt-2.5 font-display font-semibold tracking-tight text-white video-heading-shadow leading-[1.12] [text-wrap:balance] ${
            beat.isPrologue
              ? 'text-2xl sm:text-3xl md:text-4xl'
              : 'text-xl sm:text-2xl md:text-3xl'
          }`}
        >
          {beat.title}
        </h2>

        <p
          className={`mt-2.5 text-xs sm:text-sm md:text-base leading-relaxed text-white font-normal video-text-shadow [text-wrap:pretty] ${
            beat.alignment === 'center' ? 'mx-auto max-w-md' : 'max-w-[46ch]'
          }`}
        >
          {beat.story}
        </p>

        <div
          className={`mt-3.5 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs text-amber-100 video-text-shadow ${
            beat.alignment === 'center' ? 'justify-center' : 'justify-start'
          }`}
        >
          {beat.details.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onOpenRecipeCard?.(item)}
              title={`Inspect ${item} Field Note & Trivia`}
              aria-label={`Open field note for ${item}`}
              className="group/tag inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 hover:border-amber-300/60 backdrop-blur-xs font-medium cursor-pointer transition-all duration-200 active:scale-95 video-text-shadow focus-visible:outline-2 focus-visible:outline-amber-200"
            >
              <span className="text-[9px] text-amber-300/80 group-hover/tag:text-amber-200 transition-colors">✦</span>
              <span>{item}</span>
            </button>
          ))}
        </div>

        {/* Stage 3: Miniature Cake Finisher Interactive Feature */}
        {beat.id === 'beat-stage-3' && onOpenCakeFinisher && (
          <div className="mt-4 flex items-center justify-start">
            <button
              type="button"
              onClick={onOpenCakeFinisher}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] text-xs font-semibold text-amber-100 bg-amber-500/25 hover:bg-amber-500/40 active:scale-95 border border-amber-300/45 hover:border-amber-200 rounded-full cursor-pointer video-text-shadow transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] focus-visible:outline-2 focus-visible:outline-amber-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>✦ Decorate Grand Hotel Cake ✦</span>
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <section
      id={beat.id}
      data-testid={`story-beat-${beat.id}`}
      data-active={isActive ? 'true' : 'false'}
      aria-label={beat.title}
      className={`absolute inset-x-0 bottom-0 pointer-events-none flex items-end px-4 sm:px-12 lg:px-20 pb-8 sm:pb-12 ${alignmentClasses}`}
    >
      <div className={`w-full ${maxWidthClass}`}>
        <div
          ref={(node) => {
            cardRef.current = node;
            onRegisterCard?.(beat.id, node);
          }}
          data-testid={`story-text-fade-${beat.id}`}
          style={{
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          className="w-full transform-gpu pointer-events-auto"
        >
          <article className={cardClassName}>
            {renderCardContent()}

            {beat.isPrologue && onStartJourney && (
              <div className="mt-4 flex justify-start">
                <button
                  type="button"
                  onClick={onStartJourney}
                  className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold text-white bg-amber-500/25 hover:bg-amber-500/40 active:scale-95 border border-amber-300/50 hover:border-amber-200 rounded-full cursor-pointer video-text-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                >
                  <span>Begin the Story</span>
                  <ArrowDown className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                </button>
              </div>
            )}

            {beat.isEpilogue && !isTheEnd && onReturnToTop && (
              <div className="mt-4 flex justify-start">
                <button
                  type="button"
                  onClick={onReturnToTop}
                  className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold text-white bg-black/40 hover:bg-black/60 active:scale-95 border border-white/45 hover:border-amber-200 rounded-full cursor-pointer video-text-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                >
                  <ArrowUp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Return to the Farm</span>
                </button>
              </div>
            )}
          </article>
        </div>
      </div>

      {beat.isPrologue && onStartJourney && (
        <div
          ref={(node) => {
            onRegisterScrollIndicator?.(node);
          }}
          style={{
            willChange: 'opacity',
          }}
          className="absolute bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)] sm:bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto"
        >
          <button
            type="button"
            onClick={onStartJourney}
            data-testid="landing-scroll-indicator"
            aria-label="Scroll down to begin the journey"
            className="group inline-flex flex-col items-center gap-0.5 min-h-[44px] px-4 py-1 text-white/85 hover:text-white active:scale-95 cursor-pointer video-text-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
          >
            <span className="text-[11px] sm:text-xs font-medium tracking-wider text-white/80 group-hover:text-white whitespace-nowrap">
              Scroll down
            </span>
            <span
              aria-hidden="true"
              className="inline-flex items-center justify-center"
            >
              <ChevronDown className="w-4 h-4 text-amber-100" />
            </span>
          </button>
        </div>
      )}
    </section>
  );
});
