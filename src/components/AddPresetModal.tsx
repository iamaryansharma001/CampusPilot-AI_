import React, { useState } from 'react';
import { PresetSample } from '../types';
import { parseNoticeLocally } from '../utils/ruleEngine';

interface AddPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPreset: (preset: PresetSample) => void;
}

export const AddPresetModal: React.FC<AddPresetModalProps> = ({
  isOpen,
  onClose,
  onAddPreset,
}) => {
  const [title, setTitle] = useState('');
  const [badge, setBadge] = useState('Weekly Sheet');
  const [subtitle, setSubtitle] = useState('');
  const [icon, setIcon] = useState('calculate');
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;

    // Automatically parse the text with rule engine to extract structured data
    const parsed = parseNoticeLocally(text);

    const newPreset: PresetSample = {
      id: `custom-preset-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || `${parsed.venue} • Due ${parsed.deadline.split('•')[0]}`,
      badge: badge.trim() || 'Custom',
      icon: icon || 'description',
      text: text.trim(),
      parsedData: {
        event: parsed.event || title.trim(),
        venue: parsed.venue,
        deadline: parsed.deadline,
        fees: parsed.fees,
        ruleRecommendation: parsed.ruleRecommendation || 'Verify submission requirements before the deadline.',
        actionItems: parsed.actionItems,
      },
    };

    onAddPreset(newPreset);
    setTitle('');
    setSubtitle('');
    setText('');
    onClose();
  };

  const badgeOptions = ['Weekly Sheet', 'Lab Viva', 'Assignment', 'Exam Notice', 'Quiz'];
  const iconOptions = [
    { name: 'calculate', label: 'Maths' },
    { name: 'science', label: 'Lab' },
    { name: 'code', label: 'Coding' },
    { name: 'description', label: 'Sheet' },
    { name: 'menu_book', label: 'Theory' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#060e20]/80 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl bg-[#171f33] p-5 shadow-2xl border border-white/[0.08] flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4cd7f6]/20 text-[#4cd7f6] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#dae2fd]">Add Custom Preset</h3>
              <span className="text-[10px] font-mono text-[#c2c6d6]">
                Save frequent sheets, lab guidelines & circulars for 1-click loading
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#c2c6d6] hover:text-[#dae2fd] p-1"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col gap-3 py-3">
          <div>
            <label className="block text-xs font-mono text-[#c2c6d6] mb-1">Preset Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Maths Sheet 5 or Python Lab Manual"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#060e20] text-sm text-[#dae2fd] border border-white/[0.06] focus:outline-none focus:border-[#4cd7f6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-mono text-[#c2c6d6] mb-1">Category Badge</label>
              <div className="flex flex-wrap gap-1">
                {badgeOptions.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBadge(b)}
                    className={`px-2 py-0.5 rounded-full font-mono text-[10px] transition-all ${
                      badge === b
                        ? 'bg-[#4cd7f6] text-[#002f38] font-bold'
                        : 'bg-[#060e20] text-[#c2c6d6]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#c2c6d6] mb-1">Icon</label>
              <div className="flex items-center gap-1">
                {iconOptions.map((ico) => (
                  <button
                    key={ico.name}
                    type="button"
                    onClick={() => setIcon(ico.name)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      icon === ico.name
                        ? 'bg-[#adc6ff] text-[#002e6a]'
                        : 'bg-[#060e20] text-[#c2c6d6] hover:text-[#dae2fd]'
                    }`}
                    title={ico.label}
                  >
                    <span className="material-symbols-outlined text-[16px]">{ico.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#c2c6d6] mb-1">Subtitle / Context</label>
            <input
              type="text"
              placeholder="e.g. Room 214 Ramanujan Block • Due Friday 4 PM"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-[#060e20] text-xs text-[#dae2fd] border border-white/[0.06] focus:outline-none focus:border-[#4cd7f6]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#c2c6d6] mb-1">
              Notice / Assignment / Lab Sheet Content
            </label>
            <textarea
              required
              rows={5}
              placeholder="Paste the assignment questions, submission guidelines, or circular text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#060e20] text-xs text-[#dae2fd] border border-white/[0.06] focus:outline-none focus:border-[#4cd7f6] resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-9 rounded-xl bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-9 rounded-xl bg-[#4cd7f6] hover:bg-[#009eb9] text-[#002f38] text-xs font-bold shadow-md active:scale-95 transition-all"
            >
              Save Preset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
