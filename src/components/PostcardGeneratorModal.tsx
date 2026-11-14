import React, { useState, useEffect } from 'react';
import { X, Send, Copy, Check, Sparkles, Heart } from 'lucide-react';
import {
  POSTCARD_TEMPLATES,
  WAX_SEALS,
  PRESET_MESSAGES,
  encodePostcardShareLink,
} from '../utils/postcardGenerator';

interface PostcardGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostcardGeneratorModal: React.FC<PostcardGeneratorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [recipient, setRecipient] = useState('My Dearest Friend');
  const [sender, setSender] = useState('With Warmth');
  const [message, setMessage] = useState(PRESET_MESSAGES[0]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(POSTCARD_TEMPLATES[0].id);
  const [selectedSealId, setSelectedSealId] = useState(WAX_SEALS[0].id);
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

  const template =
    POSTCARD_TEMPLATES.find((t) => t.id === selectedTemplateId) || POSTCARD_TEMPLATES[0];
  const waxSeal = WAX_SEALS.find((s) => s.id === selectedSealId) || WAX_SEALS[0];

  const handleCopyLink = async () => {
    const link = encodePostcardShareLink({
      recipientName: recipient,
      senderName: sender,
      message,
      templateId: selectedTemplateId,
      waxSealId: selectedSealId,
    });

    try {
      await navigator.clipboard.writeText(link);
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
      aria-label="Send a Fresh Loaf Virtual Postcard"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92dvh] overflow-y-auto rounded-2xl bg-[#161719] border-2 border-[#d4af37]/40 shadow-2xl p-4 sm:p-8 text-[#f7f3e8]"
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
          aria-label="Close Postcard Generator"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pb-5 border-b border-[#d4af37]/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs uppercase tracking-widest font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            Shareable Bakery Gift
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif tracking-wide text-[#f7f3e8]">
            "Send a Fresh Loaf" Postcard
          </h2>
          <p className="text-xs sm:text-sm text-[#d4af37]/80 mt-1 font-serif italic">
            Customize an illustrated vintage postcard with custom wax seal to send to someone special.
          </p>
        </div>

        {/* Main Layout: Preview on Top/Left, Form Controls on Right/Bottom */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Postcard Vintage Preview */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full relative rounded-2xl bg-[#f7eedf] text-[#2b2118] border-4 border-[#bda06f] p-6 shadow-2xl overflow-hidden min-h-[320px] flex flex-col justify-between">
              {/* Subtle Aged Parchment Texture & Stamp in top-right */}
              <div className="flex items-start justify-between border-b-2 border-[#bda06f]/40 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#826430] font-bold block">
                    Carte Postale · Golden Grain Bakery
                  </span>
                  <span className="text-xs font-serif italic text-[#574320]">
                    {template.subtitle}
                  </span>
                </div>

                {/* Postage Stamp & Cancellation Marks */}
                <div className="flex items-center gap-2 select-none">
                  {/* Cancellation wave lines */}
                  <div className="hidden sm:flex flex-col gap-1 opacity-40">
                    <div className="w-10 h-0.5 bg-[#422d14]" />
                    <div className="w-12 h-0.5 bg-[#422d14]" />
                    <div className="w-10 h-0.5 bg-[#422d14]" />
                  </div>
                  {/* Vintage stamp */}
                  <div className="w-12 h-14 rounded border-2 border-dashed border-[#826430] bg-[#e8dac0] flex flex-col items-center justify-center text-center p-1 shadow-inner">
                    <span className="text-lg leading-none">{template.cardImagePlaceholder}</span>
                    <span className="text-[7px] uppercase font-mono font-bold text-[#574320] mt-1">
                      15¢
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="my-5 space-y-3 font-serif">
                <p className="text-xs text-[#826430] uppercase font-mono font-bold tracking-wider">
                  To: <span className="text-[#3b2b18] text-sm capitalize">{recipient}</span>
                </p>
                <p className="text-sm sm:text-base leading-relaxed text-[#2c1d0c] italic font-serif min-h-[60px]">
                  "{message}"
                </p>
                <p className="text-xs text-right text-[#826430] font-mono uppercase">
                  From: <span className="text-[#3b2b18] text-sm font-serif italic">{sender}</span>
                </p>
              </div>

              {/* Bottom bar with Wax Seal Stamp */}
              <div className="pt-3 border-t-2 border-[#bda06f]/40 flex items-end justify-between">
                <span className="text-[10px] font-mono text-[#8a7047] uppercase">
                  Stone Oven Sealed · Est. 1924
                </span>

                {/* Wax Seal Stamp */}
                <div
                  className="w-16 h-16 rounded-full flex flex-col items-center justify-center text-center shadow-xl border-2 transform -rotate-6 select-none shrink-0"
                  style={{
                    backgroundColor: waxSeal.hex,
                    borderColor: waxSeal.borderHex,
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 mb-0.5" />
                  <span className="text-[7px] uppercase font-bold tracking-tighter text-amber-100 leading-none">
                    {waxSeal.stampText}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="mt-4 flex gap-3 w-full">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2.5 rounded-xl bg-[#d4af37] hover:bg-amber-400 text-black font-semibold text-xs font-serif flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    Share Link Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-black" />
                    Copy Postcard Share Link
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Options on Right */}
          <div className="lg:col-span-5 space-y-4">
            {/* Template Selector */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                1. Postcard Illustration
              </label>
              <div className="grid grid-cols-2 gap-2">
                {POSTCARD_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                      selectedTemplateId === tpl.id
                        ? 'bg-[#d4af37]/20 border-[#d4af37] shadow'
                        : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-xl">{tpl.cardImagePlaceholder}</span>
                    <span className="text-xs font-medium text-zinc-200 truncate">{tpl.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wax Seal Selector */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                2. Artisan Wax Seal
              </label>
              <div className="grid grid-cols-4 gap-2">
                {WAX_SEALS.map((seal) => (
                  <button
                    key={seal.id}
                    onClick={() => setSelectedSealId(seal.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      selectedSealId === seal.id
                        ? 'bg-[#d4af37]/20 border-[#d4af37]'
                        : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-white/30 shadow-inner"
                      style={{ backgroundColor: seal.hex }}
                    />
                    <span className="text-[10px] text-zinc-300 font-mono truncate w-full text-center">
                      {seal.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Names Input */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Recipient (To)
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Sender (From)
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* Message input */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Personalized Message
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:outline-none focus:border-[#d4af37]"
              />

              {/* Preset message quick suggestions */}
              <div className="mt-2 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">
                  Quick Message Inspiration:
                </span>
                <div className="flex flex-col gap-1">
                  {PRESET_MESSAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMessage(preset)}
                      className="text-left text-[11px] text-[#d4af37]/80 hover:text-[#d4af37] truncate hover:underline"
                    >
                      • {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
