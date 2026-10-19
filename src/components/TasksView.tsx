import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { downloadIcsFile } from '../utils/ics';

interface TasksViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenQuickAdd: () => void;
  onOpenClearConfirm: () => void;
  showToast: (msg: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onOpenQuickAdd,
  onOpenClearConfirm,
  showToast,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'urgent' | 'completed'>('all');

  // Counts
  const urgentCount = tasks.filter((t) => t.status === 'urgent').length;
  const pendingCount = tasks.filter((t) => t.status === 'pending' || t.status === 'urgent').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const allCount = tasks.length;

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return t.status === 'pending' || t.status === 'urgent';
    if (filter === 'urgent') return t.status === 'urgent';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  // Copy incomplete
  const handleCopyIncomplete = () => {
    const incomplete = tasks.filter((t) => t.status !== 'completed');
    if (incomplete.length === 0) {
      showToast('No pending tasks to copy!');
      return;
    }
    const text = incomplete.map((t) => `• ${t.title} (Due: ${t.deadline} | ${t.sourceCircular})`).join('\n');
    navigator.clipboard?.writeText(text);
    showToast(`Copied ${incomplete.length} pending tasks to clipboard`);
  };

  // Export .ics
  const handleExportIcs = () => {
    if (tasks.length === 0) {
      showToast('No tasks to export!');
      return;
    }
    downloadIcsFile(tasks, 'academic-deadlines.ics');
    showToast('Generated & downloaded academic-deadlines.ics');
  };

  return (
    <div className="flex flex-col w-full gap-4 select-none">
      {/* Offline Sync Pill Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#131b2e]/70 backdrop-blur-xl px-4 py-2.5 flex items-center justify-between shadow-sm border border-white/[0.04]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex items-center justify-center shrink-0 w-7 h-7 rounded-lg bg-[#009eb9]/25 text-[#4cd7f6]">
            <span className="material-symbols-outlined text-[16px]">sync_saved_locally</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm text-[#dae2fd] font-semibold truncate">
                Offline-first Engine
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6] animate-pulse"></span>
            </div>
            <span className="font-mono text-[11px] text-[#c2c6d6] truncate">
              Tasks synced locally in your browser storage
            </span>
          </div>
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#2d3449] text-[#4cd7f6] uppercase tracking-wider font-semibold shrink-0">
          Active
        </span>
      </div>

      {/* Header Title & Action Center Controls */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#dae2fd] tracking-tight">
              My Action Center
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#adc6ff]/15 text-[#adc6ff] font-mono text-[10px] font-semibold tracking-wider">
              Realtime
            </span>
          </div>
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#4d8eff] hover:bg-[#3b82f6] text-[#00285d] text-xs font-semibold shadow-md active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">add_task</span>
            <span>Quick Add</span>
          </button>
        </div>
        <p className="text-xs text-[#c2c6d6]">
          Extracted from campus notices, circulars & syllabi pipelines.
        </p>
      </div>

      {/* Summary Metrics Capsules */}
      <div className="grid grid-cols-3 gap-2">
        {/* Urgent Capsule */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#93000a]/30 via-[#222a3d]/60 to-[#171f33] p-2.5 flex flex-col justify-between shadow-sm border border-[#ffb4ab]/20">
          <div className="absolute -right-4 -top-4 w-12 h-12 bg-[#ffb4ab]/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-[#ffb4ab] text-[18px]">
              emergency_home
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-[#ffb4ab]/20 text-[#ffb4ab] font-bold uppercase">
              &lt; 48 hrs
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl text-[#ffb4ab] font-bold leading-none">
              {urgentCount}
            </div>
            <div className="font-mono text-[10px] text-[#c2c6d6] mt-1 leading-tight">
              Urgent Deadline
            </div>
          </div>
        </div>

        {/* Pending Capsule */}
        <div className="relative overflow-hidden rounded-xl bg-[#222a3d]/60 p-2.5 flex flex-col justify-between shadow-sm border border-white/[0.04]">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">
              pending_actions
            </span>
            <span className="w-2 h-2 rounded-full bg-[#adc6ff] animate-ping"></span>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl text-[#adc6ff] font-bold leading-none">
              {pendingCount}
            </div>
            <div className="font-mono text-[10px] text-[#c2c6d6] mt-1 leading-tight">
              Tasks Pending
            </div>
          </div>
        </div>

        {/* Completed Capsule */}
        <div className="relative overflow-hidden rounded-xl bg-[#222a3d]/60 p-2.5 flex flex-col justify-between shadow-sm border border-white/[0.04]">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">verified</span>
            <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] font-bold">
              Done
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl text-[#4cd7f6] font-bold leading-none">
              {completedCount}
            </div>
            <div className="font-mono text-[10px] text-[#c2c6d6] mt-1 leading-tight">
              Archived Today
            </div>
          </div>
        </div>
      </div>

      {/* Filter Segmented Tabs */}
      <div className="relative w-full p-1 bg-[#060e20]/80 rounded-xl flex items-center justify-between gap-1 shadow-inner border border-white/[0.04]">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all duration-200 ${
            filter === 'all'
              ? 'bg-[#31394d] text-[#dae2fd] shadow-sm'
              : 'text-[#c2c6d6] hover:text-[#dae2fd]'
          }`}
          type="button"
        >
          All <span className="text-[10px] opacity-80 font-normal">({allCount})</span>
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all duration-200 ${
            filter === 'pending'
              ? 'bg-[#31394d] text-[#dae2fd] shadow-sm'
              : 'text-[#c2c6d6] hover:text-[#dae2fd]'
          }`}
          type="button"
        >
          Pending <span className="text-[10px] opacity-80 font-normal">({pendingCount})</span>
        </button>
        <button
          onClick={() => setFilter('urgent')}
          className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all duration-200 ${
            filter === 'urgent'
              ? 'bg-[#31394d] text-[#dae2fd] shadow-sm'
              : 'text-[#c2c6d6] hover:text-[#dae2fd]'
          }`}
          type="button"
        >
          Urgent <span className="text-[10px] opacity-80 font-normal">({urgentCount})</span>
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all duration-200 ${
            filter === 'completed'
              ? 'bg-[#31394d] text-[#dae2fd] shadow-sm'
              : 'text-[#c2c6d6] hover:text-[#dae2fd]'
          }`}
          type="button"
        >
          Done <span className="text-[10px] opacity-80 font-normal">({completedCount})</span>
        </button>
      </div>

      {/* Visual AI HUD Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#571bc1]/40 via-[#222a3d]/70 to-[#171f33] p-3 flex items-center gap-3 shadow-sm border border-[#c4abff]/20">
        <div className="w-10 h-10 rounded-lg bg-[#060e20]/80 flex items-center justify-center shrink-0 text-[#d0bcff] shadow-[0_0_12px_rgba(208,188,255,0.25)]">
          <span className="material-symbols-outlined text-[20px]">psychology_alt</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#dae2fd]">Rule Engine Recommendation</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#571bc1]/80 text-[#c4abff] font-mono text-[9px] uppercase tracking-wider font-bold">
              Proactive
            </span>
          </div>
          <p className="text-xs text-[#c2c6d6] truncate mt-0.5">
            Submit Hackathon docs before 10 PM to avoid portal traffic bottlenecks.
          </p>
        </div>
      </div>

      {/* Task Cards Container */}
      <div className="flex flex-col gap-2.5">
        {filteredTasks.map((task) => {
          const isCompleted = task.status === 'completed';
          const isUrgent = task.status === 'urgent';

          return (
            <div
              key={task.id}
              className={`group relative overflow-hidden rounded-xl bg-[#171f33] p-3.5 transition-all duration-300 ${
                isCompleted
                  ? 'opacity-60 bg-[#171f33]/60 border border-white/[0.02]'
                  : isUrgent
                  ? 'shadow-[inset_0_0_0_1px_rgba(255,180,171,0.25),0_4px_20px_-4px_rgba(147,0,10,0.45)] border border-[#ffb4ab]/30'
                  : 'shadow-sm hover:shadow-md border border-white/[0.04]'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Interactive Checkbox */}
                <button
                  aria-label={`Toggle task ${task.title}`}
                  onClick={() => onToggleTask(task.id)}
                  className={`shrink-0 mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isCompleted
                      ? 'bg-[#4d8eff] text-[#00285d]'
                      : 'bg-[#060e20] text-transparent hover:bg-[#31394d]'
                  }`}
                  type="button"
                >
                  <span
                    className={`material-symbols-outlined text-[18px] transition-opacity ${
                      isCompleted ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    check
                  </span>
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-sm font-semibold truncate transition-all ${
                        isCompleted
                          ? 'line-through text-[#c2c6d6]'
                          : 'text-[#dae2fd]'
                      }`}
                    >
                      {task.title}
                    </span>

                    {/* Tag Pill */}
                    {isUrgent ? (
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#93000a] text-[#ffdad6] font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-[#ffb4ab] animate-ping"></span>
                        Urgent
                      </span>
                    ) : isCompleted ? (
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#31394d] text-[#4cd7f6] font-mono text-[10px] font-bold uppercase">
                        Archived
                      </span>
                    ) : (
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#2d3449] text-[#c2c6d6] font-mono text-[10px] font-medium uppercase">
                        {task.tag}
                      </span>
                    )}
                  </div>

                  {/* Subtitle Details */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 font-mono text-xs text-[#c2c6d6]">
                    <div
                      className={`flex items-center gap-1 font-medium ${
                        isUrgent
                          ? 'text-[#ffb4ab]'
                          : isCompleted
                          ? 'text-[#4cd7f6]/90'
                          : task.tag === 'EXAM CELL'
                          ? 'text-[#adc6ff]'
                          : 'text-[#4cd7f6]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isUrgent
                          ? 'schedule'
                          : isCompleted
                          ? 'task_alt'
                          : task.tag === 'EXAM CELL'
                          ? 'event_available'
                          : 'event'}
                      </span>
                      <span>{task.deadline}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#c2c6d6]/80">
                      <span className="material-symbols-outlined text-[15px]">
                        {isCompleted
                          ? 'forum'
                          : task.tag === 'EXAM CELL'
                          ? 'assignment'
                          : task.tag === 'FINANCE'
                          ? 'account_balance_wallet'
                          : 'attachment'}
                      </span>
                      <span className="truncate max-w-[160px]">{task.sourceCircular}</span>
                    </div>
                  </div>
                </div>

                {/* Delete button (hover/tap) */}
                <button
                  aria-label="Delete Task"
                  onClick={() => onDeleteTask(task.id)}
                  className="opacity-40 hover:opacity-100 hover:text-[#ffb4ab] p-1 text-[#c2c6d6] transition-opacity shrink-0"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Dynamic Empty State */}
        {filteredTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-2xl bg-[#131b2e]/50 border border-white/[0.04]">
            <div className="w-14 h-14 rounded-2xl bg-[#222a3d] flex items-center justify-center text-[#adc6ff] mb-3 shadow-inner">
              <span className="material-symbols-outlined text-[32px]">task</span>
            </div>
            <span className="text-base text-[#dae2fd] font-semibold">All Caught Up!</span>
            <p className="text-xs text-[#c2c6d6] mt-1 max-w-xs">
              No tasks match your active filter. Your academic horizon looks clean and on schedule.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Utility Actions */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportIcs}
            className="flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] text-xs font-semibold shadow-sm active:scale-[0.98] transition-all border border-white/[0.04]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">
              calendar_month
            </span>
            <span className="truncate">Export (.ics)</span>
          </button>
          <button
            onClick={handleCopyIncomplete}
            className="flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] text-xs font-semibold shadow-sm active:scale-[0.98] transition-all border border-white/[0.04]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#adc6ff]">
              content_copy
            </span>
            <span className="truncate">Copy Incomplete</span>
          </button>
        </div>
        <button
          onClick={onOpenClearConfirm}
          className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-[#060e20]/90 hover:bg-[#93000a]/20 text-[#c2c6d6] hover:text-[#ffb4ab] text-xs font-semibold transition-all border border-white/[0.03]"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
          <span>Clear Completed Tasks</span>
        </button>
      </div>
    </div>
  );
};
