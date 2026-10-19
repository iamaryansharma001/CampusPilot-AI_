import React, { useState } from 'react';
import { CAMPUS_LOCATIONS, CampusLocation } from '../data/campusData';

interface DepartmentsViewProps {
  onSelectLocation: (location: CampusLocation) => void;
  onStartRouteTo: (locationId: string) => void;
  savedLocationIds: string[];
  onToggleBookmark: (locationId: string) => void;
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({
  onSelectLocation,
  onStartRouteTo,
  savedLocationIds,
  onToggleBookmark,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterQuery, setFilterQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Places' },
    { id: 'academic', label: 'Academic Blocks' },
    { id: 'labs', label: 'Labs & Tech' },
    { id: 'amenities', label: 'Amenities & Food' },
    { id: 'student-services', label: 'Student Services' },
    { id: 'sports', label: 'Sports & SAC' },
  ];

  const filteredLocations = CAMPUS_LOCATIONS.filter((loc) => {
    const matchesCat = selectedCategory === 'all' || loc.category === selectedCategory;
    const matchesQuery =
      filterQuery.trim() === '' ||
      loc.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      loc.block.toLowerCase().includes(filterQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
      loc.facilities.some((f) => f.toLowerCase().includes(filterQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="flex flex-col w-full gap-4 pb-24 select-none">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#dae2fd] tracking-tight">
              Departments & Facilities
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#4cd7f6]/15 text-[#4cd7f6] font-mono text-[10px] font-bold">
              {filteredLocations.length} Locations
            </span>
          </div>
        </div>
        <p className="text-xs text-[#c2c6d6]">
          Directory of academic blocks, high-tech computer labs, dining hubs, and administrative desks.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative w-full rounded-2xl bg-[#131b2e] px-3.5 py-2.5 flex items-center gap-2.5 border border-white/[0.06] shadow-inner focus-within:border-[#4cd7f6] transition-all">
        <span className="material-symbols-outlined text-[#8c909f] text-[18px]">search</span>
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter by building name, room, lab code, or facility..."
          className="w-full bg-transparent text-xs sm:text-sm text-[#dae2fd] placeholder:text-[#8c909f] focus:outline-none"
        />
        {filterQuery && (
          <button
            onClick={() => setFilterQuery('')}
            className="text-[#8c909f] hover:text-[#dae2fd] p-1"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Category Pills Scroller */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full font-mono text-xs whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#4cd7f6] text-[#002f38] font-bold shadow-[0_0_12px_rgba(76,215,246,0.3)]'
                : 'bg-[#171f33] text-[#c2c6d6] hover:text-[#dae2fd] border border-white/[0.04]'
            }`}
            type="button"
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Locations Cards List */}
      <div className="flex flex-col gap-3">
        {filteredLocations.map((loc) => {
          const isSaved = savedLocationIds.includes(loc.id);

          return (
            <div
              key={loc.id}
              onClick={() => onSelectLocation(loc)}
              className="relative overflow-hidden rounded-2xl bg-[#171f33]/80 hover:bg-[#222a3d] p-4 border border-white/[0.06] hover:border-white/[0.1] transition-all shadow-md cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#4cd7f6]/10 text-[#4cd7f6] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">
                      {loc.category === 'labs'
                        ? 'terminal'
                        : loc.category === 'academic'
                        ? 'school'
                        : loc.category === 'sports'
                        ? 'fitness_center'
                        : loc.category === 'student-services'
                        ? 'account_balance'
                        : 'local_convenience_store'}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#060e20] text-[#4cd7f6] font-semibold uppercase">
                        {loc.categoryLabel}
                      </span>
                      <span className="text-[11px] font-mono text-[#c2c6d6] truncate">
                        {loc.block}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#dae2fd] mt-1 group-hover:text-[#4cd7f6] transition-colors leading-snug">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-[#c2c6d6] mt-1 line-clamp-2 leading-relaxed">
                      {loc.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(loc.id);
                  }}
                  className={`p-1.5 rounded-xl transition-colors shrink-0 ${
                    isSaved ? 'text-[#4cd7f6] bg-[#4cd7f6]/10' : 'text-[#8c909f] hover:text-[#dae2fd]'
                  }`}
                  title={isSaved ? 'Remove bookmark' : 'Bookmark location'}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isSaved ? 'bookmark_added' : 'bookmark_border'}
                  </span>
                </button>
              </div>

              {/* Facilities Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-white/[0.04]">
                {loc.facilities.slice(0, 3).map((fac, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg bg-[#060e20] text-[#c2c6d6] text-[10px] font-mono"
                  >
                    {fac}
                  </span>
                ))}
                {loc.facilities.length > 3 && (
                  <span className="text-[10px] font-mono text-[#8c909f]">
                    +{loc.facilities.length - 3} more
                  </span>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between gap-2 mt-3 pt-2 text-xs font-mono">
                <span className="text-[11px] text-[#4cd7f6] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {loc.openHours.split('|')[0]}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLocation(loc);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] text-[11px] font-semibold active:scale-95 transition-all"
                    type="button"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartRouteTo(loc.id);
                    }}
                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#4d8eff] to-[#4cd7f6] text-[#00285d] font-bold text-[11px] flex items-center gap-1 shadow-md active:scale-95 transition-all"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[13px]">navigation</span>
                    <span>Navigate</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredLocations.length === 0 && (
          <div className="py-12 text-center rounded-2xl bg-[#171f33]/40 border border-white/[0.04] p-4">
            <span className="material-symbols-outlined text-[#8c909f] text-[32px] mb-2">
              domain_disabled
            </span>
            <h4 className="text-sm font-semibold text-[#dae2fd]">No Locations Found</h4>
            <p className="text-xs text-[#c2c6d6] mt-1">
              Try searching a different term or resetting the category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
