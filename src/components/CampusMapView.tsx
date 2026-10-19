import React, { useState, useEffect } from 'react';
import { CAMPUS_LOCATIONS, CampusLocation, getCalculatedRoute, NavigationRoute } from '../data/campusData';

interface CampusMapViewProps {
  initialDestinationId?: string;
  onSelectLocationDetail: (location: CampusLocation) => void;
  onBackToDashboard: () => void;
}

export const CampusMapView: React.FC<CampusMapViewProps> = ({
  initialDestinationId,
  onSelectLocationDetail,
  onBackToDashboard,
}) => {
  const [startLocationId, setStartLocationId] = useState<string>('admin-block');
  const [destinationId, setDestinationId] = useState<string>(initialDestinationId || 'turing-center');
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  useEffect(() => {
    if (initialDestinationId) {
      setDestinationId(initialDestinationId);
      const loc = CAMPUS_LOCATIONS.find((l) => l.id === initialDestinationId);
      if (loc) setSelectedLocation(loc);
    }
  }, [initialDestinationId]);

  const route: NavigationRoute = getCalculatedRoute(startLocationId, destinationId);

  const startLoc = CAMPUS_LOCATIONS.find((l) => l.id === startLocationId) || CAMPUS_LOCATIONS[0];
  const destLoc = CAMPUS_LOCATIONS.find((l) => l.id === destinationId) || CAMPUS_LOCATIONS[1];

  // SVG coordinate calculations for viewBox="0 0 1000 800"
  const startX = (startLoc.coordinates.x / 100) * 1000;
  const startY = (startLoc.coordinates.y / 100) * 800;
  const destX = (destLoc.coordinates.x / 100) * 1000;
  const destY = (destLoc.coordinates.y / 100) * 800;

  // Mid-point curve for walking path
  const midX = (startX + destX) / 2 + (destY > startY ? -40 : 40);
  const midY = (startY + destY) / 2 + (destX > startX ? 40 : -40);
  const pathD = `M ${startX} ${startY} Q ${midX} ${midY} ${destX} ${destY}`;

  // Advance step simulation
  useEffect(() => {
    let timer: any;
    if (isNavigating) {
      timer = setInterval(() => {
        setActiveStepIndex((prev) => {
          if (prev >= route.steps.length - 1) {
            setIsNavigating(false);
            return 0;
          }
          return prev + 1;
        });
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isNavigating, route.steps.length]);

  return (
    <div className="flex flex-col w-full gap-4 pb-24 select-none">
      {/* Top Header & Route Selector Glass Sheet */}
      <div className="relative overflow-hidden rounded-3xl bg-[#171f33]/80 backdrop-blur-2xl p-4 sm:p-5 border border-white/[0.08] shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToDashboard}
              className="w-8 h-8 rounded-full bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] flex items-center justify-center transition-all active:scale-95"
              type="button"
              title="Return to Dashboard"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-[#dae2fd]">Campus Navigator</h2>
              <span className="text-[10px] font-mono text-[#4cd7f6]">
                Interactive Pedestrian Walkway Network
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#060e20] text-[#adc6ff] text-xs font-mono border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse" />
            <span>GPS Active</span>
          </div>
        </div>

        {/* Start & Destination Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono text-[#c2c6d6] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4cd7f6]" />
              Start Location
            </label>
            <select
              value={startLocationId}
              onChange={(e) => {
                setStartLocationId(e.target.value);
                setIsNavigating(false);
              }}
              className="w-full h-10 px-3 rounded-xl bg-[#060e20] text-xs font-medium text-[#dae2fd] border border-white/[0.06] focus:outline-none focus:border-[#4cd7f6] appearance-none cursor-pointer"
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-[#171f33] text-[#dae2fd]">
                  {loc.name} ({loc.block})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono text-[#c2c6d6] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#adc6ff]" />
              Destination Point
            </label>
            <select
              value={destinationId}
              onChange={(e) => {
                setDestinationId(e.target.value);
                setIsNavigating(false);
                const loc = CAMPUS_LOCATIONS.find((l) => l.id === e.target.value);
                if (loc) setSelectedLocation(loc);
              }}
              className="w-full h-10 px-3 rounded-xl bg-[#060e20] text-xs font-medium text-[#dae2fd] border border-white/[0.06] focus:outline-none focus:border-[#adc6ff] appearance-none cursor-pointer"
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-[#171f33] text-[#dae2fd]">
                  {loc.name} ({loc.block})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Route Summary Stats Pill */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3.5 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-[#4cd7f6]">
              <span className="material-symbols-outlined text-[18px]">directions_walk</span>
              <span className="font-bold">{route.walkingMinutes} min walk</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#c2c6d6]">
              <span className="material-symbols-outlined text-[18px]">straighten</span>
              <span>{route.distanceMeters} meters</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsNavigating(!isNavigating);
                setActiveStepIndex(0);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer ${
                isNavigating
                  ? 'bg-[#ffb4ab] text-[#690005]'
                  : 'bg-gradient-to-r from-[#4d8eff] to-[#4cd7f6] text-[#00285d]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isNavigating ? 'stop' : 'navigation'}
              </span>
              <span>{isNavigating ? 'Stop Walk' : 'Start Navigation'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Illustrative Campus Map Canvas Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#060e20] border border-white/[0.08] shadow-2xl p-2 sm:p-4">
        {/* Map Legend Pill */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-[#171f33]/90 backdrop-blur-md border border-white/[0.08] text-[10px] font-mono text-[#c2c6d6]">
          <span className="w-2 h-2 rounded-full bg-[#4cd7f6]" />
          <span>Tap any building to explore</span>
        </div>

        {/* Compass Rosette */}
        <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#171f33]/90 backdrop-blur-md border border-white/[0.08] flex items-center justify-center text-[#adc6ff] shadow-sm">
          <span className="text-[10px] font-mono font-bold">N</span>
        </div>

        {/* SVG Interactive Map Area */}
        <div className="w-full aspect-[5/4] sm:aspect-[16/10] relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0b1326] via-[#091024] to-[#060e20]">
          <svg
            viewBox="0 0 1000 800"
            className="w-full h-full select-none"
            style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))' }}
          >
            {/* Campus Boundary & Perimeter */}
            <rect x="20" y="20" width="960" height="760" rx="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="8 6" />

            {/* University Central Lawns & Green Zones */}
            <path
              d="M 120 120 Q 250 80 400 120 Q 480 200 400 280 Q 250 320 120 250 Z"
              fill="rgba(76, 215, 246, 0.04)"
              stroke="rgba(76, 215, 246, 0.15)"
              strokeWidth="1.5"
            />
            <path
              d="M 600 140 Q 750 100 880 160 Q 920 280 840 340 Q 680 320 600 220 Z"
              fill="rgba(87, 27, 193, 0.05)"
              stroke="rgba(87, 27, 193, 0.15)"
              strokeWidth="1.5"
            />
            <circle cx="500" cy="400" r="70" fill="rgba(77, 142, 255, 0.05)" stroke="rgba(77, 142, 255, 0.2)" strokeWidth="1.5" />

            {/* University Pedestrian Avenues & Walkways */}
            <g stroke="rgba(255,255,255,0.12)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <line x1="80" y1="400" x2="920" y2="400" />
              <line x1="500" y1="60" x2="500" y2="740" />
              <line x1="180" y1="460" x2="500" y2="400" />
              <line x1="500" y1="400" x2="740" y2="320" />
              <line x1="500" y1="400" x2="280" y2="240" />
              <line x1="500" y1="400" x2="700" y2="680" />
              <line x1="500" y1="400" x2="300" y2="650" />
              <line x1="500" y1="400" x2="820" y2="840" />
            </g>

            {/* Center Fountain */}
            <circle cx="500" cy="400" r="14" fill="#009eb9" opacity="0.6" />
            <circle cx="500" cy="400" r="28" fill="none" stroke="#4cd7f6" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Highlighted Navigation Route Path */}
            <path
              d={pathD}
              fill="none"
              stroke="#4cd7f6"
              strokeWidth="6"
              strokeDasharray="8 6"
              strokeLinecap="round"
              className="animate-pulse"
              style={{ filter: 'drop-shadow(0 0 10px #4cd7f6)' }}
            />

            {/* Building Blocks */}
            {CAMPUS_LOCATIONS.map((loc) => {
              const x = (loc.coordinates.x / 100) * 1000;
              const y = (loc.coordinates.y / 100) * 800;
              const isStart = loc.id === startLocationId;
              const isDest = loc.id === destinationId;
              const isSelected = selectedLocation?.id === loc.id;

              return (
                <g
                  key={loc.id}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => setSelectedLocation(loc)}
                >
                  {/* Building Base Footprint */}
                  <rect
                    x={x - 48}
                    y={y - 36}
                    width="96"
                    height="72"
                    rx="16"
                    fill={isSelected ? '#222a3d' : '#131b2e'}
                    stroke={
                      isDest
                        ? '#adc6ff'
                        : isStart
                        ? '#4cd7f6'
                        : isSelected
                        ? '#4cd7f6'
                        : 'rgba(255,255,255,0.1)'
                    }
                    strokeWidth={isSelected || isDest || isStart ? 3 : 1}
                    className="hover:fill-[#1e293b] transition-colors"
                  />

                  {/* Pulsing indicator if Start or Destination */}
                  {(isStart || isDest) && (
                    <circle
                      cx={x}
                      cy={y}
                      r="40"
                      fill="none"
                      stroke={isDest ? '#adc6ff' : '#4cd7f6'}
                      strokeWidth="2"
                      className="animate-ping"
                      opacity="0.4"
                    />
                  )}

                  {/* Icon Badge */}
                  <circle
                    cx={x}
                    cy={y - 6}
                    r="16"
                    fill={isDest ? '#4d8eff' : isStart ? '#009eb9' : '#060e20'}
                  />
                  <text
                    x={x}
                    y={y - 1}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="13"
                    fontFamily="Material Symbols Outlined"
                  >
                    {loc.category === 'labs'
                      ? 'terminal'
                      : loc.category === 'academic'
                      ? 'school'
                      : loc.category === 'sports'
                      ? 'fitness_center'
                      : loc.category === 'student-services'
                      ? 'account_balance'
                      : 'store'}
                  </text>

                  {/* Building Name Label */}
                  <text
                    x={x}
                    y={y + 22}
                    textAnchor="middle"
                    fill={isSelected ? '#4cd7f6' : '#dae2fd'}
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="Plus Jakarta Sans"
                  >
                    {loc.shortName}
                  </text>
                </g>
              );
            })}

            {/* Current simulated position if walking */}
            {isNavigating && (
              <g className="animate-bounce">
                <circle cx={midX} cy={midY} r="10" fill="#4cd7f6" />
                <circle cx={midX} cy={midY} r="18" fill="none" stroke="#4cd7f6" strokeWidth="2" />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Turn-by-Turn Guidance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#171f33] p-4 border border-white/[0.06] shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
              directions
            </span>
            <span className="text-xs font-semibold text-[#dae2fd]">
              {isNavigating ? `Active Navigation: Step ${activeStepIndex + 1} of ${route.steps.length}` : 'Walking Directions'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#adc6ff]">
            {destLoc.name}
          </span>
        </div>

        <div className="flex flex-col gap-2 mt-3">
          {route.steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl flex items-center justify-between gap-3 text-xs transition-all border ${
                isNavigating && activeStepIndex === idx
                  ? 'bg-[#4d8eff]/20 border-[#4cd7f6] text-[#dae2fd] shadow-md'
                  : 'bg-[#131b2e] border-white/[0.03] text-[#c2c6d6]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isNavigating && activeStepIndex === idx
                      ? 'bg-[#4cd7f6] text-[#002f38]'
                      : 'bg-[#060e20] text-[#adc6ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{step.icon}</span>
                </div>
                <span className="truncate leading-snug">{step.instruction}</span>
              </div>
              <span className="font-mono text-[10px] text-[#adc6ff] shrink-0">{step.distance}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Location Quick Bottom Sheet Card */}
      {selectedLocation && (
        <div className="relative overflow-hidden rounded-2xl bg-[#131b2e] p-4 border border-white/[0.08] shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono text-[#4cd7f6] uppercase tracking-wider font-semibold">
                {selectedLocation.categoryLabel} • {selectedLocation.block}
              </span>
              <h3 className="text-sm font-bold text-[#dae2fd] mt-0.5">{selectedLocation.name}</h3>
              <p className="text-xs text-[#c2c6d6] mt-1 line-clamp-2 leading-relaxed">
                {selectedLocation.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-[#8c909f] hover:text-[#dae2fd] p-1"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/[0.06]">
            <button
              onClick={() => {
                setDestinationId(selectedLocation.id);
                setIsNavigating(true);
                setActiveStepIndex(0);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#4d8eff] to-[#4cd7f6] text-[#00285d] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">navigation</span>
              <span>Navigate Here</span>
            </button>
            <button
              onClick={() => onSelectLocationDetail(selectedLocation)}
              className="py-2 px-3 rounded-xl bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>Full Details</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
