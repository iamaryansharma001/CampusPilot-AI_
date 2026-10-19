import React from 'react';

interface SafetyModalProps {
  isOpen: boolean;
  completedCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({
  isOpen,
  completedCount,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#060e20]/80 backdrop-blur-md transition-opacity duration-200">
      <div className="w-full max-w-xs rounded-2xl bg-[#222a3d] p-5 flex flex-col gap-3 shadow-2xl scale-100 border border-white/[0.08]">
        <div className="w-10 h-10 rounded-xl bg-[#93000a]/40 text-[#ffb4ab] flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">warning</span>
        </div>
        <div>
          <h3 className="text-base text-[#dae2fd] font-semibold">Clear Completed Tasks?</h3>
          <p className="text-xs text-[#c2c6d6] mt-1 leading-relaxed">
            This will permanently remove {completedCount} completed task{completedCount === 1 ? '' : 's'} from
            your local device cache.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={onCancel}
            className="flex-1 h-9 rounded-lg bg-[#171f33] hover:bg-[#31394d] text-[#dae2fd] text-xs font-semibold transition-colors border border-white/[0.04]"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-9 rounded-lg bg-[#ffb4ab] hover:bg-[#ffb4ab]/90 text-[#690005] text-xs font-bold shadow-md transition-colors"
            type="button"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
