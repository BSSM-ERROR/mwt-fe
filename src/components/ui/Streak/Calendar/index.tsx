'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { format, addMonths, subMonths } from 'date-fns';
import type { CalendarProps } from '@/types/calendar';
import { generateCalendarDays, getWeekdays, getStreakPosition } from '@/utils/calendar';
import * as S from './style';

export default function Calendar({ completedDates }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekdays = useMemo(() => getWeekdays(), []);

  const days = useMemo(() => {
    return generateCalendarDays(
      completedDates,
      currentDate.getFullYear(),
      currentDate.getMonth(),
      2
    );
  }, [completedDates, currentDate]);

  return (
    <S.Container>
      <S.Header>
        <S.NavButton onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
          <Image src="/icons/chevron-left.svg" alt="Previous" width={8} height={18} />
        </S.NavButton>
        <S.MonthYear>{format(currentDate, 'MMM yyyy').toUpperCase()}</S.MonthYear>
        <S.NavButton onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
          <Image src="/icons/chevron-right.svg" alt="Next" width={8} height={18} />
        </S.NavButton>
      </S.Header>

      <S.WeekdayRow>
        {weekdays.map((day) => (
          <S.Weekday key={day}>{day}</S.Weekday>
        ))}
      </S.WeekdayRow>

      <S.DaysGrid>
        {days.map((week, weekIndex) => (
          <S.WeekRow key={weekIndex}>
            {week.map((day, dayIndex) => (
              <S.DayCellWrapper key={dayIndex} streakPosition={getStreakPosition(week, dayIndex)}>
                <S.DayCell status={day.status} isToday={day.isToday}>
                  {day.status === 'streak' && (
                    <S.StreakIcon>
                      <Image src="/icons/fire.svg" alt="Streak" width={17} height={17} />
                    </S.StreakIcon>
                  )}
                </S.DayCell>
              </S.DayCellWrapper>
            ))}
          </S.WeekRow>
        ))}
      </S.DaysGrid>
    </S.Container>
  );
}
