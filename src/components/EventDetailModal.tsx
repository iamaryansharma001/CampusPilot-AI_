import React from 'react';
import { CampusEvent } from '../data/campusData';

interface EventDetailModalProps {
  event: CampusEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToVenue: (locationId: string) => void;
  showToast: (msg: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onNavigateToVenue,
  showToast,
}) => {
  if (!isOpen || !event) return null;

  const handleExportCalendar = () => {
    const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CampusPilot AI//Event//EN\nBEGIN:VEVENT\nSUMMARY:${event.title}\nLOCATION:${event.locationName} (${event.roomOrHall})\nDESCRIPTION:${event.description}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Added ${event.title} to calendar (.ics)`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060e20]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#171f33] p-5 border border-white/[0.08] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#571bc1]/40 text-[#c4abff] text-[10px] font-mono font-bold uppercase tracking-wider">
              {event.categoryLabel}
            </span>
            {event.status === 'ongoing' && (
              <span className="px-2 py-0.5 rounded-full bg-[#4cd7f6]/20 text-[#4cd7f6] text-[10px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-ping" />
                LIVE TODAY
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#8c909f] hover:text-[#dae2fd] p-1"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-3.5 flex flex-col gap-3.5">
          <div>
            <h3 className="text-lg font-bold text-[#dae2fd] leading-tight">{event.title}</h3>
            <p className="text-xs text-[#4cd7f6] mt-1 font-mono">{event.tagline}</p>
          </div>

          {/* Schedule & Venue Card */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#131b2e] border border-white/[0.03]">
              <span className="text-[10px] text-[#8c909f] block mb-0.5">Date & Time</span>
              <span className="font-semibold text-[#dae2fd] block">{event.date}</span>
              <span className="text-[#4cd7f6] text-[11px]">{event.time}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#131b2e] border border-white/[0.03]">
              <span className="text-[10px] text-[#8c909f] block mb-0.5">Campus Venue</span>
              <span className="font-semibold text-[#dae2fd] block">{event.locationName}</span>
              <span className="text-[#adc6ff] text-[11px]">{event.roomOrHall}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="text-xs font-mono text-[#adc6ff] block mb-1">Overview</span>
            <p className="text-xs text-[#c2c6d6] leading-relaxed bg-[#060e20]/60 p-3 rounded-xl border border-white/[0.03]">
              {event.description}
            </p>
          </div>

          {/* Highlights */}
          <div>
            <span className="text-xs font-mono text-[#adc6ff] block mb-1.5">Event Highlights</span>
            <div className="flex flex-wrap gap-1.5">
              {event.highlights.map((hl, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-[#131b2e] text-[#dae2fd] text-xs font-mono border border-white/[0.04] flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#571bc1]" />
                  {hl}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
          <button
            onClick={handleExportCalendar}
            className="py-2 px-3 rounded-xl bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">
              calendar_add_on
            </span>
            <span>Add .ics</span>
          </button>

          <button
            onClick={() => {
              onNavigateToVenue(event.locationId);
              onClose();
            }}
            className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-[#4d8eff] to-[#4cd7f6] text-[#00285d] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">near_me</span>
            <span>Navigate to Venue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
