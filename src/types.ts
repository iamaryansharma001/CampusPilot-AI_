export type TaskStatus = 'pending' | 'urgent' | 'completed';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  originalStatus?: TaskStatus;
  tag: string;
  deadline: string;
  deadlineDate?: string;
  sourceCircular: string;
  note?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ActionItem {
  id: string;
  text: string;
  tag: string;
  deadline?: string;
  note?: string;
  completed: boolean;
  urgent?: boolean;
}

export interface ParsedNotice {
  id: string;
  title: string;
  department?: string;
  rawText: string;
  event: string;
  venue: string;
  deadline: string;
  fees: string;
  actionItems: ActionItem[];
  ruleRecommendation?: string;
  confidence: number;
  parsedAt: string;
  engineUsed: 'local' | 'gemini';
}

export interface PresetSample {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  text: string;
  parsedData: {
    event: string;
    venue: string;
    deadline: string;
    fees: string;
    actionItems: ActionItem[];
    ruleRecommendation: string;
  };
}

export interface CampusAlert {
  id: string;
  title: string;
  department: string;
  timeAgo: string;
  unread: boolean;
  urgent: boolean;
  preview: string;
  rawText: string;
}
