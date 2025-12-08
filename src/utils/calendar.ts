import type { CalendarDay, DayStatus } from '@/types/calendar';

export function generateCalendarDays(
  completedDates: string[],
  year: number,
  month: number,
  streakThreshold: number = 2
): CalendarDay[][] {
  const today = new Date();
  const todayStr = formatDate(today);

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  let firstDayWeekday = firstDayOfMonth.getDay() - 1;
  if (firstDayWeekday < 0) firstDayWeekday = 6;

  const completedSet = new Set(completedDates);

  const streakDates = findStreakDates(completedDates, streakThreshold);

  const weeks: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];

  for (let i = 0; i < firstDayWeekday; i++) {
    currentWeek.push({ day: 0, status: 'empty' });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(new Date(year, month, day));
    let status: DayStatus = 'empty';

    if (dateStr === todayStr) {
      status = 'current';
    } else if (streakDates.has(dateStr)) {
      status = 'streak';
    } else if (completedSet.has(dateStr)) {
      status = 'completed';
    }

    currentWeek.push({ day, status, date: dateStr });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push({ day: 0, status: 'empty' });
  }
  if (currentWeek.length === 7) {
    weeks.push(currentWeek);
  }

  return weeks;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function findStreakDates(dates: string[], threshold: number): Set<string> {
  if (dates.length === 0) return new Set();

  const sortedDates = [...dates].sort();
  const streakDates = new Set<string>();

  let currentStreak: string[] = [sortedDates[0]];

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);

    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak.push(sortedDates[i]);
    } else {
      if (currentStreak.length >= threshold) {
        currentStreak.forEach(date => streakDates.add(date));
      }
      currentStreak = [sortedDates[i]];
    }
  }

  if (currentStreak.length >= threshold) {
    currentStreak.forEach(date => streakDates.add(date));
  }

  return streakDates;
}

export function calculateCurrentStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sortedDates = [...dates]
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  let checkDate = today;

  const latestDate = sortedDates[0];
  latestDate.setHours(0, 0, 0, 0);

  const diffFromToday = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffFromToday > 1) return 0;

  for (const date of sortedDates) {
    date.setHours(0, 0, 0, 0);
    const diff = Math.floor((checkDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 0 || diff === 1) {
      streak++;
      checkDate = date;
    } else {
      break;
    }
  }

  return streak;
}