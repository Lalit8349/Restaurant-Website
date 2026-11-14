import { useEffect, useRef, useState } from 'react';
import { X, RotateCcw, Undo2, Sparkles, Check, Cake, Utensils } from 'lucide-react';
import {
  DEFAULT_STARTER_DECORATIONS,
  PlacedDecoration,
  TOPPING_OPTIONS,
  ToppingType,
  clampToCakeSurface,
  isWithinCakeSurface,
} from '../utils/cakeFinisherConfig';

interface CakeFinisherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CakeFinisherModal({ isOpen, onClose }: CakeFinisherModalProps) {
  const [decorations, setDecorations] = useState<PlacedDecoration[]>(
    DEFAULT_STARTER_DECORATIONS
  );
  const [selectedTopping, setSelectedTopping] = useState<ToppingType>('rosette');
  const [presented, setPresented] = useState(false);
  const cakeSurfaceRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

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

  const handlePlaceAtCoordinates = (clientX: number, clientY: number, toppingType: ToppingType) => {
    if (!cakeSurfaceRef.current) return;
    const rect = cakeSurfaceRef.current.getBoundingClientRect();
    const rawX = ((clientX - rect.left) / rect.width) * 100;
    const rawY = ((clientY - rect.top) / rect.height) * 100;

    const { x, y } = clampToCakeSurface(rawX, rawY);
    const rotation = Math.round((Math.random() - 0.5) * 40);

    const newDeco: PlacedDecoration = {
      id: `deco-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: toppingType,
      x,
      y,
      rotation,
    };

    setDecorations((prev) => [...prev, newDeco]);
    setPresented(false);
  };

  const handleCakeSurfaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePlaceAtCoordinates(e.clientX, e.clientY, selectedTopping);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedType = e.dataTransfer.getData('text/plain') as ToppingType;
    if (droppedType) {
      handlePlaceAtCoordinates(e.clientX, e.clientY, droppedType);
    }
  };

  const handleUndo = () => {
    setDecorations((prev) => prev.slice(0, -1));
    setPresented(false);
  };

  const handleClear = () => {
    setDecorations([]);
    setPresented(false);
  };

  const handleReset = () => {
    setDecorations(DEFAULT_STARTER_DECORATIONS);
    setPresented(false);
  };

  const handlePresent = () => {
    setPresented(true);
  };

  const getToppingEmoji = (type: ToppingType) => {
    const opt = TOPPING_OPTIONS.find((t) => t.type === type);
    return opt?.emoji || '✦';
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cake-finisher-title"
      data-testid="cake-finisher-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-2xl max-h-[92dvh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#1e1913] via-[#15120e] to-[#0c0a08] border border-amber-400/40 p-3.5 sm:p-7 text-stone-200 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(217,119,6,0.25)] focus:outline-none"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close cake finisher atelier"
          className="absolute top-3.5 right-3.5 p-2 rounded-full text-stone-400 hover:text-white bg-stone-900/60 hover:bg-stone-800 border border-white/10 hover:border-amber-300/40 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/35 text-[11px] font-semibold text-amber-300 uppercase tracking-widest shadow-inner">
            <Cake className="w-3.5 h-3.5 text-amber-300" />
            <span>Grand Hotel Pastry Bench</span>
          </div>

          <h3
            id="cake-finisher-title"
            className="mt-2.5 font-display text-xl sm:text-2xl md:text-3xl font-bold text-amber-100"
          >
            Miniature Cake Finisher
          </h3>

          <p className="mt-1 text-xs sm:text-sm text-stone-300 max-w-md">
            Drag fresh garnishes or select a topping and click directly on the sponge cake top surface before afternoon service.
          </p>
        </div>

        {/* Celebration Banner when Presented */}
        {presented && (
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/25 via-amber-400/30 to-amber-500/25 border border-amber-300/60 text-center animate-in zoom-in-95 duration-200 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-amber-100">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>✦ Plated to Perfection for Table 12! ✦</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            </div>
            <p className="mt-1 text-[11px] text-amber-200/90">
              The Grand Hotel Maitre d’ compliments your artisanal handiwork.
            </p>
          </div>
        )}

        {/* Interactive Cake Pedestal & Platter Area */}
        <div className="mt-5 flex flex-col items-center justify-center select-none">
          <div className="relative w-56 h-56 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* Silver Pedestal Stand Rim */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-stone-500 via-stone-300 to-stone-400 border-4 border-stone-200/50 shadow-[0_15px_35px_rgba(0,0,0,0.7)]" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-b from-[#2b2724] to-[#161412] border border-amber-400/25" />

            {/* Base Sponge Cake Tier */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-b from-[#d97706] to-[#92400e] border-2 border-amber-600 shadow-inner" />

            {/* Velvety Vanilla Glaze Top Tier (Active Surface) */}
            <div
              ref={cakeSurfaceRef}
              onClick={handleCakeSurfaceClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              title="Click or drop toppings here to decorate!"
              className="absolute inset-10 rounded-full bg-gradient-to-b from-[#fffbeb] via-[#fef3c7] to-[#fde68a] border-4 border-[#f59e0b] shadow-[inset_0_4px_12px_rgba(0,0,0,0.15)] cursor-crosshair overflow-hidden"
            >
              {/* Subtle cake surface texture */}
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

              {/* Placed Decorations */}
              {decorations.map((deco) => (
                <div
                  key={deco.id}
                  style={{
                    left: `${deco.x}%`,
                    top: `${deco.y}%`,
                    transform: `translate(-50%, -50%) rotate(${deco.rotation}deg)`,
                  }}
                  className="absolute pointer-events-none transition-transform duration-150 animate-in zoom-in-75"
                >
                  <span className="text-2xl sm:text-3xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                    {getToppingEmoji(deco.type)}
                  </span>
                </div>
              ))}
            </div>

            {/* Floating Hint Pill */}
            <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-black/75 border border-amber-400/40 text-[10px] text-amber-200/90 tracking-wide font-medium backdrop-blur-xs pointer-events-none">
              {decorations.length} Garnishes Placed
            </div>
          </div>
        </div>

        {/* Topping Palette (Garnishes Shelf) */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-amber-200/70 font-semibold">
              Select Garnish (Drag or Tap to Place)
            </span>
            <span className="text-[11px] text-stone-400">
              Active:{' '}
              <span className="text-amber-200 font-medium">
                {TOPPING_OPTIONS.find((t) => t.type === selectedTopping)?.name}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {TOPPING_OPTIONS.map((opt) => {
              const isSelected = selectedTopping === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', opt.type);
                    setSelectedTopping(opt.type);
                  }}
                  onClick={() => setSelectedTopping(opt.type)}
                  className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-amber-500/25 border-amber-400 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                      : 'bg-black/40 hover:bg-black/60 border-white/10 hover:border-amber-400/40 text-stone-300'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl filter drop-shadow">
                    {opt.emoji}
                  </span>
                  <span className="mt-1 text-[10px] font-medium text-center truncate max-w-full">
                    {opt.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div className="mt-6 pt-4 border-t border-amber-400/20 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUndo}
              disabled={decorations.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 text-xs text-stone-200 transition-colors cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={decorations.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 text-xs text-stone-200 transition-colors cursor-pointer"
            >
              <span>Clear</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 border border-white/10 text-xs text-stone-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePresent}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Present to Table</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
