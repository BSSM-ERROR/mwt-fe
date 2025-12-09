import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  differenceInCalendarDays,
  startOfToday,
  parseISO,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import type { CalendarDay, DayStatus } from '@/types/calendar';

export type StreakPosition = 'single' | 'start' | 'middle' | 'end' | 'none';

export const getWeekdays = (): string[] =>
  eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  }).map((day) => format(day, 'EEE').toUpperCase());

export const getStreakPosition = (week: CalendarDay[], index: number): StreakPosition => {
  if (week[index].status !== 'streak') return 'none';

  const prev = index > 0 && week[index - 1].status === 'streak';
  const next = index < 6 && week[index + 1].status === 'streak';

  if (prev && next) return 'middle';
  if (prev) return 'end';
  if (next) return 'start';
  return 'single';
};

export function generateCalendarDays(
  completedDates: string[],
  year: number,
  month: number,
  streakThreshold = 2
): CalendarDay[][] {
  const today = startOfToday();
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(monthStart);
  const startPadding = (getDay(monthStart) + 6) % 7;

  const completedSet = new Set(completedDates);
  const streakSet = getStreakDates(completedDates, streakThreshold);

  const allDays: CalendarDay[] = [
    ...Array(startPadding).fill({ day: 0, status: 'empty' as DayStatus }),
    ...eachDayOfInterval({ start: monthStart, end: monthEnd }).map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const isToday = isSameDay(date, today);
      const isStreak = streakSet.has(dateStr);
      const isCompleted = completedSet.has(dateStr);

      const status: DayStatus = isStreak
        ? 'streak'
        : isToday
          ? 'current'
          : isCompleted
            ? 'completed'
            : 'empty';

      return { day: date.getDate(), status, date: dateStr, isToday };
    }),
  ];

  const endPadding = (7 - (allDays.length % 7)) % 7;
  allDays.push(...Array(endPadding).fill({ day: 0, status: 'empty' as DayStatus }));

  return Array.from({ length: allDays.length / 7 }, (_, i) =>
    allDays.slice(i * 7, i * 7 + 7)
  );
}

function getStreakDates(dates: string[], threshold: number): Set<string> {
  if (dates.length < threshold) return new Set();

  const sorted = [...dates].sort();
  const result = new Set<string>();
  let streak = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const diff = differenceInCalendarDays(parseISO(sorted[i]), parseISO(sorted[i - 1]));

    if (diff === 1) {
      streak.push(sorted[i]);
    } else {
      if (streak.length >= threshold) streak.forEach((d) => result.add(d));
      streak = [sorted[i]];
    }
  }

  if (streak.length >= threshold) streak.forEach((d) => result.add(d));
  return result;
}

export function calculateCurrentStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const today = startOfToday();
  const sorted = [...dates].map((d) => parseISO(d)).sort((a, b) => b.getTime() - a.getTime());
  const latest = sorted[0];

  if (differenceInCalendarDays(today, latest) > 1) return 0;

  let streak = 0;
  let check = today;

  for (const date of sorted) {
    const diff = differenceInCalendarDays(check, date);
    if (diff <= 1) {
      streak++;
      check = date;
    } else break;
  }

  return streak;
}