import React, { useState } from 'react';
import { Task } from '../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('Tomorrow, 11:59 PM');
  const [tag, setTag] = useState('Required Step');
  const [isUrgent, setIsUrgent] = useState(false);
  const [sourceCircular, setSourceCircular] = useState('Manual Entry');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      status: isUrgent ? 'urgent' : 'pending',
      originalStatus: isUrgent ? 'urgent' : 'pending',
      tag: isUrgent ? 'URGENT' : tag.toUpperCase(),
      deadline: deadline.trim() || 'No Deadline',
      sourceCircular: sourceCircular.trim() || 'Manual Entry',
    });

    setTitle('');
    onClose();
  };

  const tagPresets = ['Finance', 'Exam Cell', 'Lab Submission', 'Required Step', 'Team Prep'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#060e20]/80 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-2xl bg-[#171f33] p-5 shadow-2xl border border-white/[0.08]">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4d8eff]/20 text-[#adc6ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">add_task</span>
            </div>
            <h3 className="text-base font-semibold text-[#dae2fd]">Quick Add Task</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#c2c6d6] hover:text-[#dae2fd] p-1"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-4">
          <div>
            <label className="block text-xs font-mono text-[#c2c6d6] mb-1">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Submit DBMS Assignment Chapter 4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#060e20] text-sm text-[#dae2fd] border border-white/[0.06] focus:outline-none focus:border-[#4d8eff]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#c2c6d6] mb-1">Deadline</label>
            <input
              type="text"
              placeholder="e.g. April 18, 5:00 PM"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#060e20] text-sm text-[#dae2fd] border border-white/[0.06] focus:outline-none focus:border-[#4d8eff]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#c2c6d6] mb-1">Category / Tag</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tagPresets.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] transition-all ${
                    tag === t
                      ? 'bg-[#4d8eff] text-[#00285d] font-bold'
                      : 'bg-[#222a3d] text-[#c2c6d6]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#c2c6d6] mb-1">Source Circular / Reference</label>
            <input
              type="text"
              placeholder="e.g. Dept WhatsApp group / Circular #40"
              value={sourceCircular}
              onChange={(e) => setSourceCircular(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#060e20] text-sm text-[#dae2fd] border border-white/[0.06] focus:outline-none focus:border-[#4d8eff]"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 rounded text-[#ffb4ab] accent-[#ffb4ab] cursor-pointer"
            />
            <span className="text-xs text-[#dae2fd] font-medium flex items-center gap-1">
              Mark as Urgent (&lt; 48 hours deadline)
            </span>
          </label>

          <div className="flex items-center gap-2 mt-2 pt-3 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-9 rounded-xl bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-9 rounded-xl bg-[#4d8eff] hover:bg-[#3b82f6] text-[#00285d] text-xs font-bold shadow-md"
            >
              Add to Center
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
