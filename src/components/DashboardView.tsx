import React, { useState } from 'react';
import { CAMPUS_EVENTS, CAMPUS_LOCATIONS, CampusEvent, CampusLocation } from '../data/campusData';

interface DashboardViewProps {
  onNavigateToTab: (tab: 'dashboard' | 'map' | 'departments' | 'events' | 'assistant' | 'saved') => void;
  onSelectLocation: (location: CampusLocation) => void;
  onSelectEvent: (event: CampusEvent) => void;
  onStartRouteTo: (locationId: string) => void;
  savedLocationIds: string[];
  onToggleBookmark: (locationId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToTab,
  onSelectLocation,
  onSelectEvent,
  onStartRouteTo,
  savedLocationIds,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter locations & events by query
  const matchingLocations = searchQuery.trim()
    ? CAMPUS_LOCATIONS.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.facilities.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const matchingEvents = searchQuery.trim()
    ? CAMPUS_EVENTS.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const featuredEvent = CAMPUS_EVENTS[0]; // GitHub Copilot Dev Days

  return (
    <div className="flex flex-col w-full gap-5 pb-24 select-none">
      {/* Student Welcome Banner (Liquid Glass Card) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#171f33]/90 via-[#131b2e]/80 to-[#060e20]/90 backdrop-blur-2xl p-5 border border-white/[0.08] shadow-2xl">
        <div className="absolute top-0 right-0 w-52 h-52 bg-gradient-to-bl from-[#4d8eff]/15 via-[#4cd7f6]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#4cd7f6] uppercase tracking-wider font-semibold">
                Welcome back
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#4cd7f6]/20 text-[#4cd7f6] text-[9px] font-mono font-bold">
                ONLINE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#dae2fd] tracking-tight mt-0.5">
              Aryan Sharma
            </h2>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs font-mono text-[#c2c6d6]">
              <span>Roll: CSAIML-061</span>
              <span>•</span>
              <span className="text-[#adc6ff]">Adm: 26GCEBCSAIML072</span>
            </div>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#adc6ff] to-[#4d8eff] p-[1px] flex items-center justify-center shrink-0 shadow-lg">
            <div className="w-full h-full bg-[#060e20] rounded-[15px] flex items-center justify-center text-[#adc6ff] font-bold text-sm font-mono">
              AS
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="mt-4 relative w-full rounded-2xl bg-[#060e20]/80 px-3.5 py-2.5 flex items-center gap-2.5 border border-white/[0.08] shadow-inner focus-within:border-[#4cd7f6] transition-all">
          <span className="material-symbols-outlined text-[#8c909f] text-[20px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campus halls, labs, faculty cabins, or fests..."
            className="w-full bg-transparent text-xs sm:text-sm text-[#dae2fd] placeholder:text-[#8c909f] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#8c909f] hover:text-[#dae2fd] p-1"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Search Results Overlay (If user is typing) */}
      {searchQuery.trim() && (
        <div className="flex flex-col gap-2 rounded-2xl bg-[#171f33] p-4 border border-[#4cd7f6]/30 shadow-2xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <span className="text-xs font-mono text-[#4cd7f6] font-semibold">
              Search Results ({matchingLocations.length + matchingEvents.length})
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[11px] font-mono text-[#c2c6d6] hover:underline"
              type="button"
            >
              Close Results
            </button>
          </div>

          {matchingLocations.length === 0 && matchingEvents.length === 0 && (
            <div className="py-6 text-center text-xs text-[#c2c6d6]">
              No places or events found for "{searchQuery}". Try searching "Turing", "Library", or "Dev Days".
            </div>
          )}

          {matchingLocations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => {
                onSelectLocation(loc);
                setSearchQuery('');
              }}
              className="p-3 rounded-xl bg-[#131b2e] hover:bg-[#222a3d] flex items-center justify-between gap-3 cursor-pointer transition-all border border-white/[0.03]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#4cd7f6]/15 text-[#4cd7f6] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[#dae2fd] truncate">{loc.name}</span>
                  <span className="text-[10px] font-mono text-[#c2c6d6] truncate">
                    {loc.block} • {loc.floor}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartRouteTo(loc.id);
                  setSearchQuery('');
                }}
                className="px-2.5 py-1 rounded-lg bg-[#4d8eff]/20 hover:bg-[#4d8eff]/30 text-[#adc6ff] text-[10px] font-mono font-semibold"
                type="button"
              >
                Directions
              </button>
            </div>
          ))}

          {matchingEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => {
                onSelectEvent(evt);
                setSearchQuery('');
              }}
              className="p-3 rounded-xl bg-[#131b2e] hover:bg-[#222a3d] flex items-center justify-between gap-3 cursor-pointer transition-all border border-white/[0.03]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#d0bcff]/15 text-[#d0bcff] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">event</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[#dae2fd] truncate">{evt.title}</span>
                  <span className="text-[10px] font-mono text-[#c2c6d6] truncate">
                    {evt.date} • {evt.roomOrHall}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#571bc1]/30 text-[#c4abff]">
                Event
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Four Principal Feature Cards (Section 4.B) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Find Departments */}
        <button
          onClick={() => onNavigateToTab('departments')}
          className="group relative overflow-hidden rounded-2xl bg-[#171f33]/80 hover:bg-[#222a3d]/90 p-4 border border-white/[0.06] hover:border-[#4cd7f6]/30 text-left transition-all active:scale-[0.98] shadow-lg cursor-pointer flex flex-col justify-between min-h-[120px]"
          type="button"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#4cd7f6]/15 text-[#4cd7f6] flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(76,215,246,0.2)]">
              <span className="material-symbols-outlined text-[22px]">domain</span>
            </div>
            <span className="material-symbols-outlined text-[#8c909f] group-hover:text-[#dae2fd] text-[18px] transition-colors">
              arrow_forward
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-sm font-bold text-[#dae2fd]">Find Departments</h3>
            <p className="text-[11px] text-[#c2c6d6] mt-0.5">Academic wings, labs & faculty cabins</p>
          </div>
        </button>

        {/* Card 2: Get Directions */}
        <button
          onClick={() => onNavigateToTab('map')}
          className="group relative overflow-hidden rounded-2xl bg-[#171f33]/80 hover:bg-[#222a3d]/90 p-4 border border-white/[0.06] hover:border-[#4d8eff]/30 text-left transition-all active:scale-[0.98] shadow-lg cursor-pointer flex flex-col justify-between min-h-[120px]"
          type="button"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#4d8eff]/15 text-[#adc6ff] flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(77,142,255,0.2)]">
              <span className="material-symbols-outlined text-[22px]">explore</span>
            </div>
            <span className="material-symbols-outlined text-[#8c909f] group-hover:text-[#dae2fd] text-[18px] transition-colors">
              arrow_forward
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-sm font-bold text-[#dae2fd]">Get Directions</h3>
            <p className="text-[11px] text-[#c2c6d6] mt-0.5">Interactive walking path & ETA</p>
          </div>
        </button>

        {/* Card 3: College Events */}
        <button
          onClick={() => onNavigateToTab('events')}
          className="group relative overflow-hidden rounded-2xl bg-[#171f33]/80 hover:bg-[#222a3d]/90 p-4 border border-white/[0.06] hover:border-[#d0bcff]/30 text-left transition-all active:scale-[0.98] shadow-lg cursor-pointer flex flex-col justify-between min-h-[120px]"
          type="button"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#d0bcff]/15 text-[#d0bcff] flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(208,188,255,0.2)]">
              <span className="material-symbols-outlined text-[22px]">event</span>
            </div>
            <span className="material-symbols-outlined text-[#8c909f] group-hover:text-[#dae2fd] text-[18px] transition-colors">
              arrow_forward
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-sm font-bold text-[#dae2fd]">College Events</h3>
            <p className="text-[11px] text-[#c2c6d6] mt-0.5">Hackathons, summits & fests</p>
          </div>
        </button>

        {/* Card 4: Places & Facilities */}
        <button
          onClick={() => onNavigateToTab('departments')}
          className="group relative overflow-hidden rounded-2xl bg-[#171f33]/80 hover:bg-[#222a3d]/90 p-4 border border-white/[0.06] hover:border-[#4cd7f6]/30 text-left transition-all active:scale-[0.98] shadow-lg cursor-pointer flex flex-col justify-between min-h-[120px]"
          type="button"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#009eb9]/20 text-[#4cd7f6] flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(76,215,246,0.2)]">
              <span className="material-symbols-outlined text-[22px]">local_convenience_store</span>
            </div>
            <span className="material-symbols-outlined text-[#8c909f] group-hover:text-[#dae2fd] text-[18px] transition-colors">
              arrow_forward
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-sm font-bold text-[#dae2fd]">Places & Facilities</h3>
            <p className="text-[11px] text-[#c2c6d6] mt-0.5">Library, dining, gym & halls</p>
          </div>
        </button>
      </div>

      {/* Featured Campus Spotlight Banner (Live Event at OSEN Noida) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#571bc1]/40 via-[#222a3d]/80 to-[#171f33] p-4 sm:p-5 border border-[#c4abff]/20 shadow-xl">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#571bc1]/60 text-[#c4abff] text-[10px] font-mono font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c4abff] animate-ping" />
            Live Spotlight
          </span>
          <span className="text-[10px] font-mono text-[#4cd7f6]">{featuredEvent.date}</span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-[#dae2fd] mt-2 leading-snug">
          {featuredEvent.title}
        </h3>
        <p className="text-xs text-[#c2c6d6] mt-1 leading-relaxed">
          {featuredEvent.tagline}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1 text-xs font-mono text-[#adc6ff]">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            <span>{featuredEvent.roomOrHall}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectEvent(featuredEvent)}
              className="px-3 py-1.5 rounded-xl bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] text-xs font-semibold active:scale-95 transition-all cursor-pointer"
              type="button"
            >
              View Agenda
            </button>
            <button
              onClick={() => onStartRouteTo(featuredEvent.locationId)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#4d8eff] to-[#4cd7f6] text-[#00285d] text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">near_me</span>
              <span>Directions</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick-Access Section (Commonly Visited Locations) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">near_me</span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#dae2fd] font-semibold">
              Frequently Visited Spots
            </span>
          </div>
          <button
            onClick={() => onNavigateToTab('departments')}
            className="text-[11px] font-mono text-[#adc6ff] hover:underline cursor-pointer"
            type="button"
          >
            View All ({CAMPUS_LOCATIONS.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {CAMPUS_LOCATIONS.slice(0, 4).map((loc) => {
            const isBookmarked = savedLocationIds.includes(loc.id);

            return (
              <div
                key={loc.id}
                onClick={() => onSelectLocation(loc)}
                className="p-3.5 rounded-2xl bg-[#171f33]/70 hover:bg-[#222a3d] border border-white/[0.04] hover:border-white/[0.08] transition-all flex items-start justify-between gap-3 cursor-pointer shadow-sm group"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#4cd7f6]/10 text-[#4cd7f6] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">
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
                    <span className="text-xs font-bold text-[#dae2fd] truncate group-hover:text-[#4cd7f6] transition-colors">
                      {loc.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#c2c6d6] truncate mt-0.5">
                      {loc.block} • {loc.floor}
                    </span>
                    <span className="text-[10px] font-mono text-[#4cd7f6] mt-1">
                      {loc.openHours.split('|')[0]}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(loc.id);
                    }}
                    className={`p-1 rounded-lg transition-colors ${
                      isBookmarked ? 'text-[#4cd7f6]' : 'text-[#8c909f] hover:text-[#dae2fd]'
                    }`}
                    title={isBookmarked ? 'Remove Bookmark' : 'Save Location'}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isBookmarked ? 'bookmark_added' : 'bookmark_border'}
                    </span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartRouteTo(loc.id);
                    }}
                    className="px-2 py-0.5 rounded-lg bg-[#4d8eff]/15 text-[#adc6ff] text-[10px] font-mono font-semibold hover:bg-[#4d8eff]/25 transition-colors"
                    title="Get Route"
                    type="button"
                  >
                    Route
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
