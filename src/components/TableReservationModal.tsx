import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Clock, Check, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import {
  TABLE_MOODS,
  PRERESERVE_LOAVES,
  createReservationTicket,
  ReservationTicket,
} from '../utils/tableReservation';

interface TableReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableReservationModal: React.FC<TableReservationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('08:30 AM');
  const [selectedMood, setSelectedMood] = useState<'hearthside' | 'garden-window' | 'courtyard-terrace'>('hearthside');
  const [selectedLoaves, setSelectedLoaves] = useState<string[]>(['country-boule']);
  const [ticket, setTicket] = useState<ReservationTicket | null>(null);

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

  const toggleLoaf = (loafId: string) => {
    setSelectedLoaves((prev) =>
      prev.includes(loafId) ? prev.filter((id) => id !== loafId) : [...prev, loafId]
    );
  };

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    const createdTicket = createReservationTicket({
      name: name || 'Artisan Guest',
      email: '',
      partySize,
      date,
      timeSlot,
      moodId: selectedMood,
      reservedLoafIds: selectedLoaves,
    });
    setTicket(createdTicket);
  };

  const handleReset = () => {
    setTicket(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Reserve a Hearth Table"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92dvh] overflow-y-auto rounded-2xl bg-[#161719] border-2 border-[#d4af37]/40 shadow-2xl p-4 sm:p-8 text-[#f7f3e8]"
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
          aria-label="Close Reservation"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-5 border-b border-[#d4af37]/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs uppercase tracking-widest font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Hearth Guestbook
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif tracking-wide text-[#f7f3e8]">
            Reserve a Hearth Table
          </h2>
          <p className="text-xs sm:text-sm text-[#d4af37]/80 mt-1 font-serif italic">
            Book your morning hearth seating and reserve freshly pulled stone-oven loaves.
          </p>
        </div>

        {ticket ? (
          /* Generated Vintage Ticket View */
          <div className="mt-6 animate-fadeIn">
            <div className="relative p-6 sm:p-8 rounded-2xl bg-[#f5ede0] text-[#2b2118] border-4 border-dashed border-[#b38f4d] shadow-2xl overflow-hidden">
              {/* Perforated ticket edges effect */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#161719]" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#161719]" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-[#b38f4d]/40 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8a6829] font-bold">
                    Official Hearth Pass
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#3d2915]">
                    Golden Grain Bakery
                  </h3>
                  <p className="text-xs font-serif text-[#66523d] italic">Hearth Table & Loaf Voucher</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-[#b38f4d]/20 text-[#684b1d] border border-[#b38f4d]/40">
                    {ticket.ticketNumber}
                  </span>
                  <span className="text-[10px] text-[#8a6829] block mt-1 font-mono">
                    Issued: {ticket.issuedAt}
                  </span>
                </div>
              </div>

              {/* Ticket details */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-serif">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#8a6829] block">Guest</span>
                  <p className="font-bold text-sm text-[#2b2118]">{ticket.guestName}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#8a6829] block">Party Size</span>
                  <p className="font-bold text-sm text-[#2b2118]">{ticket.partySize} Guests</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#8a6829] block">Seating Date</span>
                  <p className="font-bold text-sm text-[#2b2118]">{ticket.date} @ {ticket.timeSlot}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#b38f4d]/30">
                <span className="text-[10px] uppercase font-mono text-[#8a6829] block">Reserved Atmosphere</span>
                <p className="font-bold text-[#3d2915] text-sm">{ticket.moodName}</p>
              </div>

              {ticket.reservedLoaves.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#b38f4d]/30">
                  <span className="text-[10px] uppercase font-mono text-[#8a6829] block mb-1">
                    Pre-Reserved Hearth Loaves
                  </span>
                  <ul className="space-y-1">
                    {ticket.reservedLoaves.map((loaf, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-xs text-[#4a3928] font-medium">
                        <Check className="w-3.5 h-3.5 text-[#8a6829]" />
                        {loaf}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Golden Wax Seal Stamp */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t-2 border-[#b38f4d]/40">
                <div className="text-[10px] font-mono text-[#8a6829]">
                  Show this digital voucher at the front host counter.
                </div>
                {/* Embossed Wax Seal */}
                <div
                  className="w-16 h-16 rounded-full flex flex-col items-center justify-center text-center shadow-lg border-2 border-amber-300 transform -rotate-12 select-none"
                  style={{
                    background: 'radial-gradient(circle, #f3c258 0%, #c48b26 70%, #875412 100%)',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-950 mb-0.5" />
                  <span className="text-[7px] uppercase font-bold tracking-tighter text-amber-950 leading-none">
                    SEALED
                  </span>
                  <span className="text-[6px] uppercase font-serif text-amber-950 leading-none">
                    HEARTH
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors"
              >
                Book Another Table
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-amber-400 text-black font-semibold text-xs font-serif shadow-md transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Reservation Form View */
          <form onSubmit={handleReserve} className="mt-6 space-y-5">
            {/* Guest Name & Party Size */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marguerite Dubois"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  <Users className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                  Party Size
                </label>
                <select
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:border-[#d4af37]"
                >
                  {[1, 2, 3, 4, 5, 6, 8].map((size) => (
                    <option key={size} value={size}>
                      {size} {size === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  <Calendar className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                  Morning Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  <Clock className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                  Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:border-[#d4af37]"
                >
                  {['07:30 AM', '08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM'].map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table Mood Picker */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Select Table Mood & Atmosphere
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TABLE_MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setSelectedMood(mood.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedMood === mood.id
                        ? 'bg-[#d4af37]/15 border-[#d4af37] shadow-lg shadow-[#d4af37]/10'
                        : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{mood.icon}</span>
                    <h4 className="text-sm font-semibold text-zinc-100">{mood.name}</h4>
                    <span className="text-[10px] text-amber-400 font-mono block mt-0.5">{mood.tagline}</span>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-snug">{mood.atmosphere}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Pre-reserve loaves */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Pre-Reserve Freshly Baked Hearth Loaves (Optional)
              </label>
              <div className="space-y-2">
                {PRERESERVE_LOAVES.map((loaf) => {
                  const isChecked = selectedLoaves.includes(loaf.id);
                  return (
                    <div
                      key={loaf.id}
                      onClick={() => toggleLoaf(loaf.id)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-[#d4af37]/10 border-[#d4af37]/60'
                          : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-[#d4af37] border-[#d4af37] text-black'
                              : 'border-zinc-600 bg-zinc-800'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-zinc-200">{loaf.name}</p>
                          <span className="text-[10px] text-zinc-500 font-mono">{loaf.limitText}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#d4af37]">{loaf.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-600 text-black font-serif font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all shadow-lg shadow-amber-600/20"
              >
                <span>Reserve Table & Issue Wax Sealed Voucher</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
