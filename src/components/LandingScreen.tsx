import React from 'react';

interface LandingScreenProps {
  onGetStarted: () => void;
  onExploreMap: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onGetStarted,
  onExploreMap,
}) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-6 overflow-hidden bg-[#0b1326] text-[#dae2fd]">
      {/* Ambient Spatial Lighting Spheres */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#4d8eff]/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-[#571bc1]/20 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-[#4cd7f6]/15 blur-[110px] pointer-events-none" />

      {/* Top Event Crest */}
      <div className="relative z-10 w-full max-w-md mx-auto pt-6 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171f33]/80 backdrop-blur-xl border border-white/[0.08] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-pulse shadow-[0_0_8px_#4cd7f6]" />
          <span className="text-[11px] font-mono tracking-tight text-[#adc6ff]">
            GitHub Copilot Dev Days / OSEN Noida
          </span>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#222a3d]/60 text-[#c2c6d6] border border-white/[0.04]">
          v2.4 Liquid Glass
        </span>
      </div>

      {/* Hero Content Section */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto flex flex-col items-center text-center py-8">
        {/* Apple-inspired Liquid Glass Icon Crest */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#4d8eff] via-[#571bc1] to-[#4cd7f6] p-[1.5px] shadow-[0_0_40px_rgba(77,142,255,0.4)] flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-[#060e20]/85 backdrop-blur-2xl flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <span className="material-symbols-outlined text-[#adc6ff] text-[42px] drop-shadow-[0_0_12px_rgba(173,198,255,0.6)]">
                near_me
              </span>
            </div>
          </div>
          {/* Subtle Orbit Badge */}
          <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#4cd7f6] text-[#002f38] font-mono text-[10px] font-bold shadow-md">
            AI READY
          </div>
        </div>

        {/* Branding & Tagline */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#dae2fd]">
          CampusPilot <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#adc6ff] via-[#4cd7f6] to-[#d0bcff]">AI</span>
        </h1>
        <p className="text-base sm:text-lg font-semibold text-[#4cd7f6] mt-2 tracking-tight">
          Your Smart Campus Navigator.
        </p>
        <p className="text-sm text-[#c2c6d6] mt-2 font-mono tracking-wider uppercase">
          Find • Explore • Connect
        </p>

        {/* Feature Cards Glass Preview Grid */}
        <div className="grid grid-cols-2 gap-2.5 w-full mt-8">
          <div className="p-3.5 rounded-2xl bg-[#171f33]/60 backdrop-blur-xl border border-white/[0.08] flex flex-col items-center text-center shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-[#4d8eff]/15 text-[#adc6ff] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-[18px]">explore</span>
            </div>
            <span className="text-xs font-semibold text-[#dae2fd]">Campus Map</span>
            <span className="text-[10px] text-[#c2c6d6] mt-0.5 font-mono">Illustrative Routes</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#171f33]/60 backdrop-blur-xl border border-white/[0.08] flex flex-col items-center text-center shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-[#4cd7f6]/15 text-[#4cd7f6] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-[18px]">domain</span>
            </div>
            <span className="text-xs font-semibold text-[#dae2fd]">Departments</span>
            <span className="text-[10px] text-[#c2c6d6] mt-0.5 font-mono">Labs & Facilities</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#171f33]/60 backdrop-blur-xl border border-white/[0.08] flex flex-col items-center text-center shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-[#d0bcff]/15 text-[#d0bcff] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-[18px]">event</span>
            </div>
            <span className="text-xs font-semibold text-[#dae2fd]">College Events</span>
            <span className="text-[10px] text-[#c2c6d6] mt-0.5 font-mono">Dev Days & Fests</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#171f33]/60 backdrop-blur-xl border border-white/[0.08] flex flex-col items-center text-center shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-[#4cd7f6]/15 text-[#4cd7f6] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            </div>
            <span className="text-xs font-semibold text-[#dae2fd]">Campus Assistant</span>
            <span className="text-[10px] text-[#c2c6d6] mt-0.5 font-mono">Instant Answers</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="relative z-10 w-full max-w-md mx-auto pb-4 flex flex-col gap-2.5">
        <button
          onClick={onGetStarted}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#4d8eff] via-[#3b82f6] to-[#4cd7f6] text-[#00285d] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(77,142,255,0.4)] active:scale-[0.98] transition-all cursor-pointer"
          type="button"
        >
          <span>Get Started</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>

        <button
          onClick={onExploreMap}
          className="w-full h-11 rounded-2xl bg-[#171f33]/80 hover:bg-[#222a3d] backdrop-blur-xl border border-white/[0.08] text-[#dae2fd] font-semibold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">map</span>
          <span>Explore Interactive Campus Map</span>
        </button>

        <div className="text-center mt-1">
          <span className="text-[10px] font-mono text-[#8c909f]">
            Developed for Aryan Sharma • CSAIML-061 • Admission: 26GCEBCSAIML072
          </span>
        </div>
      </div>
    </div>
  );
};
