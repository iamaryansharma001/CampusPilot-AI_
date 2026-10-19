import React, { useState } from 'react';
import { ParsedNotice } from '../types';

interface SavedViewProps {
  savedNotices: ParsedNotice[];
  onSelectNoticeForAnalyzer: (notice: ParsedNotice) => void;
  onViewOriginalNotice: (text: string, title: string) => void;
  onDeleteSavedNotice: (id: string) => void;
  onNavigateToAnalyzer: () => void;
  showToast: (msg: string) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  savedNotices,
  onSelectNoticeForAnalyzer,
  onViewOriginalNotice,
  onDeleteSavedNotice,
  onNavigateToAnalyzer,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const filtered = savedNotices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.rawText.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedDept === 'all') return true;
    return n.department?.toLowerCase().includes(selectedDept.toLowerCase());
  });

  return (
    <div className="flex flex-col w-full gap-4 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#dae2fd] tracking-tight">
              Saved Circulars
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#571bc1]/40 text-[#c4abff] font-mono text-[10px] font-semibold">
              Archive ({savedNotices.length})
            </span>
          </div>
          <p className="text-xs text-[#c2c6d6] mt-0.5">
            Verified campus circulars, syllabi releases, and exam rosters.
          </p>
        </div>
        <button
          onClick={onNavigateToAnalyzer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#adc6ff]/20 hover:bg-[#adc6ff]/30 text-[#adc6ff] text-xs font-semibold border border-[#adc6ff]/30 active:scale-95 transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Parse New</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full rounded-xl bg-[#131b2e] px-3 py-2 flex items-center gap-2 border border-white/[0.04] shadow-inner">
        <span className="material-symbols-outlined text-[#8c909f] text-[18px]">search</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by event, hall, keyword, or deadline..."
          className="w-full bg-transparent text-xs sm:text-sm text-[#dae2fd] placeholder:text-[#8c909f] focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-[#8c909f] hover:text-[#dae2fd] p-1"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Department Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'CSE', 'Exam', 'Hostel'].map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1 rounded-full font-mono text-[11px] whitespace-nowrap transition-all ${
              selectedDept === dept
                ? 'bg-[#31394d] text-[#dae2fd] font-semibold shadow-sm border border-white/[0.08]'
                : 'bg-[#171f33] text-[#c2c6d6] hover:text-[#dae2fd] border border-white/[0.02]'
            }`}
            type="button"
          >
            {dept === 'all' ? 'All Departments' : dept}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="flex flex-col gap-3">
        {filtered.map((notice) => (
          <div
            key={notice.id}
            className="relative overflow-hidden rounded-2xl bg-[#171f33] p-4 shadow-sm border border-white/[0.04] hover:border-white/[0.08] transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[10px] text-[#4cd7f6] uppercase tracking-wider font-semibold">
                  {notice.department || 'Academic Affairs'}
                </span>
                <h3 className="text-sm font-semibold text-[#dae2fd] mt-0.5 leading-snug">
                  {notice.event || notice.title}
                </h3>
              </div>
              <button
                aria-label="Delete notice"
                onClick={() => {
                  onDeleteSavedNotice(notice.id);
                  showToast('Circular removed from archive');
                }}
                className="text-[#8c909f] hover:text-[#ffb4ab] p-1 transition-colors shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>

            {/* Quick Fact Pills */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/[0.04] text-xs font-mono text-[#c2c6d6]">
              <div className="flex items-center gap-1.5 truncate">
                <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">
                  location_on
                </span>
                <span className="truncate">{notice.venue}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="material-symbols-outlined text-[15px] text-[#ffb4ab]">alarm</span>
                <span className="text-[#ffb4ab] truncate">{notice.deadline}</span>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-2">
              <span className="font-mono text-[11px] text-[#adc6ff]">
                {notice.actionItems.length} Action Items Extracted
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewOriginalNotice(notice.rawText, notice.title)}
                  className="px-2.5 py-1 rounded-lg bg-[#222a3d] text-[#c2c6d6] hover:text-[#dae2fd] font-mono text-[11px] active:scale-95 transition-all"
                  type="button"
                >
                  Raw Notice
                </button>
                <button
                  onClick={() => onSelectNoticeForAnalyzer(notice)}
                  className="px-3 py-1 rounded-lg bg-[#4d8eff] hover:bg-[#3b82f6] text-[#00285d] font-semibold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  <span>Analyze</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-[#131b2e]/50 border border-white/[0.04]">
            <div className="w-12 h-12 rounded-xl bg-[#222a3d] flex items-center justify-center text-[#adc6ff] mb-2">
              <span className="material-symbols-outlined text-[24px]">search_off</span>
            </div>
            <span className="text-sm font-semibold text-[#dae2fd]">No circulars found</span>
            <p className="text-xs text-[#c2c6d6] mt-1 max-w-xs">
              Try adjusting your search terms or parse a new circular from WhatsApp or email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
