import React from 'react';
import { CampusAlert } from '../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  alerts: CampusAlert[];
  onClose: () => void;
  onSelectAlert: (alert: CampusAlert) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  alerts,
  onClose,
  onSelectAlert,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#060e20]/80 backdrop-blur-sm">
      <div className="w-full max-w-sm h-full bg-[#131b2e] p-5 shadow-2xl flex flex-col border-l border-white/[0.08] animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4cd7f6]/20 text-[#4cd7f6] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">notifications_active</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#dae2fd]">Campus Alerts</h3>
              <span className="font-mono text-[10px] text-[#4cd7f6]">
                Direct feed from university portal
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#c2c6d6] hover:text-[#dae2fd] p-1"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex items-center justify-between py-2.5">
          <span className="font-mono text-xs text-[#c2c6d6]">
            {alerts.filter((a) => a.unread).length} Unread Broadcasts
          </span>
          <button
            onClick={onMarkAllAsRead}
            className="text-[11px] font-mono text-[#adc6ff] hover:underline"
            type="button"
          >
            Mark all read
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 my-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => onSelectAlert(alert)}
              className={`p-3 rounded-xl cursor-pointer transition-all border ${
                alert.unread
                  ? 'bg-[#171f33] border-[#4cd7f6]/30 shadow-sm'
                  : 'bg-[#171f33]/50 border-white/[0.02] opacity-75'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-mono text-[10px] text-[#4cd7f6] uppercase font-semibold">
                  {alert.department}
                </span>
                <span className="font-mono text-[10px] text-[#c2c6d6]">{alert.timeAgo}</span>
              </div>
              <h4 className="text-xs font-semibold text-[#dae2fd]">{alert.title}</h4>
              <p className="text-[11px] text-[#c2c6d6] mt-1 line-clamp-2 leading-relaxed">
                {alert.preview}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#adc6ff] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                  Click to Parse in Analyzer
                </span>
                {alert.urgent && (
                  <span className="px-1.5 py-0.2 rounded bg-[#ffb4ab]/20 text-[#ffb4ab] text-[9px] font-mono font-bold uppercase">
                    Urgent
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
