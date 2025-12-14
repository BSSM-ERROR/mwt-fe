export type DayStatus = 'completed' | 'missed' | 'streak' | 'current' | 'empty';

export interface CalendarDay {
  day: number;
  status: DayStatus;
  date?: string;
  isToday?: boolean;
}

export interface CalendarProps {
  completedDates: string[];
}

export interface StreakResponse {
  dates: string[];
}
