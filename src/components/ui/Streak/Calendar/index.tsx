'use client';
import Image from 'next/image';
import type { CalendarProps, CalendarDay } from '@/types/calendar';
import * as S from './style';

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const getStreakPosition = (week: CalendarDay[], index: number): 'single' | 'start' | 'middle' | 'end' | 'none' => {
  if (week[index].status !== 'streak') return 'none';

  const prevIsStreak = index > 0 && week[index - 1].status === 'streak';
  const nextIsStreak = index < week.length - 1 && week[index + 1].status === 'streak';

  if (prevIsStreak && nextIsStreak) return 'middle';
  if (prevIsStreak) return 'end';
  if (nextIsStreak) return 'start';
  return 'single';
};

export default function Calendar({
  month,
  year,
  days,
  onPrevMonth,
  onNextMonth
}: CalendarProps) {
  return (
    <S.Container>
      <S.Header>
        <S.NavButton onClick={onPrevMonth}>
          <Image src="/icons/chevron-left.svg" alt="Previous" width={8} height={18} />
        </S.NavButton>
        <S.MonthYear>{month} {year}</S.MonthYear>
        <S.NavButton onClick={onNextMonth}>
          <Image src="/icons/chevron-right.svg" alt="Next" width={8} height={18} />
        </S.NavButton>
      </S.Header>

      <S.WeekdayRow>
        {WEEKDAYS.map((day) => (
          <S.Weekday key={day}>{day}</S.Weekday>
        ))}
      </S.WeekdayRow>

      <S.DaysGrid>
        {days.map((week, weekIndex) => (
          <S.WeekRow key={weekIndex}>
            {week.map((day, dayIndex) => {
              const streakPos = getStreakPosition(week, dayIndex);
              return (
                <S.DayCellWrapper key={dayIndex} streakPosition={streakPos}>
                  <S.DayCell status={day.status}>
                    {day.status === 'streak' && (
                      <S.StreakIcon>
                        <Image src="/icons/fire.svg" alt="Streak" width={17} height={17} />
                      </S.StreakIcon>
                    )}
                  </S.DayCell>
                </S.DayCellWrapper>
              );
            })}
          </S.WeekRow>
        ))}
      </S.DaysGrid>
    </S.Container>
  );
}
