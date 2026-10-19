import React from 'react';

export type ActiveTab = 'analyzer' | 'tasks' | 'saved';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingTasksCount: number;
  savedNoticesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  pendingTasksCount,
  savedNoticesCount,
}) => {
  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe pointer-events-none px-4 mb-2">
      <div className="pointer-events-auto mx-auto max-w-md h-16 rounded-full bg-[#060e20]/85 backdrop-blur-2xl p-1.5 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-white/[0.08]">
        {/* Analyzer Tab */}
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`relative flex-1 h-full rounded-full flex flex-col items-center justify-center gap-0.5 transition-all duration-200 active:scale-95 ${
            activeTab === 'analyzer'
              ? 'bg-gradient-to-b from-[#adc6ff]/20 to-[#4d8eff]/25 text-[#adc6ff] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] font-semibold'
              : 'text-[#c2c6d6] hover:text-[#dae2fd]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">psychology</span>
          <span className="text-[11px] font-mono tracking-tight">Analyzer</span>
        </button>

        {/* Tasks Tab */}
        <button
          onClick={() => setActiveTab('tasks')}
          className={`relative flex-1 h-full rounded-full flex flex-col items-center justify-center gap-0.5 transition-all duration-200 active:scale-95 ${
            activeTab === 'tasks'
              ? 'bg-gradient-to-b from-[#adc6ff]/20 to-[#4d8eff]/25 text-[#adc6ff] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] font-semibold'
              : 'text-[#c2c6d6] hover:text-[#dae2fd]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">checklist</span>
          <span className="text-[11px] font-mono tracking-tight">Tasks</span>
          {pendingTasksCount > 0 && activeTab !== 'tasks' && (
            <span className="absolute top-2.5 right-6 w-2 h-2 rounded-full bg-[#4cd7f6] ring-2 ring-[#060e20]" />
          )}
        </button>

        {/* Saved Tab */}
        <button
          onClick={() => setActiveTab('saved')}
          className={`relative flex-1 h-full rounded-full flex flex-col items-center justify-center gap-0.5 transition-all duration-200 active:scale-95 ${
            activeTab === 'saved'
              ? 'bg-gradient-to-b from-[#adc6ff]/20 to-[#4d8eff]/25 text-[#adc6ff] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] font-semibold'
              : 'text-[#c2c6d6] hover:text-[#dae2fd]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">bookmarks</span>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-mono tracking-tight">Saved</span>
            {savedNoticesCount > 0 && (
              <span className="text-[9px] font-mono px-1 rounded-full bg-white/10 text-[#c2c6d6]">
                {savedNoticesCount}
              </span>
            )}
          </div>
        </button>
      </div>
    </nav>
  );
};
