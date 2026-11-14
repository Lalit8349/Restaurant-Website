import { useEffect, useRef } from 'react';
import { X, Sparkles, BookOpen, Compass, Flame } from 'lucide-react';
import { RecipeCardInfo } from '../utils/recipeCardsData';

interface RecipeCardModalProps {
  card: RecipeCardInfo | null;
  onClose: () => void;
}

export function RecipeCardModal({ card, onClose }: RecipeCardModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!card) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Prevent background scrolling while modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    // Focus the modal container for accessibility
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [card, onClose]);

  if (!card) return null;

  const getCategoryTheme = (cat: RecipeCardInfo['category']) => {
    switch (cat) {
      case 'Farm & Harvest':
        return {
          pill: 'bg-emerald-950/60 text-emerald-200 border-emerald-400/40',
          icon: Compass,
          accent: 'text-emerald-300',
        };
      case 'Mill & Hearth':
        return {
          pill: 'bg-amber-950/60 text-amber-200 border-amber-400/40',
          icon: Flame,
          accent: 'text-amber-300',
        };
      case 'Courier & Craft':
        return {
          pill: 'bg-sky-950/60 text-sky-200 border-sky-400/40',
          icon: BookOpen,
          accent: 'text-sky-300',
        };
      case 'Grand Service':
      default:
        return {
          pill: 'bg-amber-900/60 text-amber-100 border-amber-300/50',
          icon: Sparkles,
          accent: 'text-amber-200',
        };
    }
  };

  const theme = getCategoryTheme(card.category);
  const CategoryIcon = theme.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-card-title"
      data-testid="recipe-card-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-lg max-h-[92dvh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#1c1813] via-[#14120e] to-[#0d0c09] border border-amber-400/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(217,119,6,0.15)] p-4 sm:p-7 text-stone-200 focus:outline-none"
      >
        {/* Ornate corner filigree accents */}
        <span
          aria-hidden="true"
          className="absolute top-2.5 left-2.5 text-amber-400/30 text-xs select-none"
        >
          ╔
        </span>
        <span
          aria-hidden="true"
          className="absolute top-2.5 right-2.5 text-amber-400/30 text-xs select-none"
        >
          ╗
        </span>
        <span
          aria-hidden="true"
          className="absolute bottom-2.5 left-2.5 text-amber-400/30 text-xs select-none"
        >
          ╚
        </span>
        <span
          aria-hidden="true"
          className="absolute bottom-2.5 right-2.5 text-amber-400/30 text-xs select-none"
        >
          ╝
        </span>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close recipe archive card"
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white bg-stone-900/60 hover:bg-stone-800 border border-white/10 hover:border-amber-300/40 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Vintage Seal Header */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-[10px] sm:text-[11px] font-semibold text-amber-300 uppercase tracking-widest shadow-inner">
            <span>✦ Baker's Field Archive ✦</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${theme.pill}`}>
              <CategoryIcon className="w-3 h-3" />
              <span>{card.category}</span>
            </span>
            <span className="text-xs text-amber-200/60 font-serif italic">
              · {card.origin}
            </span>
          </div>

          <h3
            id="recipe-card-title"
            className="mt-3 font-display text-xl sm:text-2xl font-bold text-amber-100 tracking-tight"
          >
            {card.title}
          </h3>

          <div className="flex items-center justify-center gap-2 mt-1.5 text-amber-400/50">
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-[10px]">❖</span>
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
        </div>

        {/* Card Story */}
        <div className="mt-4 text-xs sm:text-sm text-stone-300 leading-relaxed font-sans [text-wrap:pretty]">
          <p>{card.story}</p>
        </div>

        {/* Baking Trivia & Technique Box */}
        <div className="mt-4 rounded-xl bg-gradient-to-br from-amber-950/40 to-stone-900/60 border border-amber-400/25 p-3.5 sm:p-4 shadow-inner">
          <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Master Baker's Secret</span>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-amber-100/90 leading-relaxed italic">
            "{card.bakingTrivia}"
          </p>
        </div>

        {/* Key Characteristics Tags */}
        <div className="mt-4">
          <h4 className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-2">
            Field Specifications
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {card.details.map((detail) => (
              <span
                key={detail}
                className="px-2.5 py-1 rounded-lg bg-stone-800/80 border border-amber-400/20 text-[11px] text-amber-200/90 font-mono"
              >
                {detail}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Dismiss Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-full text-xs sm:text-sm font-semibold text-stone-100 bg-amber-600/30 hover:bg-amber-600/50 active:scale-95 border border-amber-400/40 hover:border-amber-300 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-200"
          >
            Close Field Note
          </button>
        </div>
      </div>
    </div>
  );
}
