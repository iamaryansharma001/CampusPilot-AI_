import React from 'react';

interface OriginalNoticeModalProps {
  isOpen: boolean;
  title: string;
  rawText: string;
  onClose: () => void;
  onCopy: () => void;
}

export const OriginalNoticeModal: React.FC<OriginalNoticeModalProps> = ({
  isOpen,
  title,
  rawText,
  onClose,
  onCopy,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#060e20]/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl bg-[#171f33] p-5 shadow-2xl border border-white/[0.08] flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
              description
            </span>
            <h3 className="text-sm font-semibold text-[#dae2fd] truncate">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#c2c6d6] hover:text-[#dae2fd] p-1"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="my-3 flex-1 overflow-y-auto rounded-xl bg-[#060e20] p-3.5 border border-white/[0.04]">
          <pre className="text-xs text-[#dae2fd] whitespace-pre-wrap font-mono leading-relaxed select-text">
            {rawText}
          </pre>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
          <button
            onClick={onCopy}
            className="px-4 py-2 rounded-xl bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">
              content_copy
            </span>
            Copy Raw Notice
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#4d8eff] hover:bg-[#3b82f6] text-[#00285d] text-xs font-bold active:scale-95 transition-all"
            type="button"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
