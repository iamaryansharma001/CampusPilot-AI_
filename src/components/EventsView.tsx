import React, { useState } from 'react';
import { CAMPUS_EVENTS, CampusEvent } from '../data/campusData';

interface EventsViewProps {
  onSelectEvent: (event: CampusEvent) => void;
  onNavigateToVenue: (locationId: string) => void;
  showToast: (msg: string) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  onSelectEvent,
  onNavigateToVenue,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'upcoming'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [rsvpEventIds, setRsvpEventIds] = useState<string[]>(['event-copilot']);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'hackathon', label: 'Hackathons' },
    { id: 'technical', label: 'Workshops' },
    { id: 'academic', label: 'Seminars' },
    { id: 'sports', label: 'Sports Meets' },
  ];

  const filteredEvents = CAMPUS_EVENTS.filter((evt) => {
    const matchesTab = activeTab === 'all' || evt.status === activeTab;
    const matchesCat = selectedCategory === 'all' || evt.category === selectedCategory;
    return matchesTab && matchesCat;
  });

  const handleToggleRsvp = (e: React.MouseEvent, eventId: string, title: string) => {
    e.stopPropagation();
    if (rsvpEventIds.includes(eventId)) {
      setRsvpEventIds((prev) => prev.filter((id) => id !== eventId));
      showToast(`Removed RSVP for ${title}`);
    } else {
      setRsvpEventIds((prev) => [...prev, eventId]);
      showToast(`RSVP Confirmed for ${title}! Added to Student Schedule.`);
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-24 select-none">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#dae2fd] tracking-tight">
              Campus Events & Fests
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#571bc1]/30 text-[#c4abff] font-mono text-[10px] font-bold">
              {filteredEvents.length} Active
            </span>
          </div>
        </div>
        <p className="text-xs text-[#c2c6d6]">
          Hackathons, technical symposia, cultural showcases, and branch tournaments across campus.
        </p>
      </div>

      {/* Status Segmented Tabs */}
      <div className="p-1 rounded-xl bg-[#060e20] flex items-center gap-1 border border-white/[0.04] shadow-inner">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-[#222a3d] text-[#dae2fd] shadow-sm'
              : 'text-[#c2c6d6] hover:text-[#dae2fd]'
          }`}
          type="button"
        >
          All ({CAMPUS_EVENTS.length})
        </button>
        <button
          onClick={() => setActiveTab('ongoing')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'ongoing'
              ? 'bg-[#222a3d] text-[#dae2fd] shadow-sm'
              : 'text-[#c2c6d6] hover:text-[#dae2fd]'
          }`}
          type="button"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse" />
          <span>Happening Now</span>
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === 'upcoming'
              ? 'bg-[#222a3d] text-[#dae2fd] shadow-sm'
              : 'text-[#c2c6d6] hover:text-[#dae2fd]'
          }`}
          type="button"
        >
          Upcoming
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-full font-mono text-xs whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#adc6ff] text-[#002e6a] font-bold shadow-sm'
                : 'bg-[#171f33] text-[#c2c6d6] hover:text-[#dae2fd] border border-white/[0.04]'
            }`}
            type="button"
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="flex flex-col gap-3.5">
        {filteredEvents.map((evt) => {
          const isRsvped = rsvpEventIds.includes(evt.id);

          return (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(evt)}
              className="relative overflow-hidden rounded-3xl bg-[#171f33]/80 hover:bg-[#222a3d] p-5 border border-white/[0.06] hover:border-white/[0.1] transition-all shadow-xl cursor-pointer group"
            >
              {/* Top Meta Line */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#571bc1]/40 text-[#c4abff] text-[10px] font-mono font-bold uppercase tracking-wider">
                    {evt.categoryLabel}
                  </span>
                  {evt.status === 'ongoing' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#4cd7f6]/20 text-[#4cd7f6] text-[10px] font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-ping" />
                      LIVE TODAY
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-[#adc6ff]">
                  <span className="material-symbols-outlined text-[15px]">group</span>
                  <span>{evt.attendeesCount} scholars</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-base sm:text-lg font-bold text-[#dae2fd] mt-2 group-hover:text-[#4cd7f6] transition-colors leading-snug">
                {evt.title}
              </h3>
              <p className="text-xs text-[#c2c6d6] mt-1 leading-relaxed">{evt.tagline}</p>

              {/* Date, Time & Venue Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/[0.06] text-xs font-mono text-[#c2c6d6]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[16px]">
                    calendar_month
                  </span>
                  <span>
                    {evt.date} • {evt.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <span className="material-symbols-outlined text-[#adc6ff] text-[16px]">
                    location_on
                  </span>
                  <span className="truncate">
                    {evt.locationName} ({evt.roomOrHall})
                  </span>
                </div>
              </div>

              {/* Highlights Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {evt.highlights.map((hl, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg bg-[#060e20] text-[#adc6ff] text-[10px] font-mono border border-white/[0.02]"
                  >
                    {hl}
                  </span>
                ))}
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-white/[0.06]">
                <button
                  onClick={(e) => handleToggleRsvp(e, evt.id, evt.title)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isRsvped
                      ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border border-[#4cd7f6]/40'
                      : 'bg-[#060e20] text-[#c2c6d6] hover:text-[#dae2fd]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isRsvped ? 'check_circle' : 'add_circle'}
                  </span>
                  <span>{isRsvped ? 'RSVP Confirmed' : 'RSVP to Event'}</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToVenue(evt.locationId);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#4d8eff] to-[#4cd7f6] text-[#00285d] font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">near_me</span>
                  <span>Navigate to Venue</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="py-12 text-center rounded-2xl bg-[#171f33]/40 border border-white/[0.04] p-4">
            <span className="material-symbols-outlined text-[#8c909f] text-[32px] mb-2">
              event_busy
            </span>
            <h4 className="text-sm font-semibold text-[#dae2fd]">No Matching Events</h4>
            <p className="text-xs text-[#c2c6d6] mt-1">
              There are no campus events matching your active filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
