import React from 'react';
import { CAMPUS_LOCATIONS, CampusLocation } from '../data/campusData';

interface SavedLocationsViewProps {
  savedLocationIds: string[];
  onSelectLocation: (location: CampusLocation) => void;
  onStartRouteTo: (locationId: string) => void;
  onToggleBookmark: (locationId: string) => void;
  onExplorePlaces: () => void;
}

export const SavedLocationsView: React.FC<SavedLocationsViewProps> = ({
  savedLocationIds,
  onSelectLocation,
  onStartRouteTo,
  onToggleBookmark,
  onExplorePlaces,
}) => {
  const savedLocations = CAMPUS_LOCATIONS.filter((l) => savedLocationIds.includes(l.id));

  return (
    <div className="flex flex-col w-full gap-4 pb-24 select-none">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#dae2fd] tracking-tight">
              Saved Locations
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#4cd7f6]/15 text-[#4cd7f6] font-mono text-[10px] font-bold">
              {savedLocations.length} Saved
            </span>
          </div>
        </div>
        <p className="text-xs text-[#c2c6d6]">
          Your personal bookmarks for quick access to frequent classrooms, labs, and hangout spots.
        </p>
      </div>

      {/* Cards List */}
      <div className="flex flex-col gap-3">
        {savedLocations.map((loc) => (
          <div
            key={loc.id}
            onClick={() => onSelectLocation(loc)}
            className="relative overflow-hidden rounded-2xl bg-[#171f33]/80 hover:bg-[#222a3d] p-4 border border-white/[0.06] hover:border-white/[0.1] transition-all shadow-md cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#4cd7f6]/15 text-[#4cd7f6] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[20px]">
                    {loc.category === 'labs'
                      ? 'terminal'
                      : loc.category === 'academic'
                      ? 'school'
                      : loc.category === 'sports'
                      ? 'fitness_center'
                      : 'local_convenience_store'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-mono text-[#4cd7f6] uppercase font-semibold">
                    {loc.categoryLabel} • {loc.block}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#dae2fd] mt-0.5 group-hover:text-[#4cd7f6] transition-colors leading-snug">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-[#c2c6d6] mt-1 line-clamp-1 leading-relaxed">
                    {loc.description}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(loc.id);
                }}
                className="p-1.5 rounded-xl text-[#4cd7f6] bg-[#4cd7f6]/10 hover:bg-[#ffb4ab]/20 hover:text-[#ffb4ab] transition-colors shrink-0"
                title="Remove from saved"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">bookmark_remove</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-white/[0.04] text-xs font-mono">
              <span className="text-[#c2c6d6] text-[11px] truncate">
                Floor: {loc.floor}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLocation(loc);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] text-[11px] font-semibold"
                  type="button"
                >
                  Details
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartRouteTo(loc.id);
                  }}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#4d8eff] to-[#4cd7f6] text-[#00285d] font-bold text-[11px] flex items-center gap-1 shadow-md"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[13px]">navigation</span>
                  <span>Route</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {savedLocations.length === 0 && (
          <div className="py-14 text-center rounded-3xl bg-[#171f33]/40 border border-white/[0.04] p-6 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#222a3d] flex items-center justify-center text-[#adc6ff] mb-3">
              <span className="material-symbols-outlined text-[28px]">bookmark_border</span>
            </div>
            <h4 className="text-sm font-semibold text-[#dae2fd]">No Saved Places Yet</h4>
            <p className="text-xs text-[#c2c6d6] mt-1 max-w-xs leading-relaxed">
              Bookmark your frequent campus spots like Turing Lab 4, Cabin 214, or Central Library to access them instantly.
            </p>
            <button
              onClick={onExplorePlaces}
              className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-[#4d8eff] to-[#4cd7f6] text-[#00285d] font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
              type="button"
            >
              Explore Campus Directory
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
