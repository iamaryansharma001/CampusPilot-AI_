import React from 'react';
import { CampusLocation } from '../data/campusData';

interface LocationDetailModalProps {
  location: CampusLocation | null;
  isOpen: boolean;
  onClose: () => void;
  onStartRoute: (locationId: string) => void;
  isSaved: boolean;
  onToggleBookmark: (locationId: string) => void;
}

export const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  location,
  isOpen,
  onClose,
  onStartRoute,
  isSaved,
  onToggleBookmark,
}) => {
  if (!isOpen || !location) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060e20]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#171f33] p-5 border border-white/[0.08] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4cd7f6]/15 text-[#4cd7f6] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">
                {location.category === 'labs'
                  ? 'terminal'
                  : location.category === 'academic'
                  ? 'school'
                  : location.category === 'sports'
                  ? 'fitness_center'
                  : location.category === 'student-services'
                  ? 'account_balance'
                  : 'local_convenience_store'}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono text-[#4cd7f6] uppercase tracking-wider font-semibold">
                {location.categoryLabel}
              </span>
              <h3 className="text-base font-bold text-[#dae2fd] leading-tight truncate">
                {location.name}
              </h3>
            </div>
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
          {/* Coordinates & Block Info */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#131b2e] border border-white/[0.03]">
              <span className="text-[10px] text-[#8c909f] block mb-0.5">Campus Block</span>
              <span className="font-semibold text-[#dae2fd]">{location.block}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#131b2e] border border-white/[0.03]">
              <span className="text-[10px] text-[#8c909f] block mb-0.5">Floor / Wing</span>
              <span className="font-semibold text-[#dae2fd]">{location.floor}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="text-xs font-mono text-[#adc6ff] block mb-1">About this Facility</span>
            <p className="text-xs text-[#c2c6d6] leading-relaxed bg-[#060e20]/60 p-3 rounded-xl border border-white/[0.03]">
              {location.description}
            </p>
          </div>

          {/* Facilities List */}
          <div>
            <span className="text-xs font-mono text-[#adc6ff] block mb-1.5">
              Available Facilities & Rooms
            </span>
            <div className="flex flex-wrap gap-1.5">
              {location.facilities.map((fac, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-[#131b2e] text-[#dae2fd] text-xs font-mono border border-white/[0.04] flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]" />
                  {fac}
                </span>
              ))}
            </div>
          </div>

          {/* Open Hours & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#131b2e] border border-white/[0.03] flex flex-col">
              <span className="text-[10px] text-[#8c909f] block mb-0.5">Operational Hours</span>
              <span className="text-[#4cd7f6]">{location.openHours}</span>
            </div>
            {location.contact && (
              <div className="p-3 rounded-xl bg-[#131b2e] border border-white/[0.03] flex flex-col">
                <span className="text-[10px] text-[#8c909f] block mb-0.5">Point of Contact</span>
                <span className="text-[#dae2fd]">{location.contact}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
          <button
            onClick={() => onToggleBookmark(location.id)}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              isSaved
                ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border border-[#4cd7f6]/40'
                : 'bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isSaved ? 'bookmark_added' : 'bookmark_border'}
            </span>
            <span>{isSaved ? 'Saved' : 'Bookmark'}</span>
          </button>

          <button
            onClick={() => {
              onStartRoute(location.id);
              onClose();
            }}
            className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-[#4d8eff] to-[#4cd7f6] text-[#00285d] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">navigation</span>
            <span>Get Walking Directions</span>
          </button>
        </div>
      </div>
    </div>
  );
};
