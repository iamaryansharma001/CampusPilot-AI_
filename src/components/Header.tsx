import React from 'react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onShowLanding: () => void;
  activeTabTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenProfile,
  onShowLanding,
  activeTabTitle,
}) => {
  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#0b1326]/85 backdrop-blur-2xl border-b border-white/[0.06]">
      <div className="max-w-4xl mx-auto h-16 sm:h-20 px-4 flex items-center justify-between gap-3">
        {/* Brand / Logo (Clickable to show welcome landing) */}
        <div
          onClick={onShowLanding}
          className="flex items-center gap-2.5 min-w-0 cursor-pointer group active:scale-95 transition-transform"
          title="CampusPilot AI - Your Smart Campus Navigator"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4d8eff] via-[#571bc1] to-[#4cd7f6] p-[1.5px] flex items-center justify-center shadow-[0_0_20px_rgba(77,142,255,0.35)] shrink-0">
            <div className="w-full h-full bg-[#060e20] rounded-[14px] flex items-center justify-center backdrop-blur-md">
              <span className="material-symbols-outlined text-[#adc6ff] text-[20px] group-hover:scale-110 transition-transform">
                near_me
              </span>
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-[#dae2fd] tracking-tight truncate">
                CampusPilot
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#adc6ff]/15 text-[#adc6ff] font-mono font-bold tracking-wider">
                AI
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse shadow-[0_0_6px_#4cd7f6]" />
              <span className="text-[11px] font-mono text-[#4cd7f6] truncate hidden xs:inline">
                Smart Campus Navigator
              </span>
              <span className="text-[11px] font-mono text-[#c2c6d6] truncate xs:hidden">
                {activeTabTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-[#171f33]/80 border border-white/[0.06] text-xs font-mono text-[#adc6ff]">
            <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">verified</span>
            <span>OSEN Noida Edition</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#171f33]/80 border border-white/[0.06] text-xs font-mono text-[#adc6ff]">
            <span className="material-symbols-outlined text-[13px] text-[#4cd7f6]">badge</span>
            <span>26GCEBCSAIML072</span>
          </div>

          <button
            aria-label="Campus Alerts & Notifications"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#c2c6d6] hover:text-[#dae2fd] hover:bg-[#222a3d]/80 active:scale-95 transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6] animate-pulse" />
          </button>

          <button
            aria-label="Student Profile - Aryan Sharma (CSAIML-061)"
            title="Aryan Sharma • CSAIML-061 • 26GCEBCSAIML072"
            onClick={onOpenProfile}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#adc6ff] to-[#4d8eff] p-[1.5px] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            type="button"
          >
            <div className="w-full h-full bg-[#060e20] rounded-full flex items-center justify-center text-[#adc6ff] font-mono font-bold text-xs">
              AS
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
