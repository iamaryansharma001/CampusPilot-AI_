/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActionItem, CampusAlert, ParsedNotice, Task } from './types';
import {
  getStoredAlerts,
  getStoredNotices,
  getStoredTasks,
  saveStoredAlerts,
  saveStoredNotices,
  saveStoredTasks,
} from './utils/storage';
import { Header } from './components/Header';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { AnalyzerView } from './components/AnalyzerView';
import { TasksView } from './components/TasksView';
import { SavedView } from './components/SavedView';
import { QuickAddModal } from './components/QuickAddModal';
import { SafetyModal } from './components/SafetyModal';
import { OriginalNoticeModal } from './components/OriginalNoticeModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('analyzer');

  // Application Data States (Synced to browser localStorage)
  const [tasks, setTasks] = useState<Task[]>(() => getStoredTasks());
  const [savedNotices, setSavedNotices] = useState<ParsedNotice[]>(() => getStoredNotices());
  const [alerts, setAlerts] = useState<CampusAlert[]>(() => getStoredAlerts());

  // Modal Dialog States
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [originalNoticeModal, setOriginalNoticeModal] = useState<{
    isOpen: boolean;
    rawText: string;
    title: string;
  }>({
    isOpen: false,
    rawText: '',
    title: '',
  });

  // Ephemeral Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence Effects
  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveStoredNotices(savedNotices);
  }, [savedNotices]);

  useEffect(() => {
    saveStoredAlerts(alerts);
  }, [alerts]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((cur) => (cur === message ? null : cur));
    }, 2800);
  };

  // --- Task Actions ---
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isCompleted = t.status === 'completed';
          const nextStatus = isCompleted ? t.originalStatus || 'pending' : 'completed';
          showToast(isCompleted ? 'Task restored to pending' : 'Task completed! +15 XP');
          return {
            ...t,
            status: nextStatus,
            completedAt: !isCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Task removed from Action Center');
  };

  const handleClearCompleted = () => {
    const remaining = tasks.filter((t) => t.status !== 'completed');
    setTasks(remaining);
    setIsSafetyModalOpen(false);
    showToast('Cleared all completed tasks');
  };

  const handleAddNewTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setIsQuickAddOpen(false);
    showToast(`Added: ${newTask.title}`);
  };

  // --- Save Extracted Actions from Analyzer to My Tasks ---
  const handleSaveTasksToCenter = (items: ActionItem[], noticeTitle: string) => {
    if (items.length === 0) {
      showToast('No actionable items to save');
      return;
    }

    const newTasks: Task[] = items.map((item, idx) => ({
      id: `task-${Date.now()}-${idx}`,
      title: item.text,
      status: item.urgent ? 'urgent' : item.completed ? 'completed' : 'pending',
      originalStatus: item.urgent ? 'urgent' : 'pending',
      tag: item.tag || 'EXTRACTED',
      deadline: item.deadline || 'Pending review',
      sourceCircular: noticeTitle || 'Circular Notice',
      note: item.note,
      createdAt: new Date().toISOString(),
      completedAt: item.completed ? new Date().toISOString() : undefined,
    }));

    setTasks((prev) => [...newTasks, ...prev]);
    showToast(`Saved ${newTasks.length} tasks to Action Center!`);
    setActiveTab('tasks');
  };

  // --- Saved Notices & Archive Actions ---
  const handleDeleteSavedNotice = (noticeId: string) => {
    setSavedNotices((prev) => prev.filter((n) => n.id !== noticeId));
    showToast('Notice removed from archive');
  };

  const handleSelectNoticeForAnalyzer = (_notice: ParsedNotice) => {
    setActiveTab('analyzer');
    showToast('Loaded notice into Analyzer');
  };

  // --- Notifications Drawer Actions ---
  const handleSelectAlert = (alert: CampusAlert) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alert.id ? { ...a, unread: false } : a))
    );
    setIsNotificationsOpen(false);
    setActiveTab('analyzer');
    showToast(`Opened: ${alert.title}`);
  };

  const handleMarkAllAlertsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, unread: false })));
    showToast('All notifications marked as read');
  };

  // Counts
  const pendingTasksCount = tasks.filter(
    (t) => t.status === 'pending' || t.status === 'urgent'
  ).length;
  const urgentCount = tasks.filter((t) => t.status === 'urgent').length;
  const unreadAlertsCount = alerts.filter((a) => a.unread).length;
  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;

  const tabTitles: Record<ActiveTab, string> = {
    analyzer: 'Notice Analyzer & Rule Engine',
    tasks: 'My Action Center',
    saved: 'Circulars & Archive',
  };

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] antialiased flex flex-col min-h-screen selection:bg-[#adc6ff] selection:text-[#002e6a] relative">
      {/* Ambient Depth Background Spheres */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#4d8eff]/12 blur-[120px]" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-[#009eb9]/12 blur-[100px]" />
        <div className="absolute -bottom-20 left-1/4 w-80 h-80 rounded-full bg-[#571bc1]/15 blur-[120px]" />
      </div>

      {/* Top Header */}
      <Header
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onShowLanding={() => setActiveTab('analyzer')}
        activeTabTitle={tabTitles[activeTab]}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1 flex flex-col relative w-full max-w-4xl mx-auto px-4 pt-20 sm:pt-24 z-10">
        {activeTab === 'analyzer' && (
          <AnalyzerView
            onSaveTasksToCenter={handleSaveTasksToCenter}
            onViewOriginalNotice={(text, title) =>
              setOriginalNoticeModal({ isOpen: true, rawText: text, title })
            }
            showToast={showToast}
            pendingTasksCount={pendingTasksCount}
            totalParsedCount={savedNotices.length + 8}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onOpenClearConfirm={() => setIsSafetyModalOpen(true)}
            showToast={showToast}
          />
        )}

        {activeTab === 'saved' && (
          <SavedView
            savedNotices={savedNotices}
            onSelectNoticeForAnalyzer={handleSelectNoticeForAnalyzer}
            onViewOriginalNotice={(text, title) =>
              setOriginalNoticeModal({ isOpen: true, rawText: text, title })
            }
            onDeleteSavedNotice={handleDeleteSavedNotice}
            onNavigateToAnalyzer={() => setActiveTab('analyzer')}
            showToast={showToast}
          />
        )}
      </main>

      {/* Floating Liquid Glass Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingTasksCount={pendingTasksCount}
        savedNoticesCount={savedNotices.length}
      />

      {/* Modals & Dialogs */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTask={handleAddNewTask}
      />

      <SafetyModal
        isOpen={isSafetyModalOpen}
        completedCount={completedTasksCount}
        onCancel={() => setIsSafetyModalOpen(false)}
        onConfirm={handleClearCompleted}
      />

      <OriginalNoticeModal
        isOpen={originalNoticeModal.isOpen}
        title={originalNoticeModal.title}
        rawText={originalNoticeModal.rawText}
        onClose={() => setOriginalNoticeModal({ isOpen: false, rawText: '', title: '' })}
        onCopy={() => {
          navigator.clipboard?.writeText(originalNoticeModal.rawText);
          showToast('Raw notice text copied to clipboard!');
        }}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        alerts={alerts}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectAlert={handleSelectAlert}
        onMarkAllAsRead={handleMarkAllAlertsRead}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        urgentCount={urgentCount}
        pendingCount={pendingTasksCount}
      />

      {/* Feedback Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="px-4 py-2 rounded-full bg-[#171f33]/90 text-[#dae2fd] text-xs font-mono shadow-2xl border border-white/[0.08] backdrop-blur-xl flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
