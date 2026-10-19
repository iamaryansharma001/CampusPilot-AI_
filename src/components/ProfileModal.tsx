import React from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  urgentCount: number;
  pendingCount: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  urgentCount,
  pendingCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#060e20]/80 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-2xl bg-[#171f33] p-5 shadow-2xl border border-white/[0.08] flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#571bc1]/30 text-[#c4abff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">badge</span>
            </div>
            <h3 className="text-sm font-semibold text-[#dae2fd]">Student Academic Passport</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#c2c6d6] hover:text-[#dae2fd] p-1"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Student Avatar & Basic Info */}
        <div className="flex items-center gap-3 bg-[#131b2e] p-3 rounded-xl border border-white/[0.04]">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#adc6ff] to-[#4d8eff] flex items-center justify-center text-[#002e6a] text-lg font-bold shrink-0 shadow-md">
            AS
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-[#dae2fd] truncate">Aryan Sharma</span>
            <span className="text-xs font-mono text-[#4cd7f6] truncate">iamaryansharma001@gmail.com</span>
            <span className="text-[11px] font-mono text-[#adc6ff] mt-0.5">
              +91-9259235594
            </span>
          </div>
        </div>

        {/* Academic Identity Badges */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-[#060e20] flex flex-col justify-between border border-white/[0.04]">
            <span className="font-mono text-[10px] text-[#c2c6d6]">Roll Number</span>
            <span className="text-xs font-mono font-bold text-[#dae2fd] mt-0.5">CSAIML-061</span>
            <span className="text-[9px] font-mono text-[#4cd7f6]">B.Tech CSE (AI &amp; ML)</span>
          </div>

          <div className="p-2 rounded-xl bg-[#060e20] flex flex-col justify-between border border-white/[0.04]">
            <span className="font-mono text-[10px] text-[#c2c6d6]">Admission Number</span>
            <span className="text-xs font-mono font-bold text-[#adc6ff] mt-0.5 truncate">26GCEBCSAIML072</span>
            <span className="text-[9px] font-mono text-emerald-400">Enrolled &amp; Verified</span>
          </div>
        </div>

        {/* Attendance & Eligibility Status */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-[#060e20] flex flex-col justify-between border border-white/[0.04]">
            <span className="font-mono text-[10px] text-[#c2c6d6]">Biometric Attendance</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-bold text-[#4cd7f6]">84.5%</span>
              <span className="text-[10px] font-mono text-[#adc6ff]">&gt; 75% req</span>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 mt-1">Eligible for Exams</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#060e20] flex flex-col justify-between border border-white/[0.04]">
            <span className="font-mono text-[10px] text-[#c2c6d6]">Academic Tasks</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-bold text-[#dae2fd]">{pendingCount}</span>
              <span className="text-[10px] font-mono text-[#ffb4ab]">({urgentCount} urgent)</span>
            </div>
            <span className="text-[9px] font-mono text-[#4cd7f6] mt-1">Offline Cached</span>
          </div>
        </div>

        {/* System telemetry note */}
        <div className="p-2.5 rounded-xl bg-[#222a3d]/50 text-[11px] text-[#c2c6d6] flex items-start gap-2 border border-white/[0.04]">
          <span className="material-symbols-outlined text-[16px] text-[#adc6ff] shrink-0 mt-0.5">
            security
          </span>
          <p className="leading-relaxed">
            CampusPilot AI operates strictly in client-side / server-side isolated sandbox. Notice
            extractions remain private to your local academic environment.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full h-9 rounded-xl bg-[#4d8eff] hover:bg-[#3b82f6] text-[#00285d] text-xs font-bold transition-all shadow-md active:scale-95"
          type="button"
        >
          Close Passport
        </button>
      </div>
    </div>
  );
};
