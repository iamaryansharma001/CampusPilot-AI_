import { CampusAlert, ParsedNotice, Task } from '../types';
import { SAMPLE_1_TEXT, SAMPLE_2_TEXT } from './ruleEngine';

const STORAGE_KEY_TASKS = 'campuspilot_tasks_v2';
const STORAGE_KEY_SAVED_NOTICES = 'campuspilot_saved_notices_v2';
const STORAGE_KEY_NOTIFICATIONS = 'campuspilot_notifications_v2';

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Submit Hackathon Registration Form',
    status: 'urgent',
    originalStatus: 'urgent',
    tag: 'URGENT',
    deadline: 'Tomorrow, 11:59 PM',
    sourceCircular: 'AI Workshop Notice',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Pay ₹200 registration fee to Accounts',
    status: 'pending',
    originalStatus: 'pending',
    tag: 'FINANCE',
    deadline: 'April 14, 2025',
    sourceCircular: 'AI Workshop Notice',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Verify Hall Ticket & Internal Marks',
    status: 'pending',
    originalStatus: 'pending',
    tag: 'EXAM CELL',
    deadline: 'April 20, 2025',
    sourceCircular: 'Exam Cell Circular #89',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Join Official WhatsApp/Discord Group',
    status: 'completed',
    originalStatus: 'pending',
    tag: 'ARCHIVED',
    deadline: 'Completed today',
    sourceCircular: 'Freshers Induction',
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
];

export const INITIAL_SAVED_NOTICES: ParsedNotice[] = [
  {
    id: 'saved-1',
    title: 'Maths Tutorial Sheet #4 (Linear Algebra & SVD)',
    department: 'Department of Applied Mathematics & Computing',
    rawText: SAMPLE_1_TEXT,
    event: 'Maths Sheet: Tutorial 4 (Linear Algebra & SVD)',
    venue: 'Cabin 214, Ramanujan Block & Math Lab',
    deadline: 'Friday, 4:00 PM IST • Hard Deadline',
    fees: 'CSAIML Section • Roll: CSAIML-061 • Mandatory Submission',
    ruleRecommendation: 'Submit before 2 PM on Friday to avoid corridor queues at Cabin 214.',
    confidence: 100,
    parsedAt: '2025-04-10T09:00:00Z',
    engineUsed: 'local',
    actionItems: [
      {
        id: 'item-1',
        text: 'Fill Google Form link & upload student ID scan',
        tag: 'Required Step',
        deadline: 'by April 14',
        completed: true,
        urgent: true,
      },
      {
        id: 'item-2',
        text: 'Pay ₹200 via UPI to Accounts Dept and note Ref Number',
        tag: 'Fee Payment',
        note: 'Attach screenshot',
        completed: false,
      },
      {
        id: 'item-3',
        text: 'Submit team details (2-4 members) to Prof. R. Sharma',
        tag: 'Team Formation',
        note: 'Min 2, Max 4',
        completed: false,
      },
      {
        id: 'item-4',
        text: 'Carry personal laptop with VS Code and Python 3.10+ installed',
        tag: 'Hardware Prep',
        note: 'Bring chargers',
        completed: false,
      },
    ],
  },
  {
    id: 'saved-2',
    title: 'End Semester Theory Examinations (Even 2024-25)',
    department: 'Academic Cell - Examination Division',
    rawText: SAMPLE_2_TEXT,
    event: 'End Semester Theory Examinations 2024-25',
    venue: 'Academic Cell Block-B & Exam Center',
    deadline: 'April 20, 2025 • Fee Clearance Deadline',
    fees: 'Undergraduate & PG Scholars • Tuition & Lab Dues',
    ruleRecommendation: 'Verify ERP subject codes before 5 PM; database sync is nightly.',
    confidence: 100,
    parsedAt: '2025-04-11T11:30:00Z',
    engineUsed: 'local',
    actionItems: [
      {
        id: 'item-exam-1',
        text: 'Clearance of pending tuition and laboratory dues before April 20 at Finance Counter',
        tag: 'Finance Clearance',
        deadline: 'by April 20',
        completed: false,
        urgent: true,
      },
      {
        id: 'item-exam-2',
        text: 'Submit attendance shortfall condonation application to HOD if below 75%',
        tag: 'Academic Cell',
        deadline: 'before April 16',
        completed: false,
        urgent: true,
      },
    ],
  },
];

export const INITIAL_ALERTS: CampusAlert[] = [
  {
    id: 'alert-1',
    title: 'Hall Ticket Issue Schedule Released',
    department: 'Exam Cell',
    timeAgo: '12m ago',
    unread: true,
    urgent: true,
    preview: 'Block-B counter will begin distribution from April 22 upon showing clearance slip.',
    rawText: SAMPLE_2_TEXT,
  },
  {
    id: 'alert-2',
    title: 'GenAI Bootcamp Registrations Closing Soon',
    department: 'Dept of CSE',
    timeAgo: '2h ago',
    unread: true,
    urgent: true,
    preview: 'Only 18 seats remaining for the 2-day hands-on workshop in Audi-3 Kalam Block.',
    rawText: SAMPLE_1_TEXT,
  },
  {
    id: 'alert-3',
    title: 'Library Extended Hours for End-Sem Prep',
    department: 'Central Library',
    timeAgo: '1d ago',
    unread: false,
    urgent: false,
    preview: 'Digital Reference Section will remain open 24x7 starting April 16 with biometric entry.',
    rawText: 'Central Library will operate 24 hours during exam week. Please bring student ID card.',
  },
];

export function getStoredTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TASKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TASKS;
  }
}

export function saveStoredTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
}

export function getStoredNotices(): ParsedNotice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_NOTICES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SAVED_NOTICES, JSON.stringify(INITIAL_SAVED_NOTICES));
      return INITIAL_SAVED_NOTICES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SAVED_NOTICES;
  }
}

export function saveStoredNotices(notices: ParsedNotice[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_NOTICES, JSON.stringify(notices));
  } catch (e) {
    console.error('Failed to save notices', e);
  }
}

export function getStoredAlerts(): CampusAlert[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(INITIAL_ALERTS));
      return INITIAL_ALERTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ALERTS;
  }
}

export function saveStoredAlerts(alerts: CampusAlert[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(alerts));
  } catch (e) {
    console.error('Failed to save alerts', e);
  }
}
