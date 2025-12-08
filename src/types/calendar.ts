export type DayStatus = 'completed' | 'missed' | 'streak' | 'current' | 'empty';

export interface CalendarDay {
  day: number;
  status: DayStatus;
  date?: string; // YYYY-MM-DD
}

export interface CalendarProps {
  month: string;
  year: number;
  days: CalendarDay[][];
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

// 서버 응답 타입
export interface StreakResponse {
  dates: string[]; // ["2025-11-25", "2025-11-26", ...]
}
