import React from 'react';

export type MainNavTab = 'dashboard' | 'map' | 'departments' | 'events' | 'assistant' | 'saved';

interface NavigationBarProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  savedCount: number;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
}) => {
  const navItems: { id: MainNavTab; label: string; icon: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Home', icon: 'dashboard' },
    { id: 'map', label: 'Map', icon: 'explore' },
    { id: 'departments', label: 'Places', icon: 'domain' },
    { id: 'events', label: 'Events', icon: 'event' },
    { id: 'assistant', label: 'Assistant', icon: 'smart_toy' },
    { id: 'saved', label: 'Saved', icon: 'bookmark', badge: savedCount },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe pointer-events-none px-3 sm:px-4 mb-2">
      <div className="pointer-events-auto mx-auto max-w-xl h-16 rounded-full bg-[#060e20]/85 backdrop-blur-2xl p-1.5 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.7)] border border-white/[0.08]">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex-1 h-full rounded-full flex flex-col items-center justify-center gap-0.5 transition-all duration-200 active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-[#adc6ff]/20 to-[#4d8eff]/25 text-[#adc6ff] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] font-semibold'
                  : 'text-[#c2c6d6] hover:text-[#dae2fd]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
              <span className="text-[10px] font-mono tracking-tight leading-none">
                {item.label}
              </span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="absolute top-1.5 right-2 sm:right-3 w-4 h-4 rounded-full bg-[#4cd7f6] text-[#002f38] text-[9px] font-mono font-bold flex items-center justify-center shadow-sm">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
