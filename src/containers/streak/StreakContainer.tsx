'use client';

import { useState, useMemo } from 'react';
import { StreakCard, Calendar } from '@/components/ui/Streak';
import { generateCalendarDays, calculateCurrentStreak } from '@/utils/calendar';
import * as S from './style';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const MOCK_COMPLETED_DATES = [
  '2025-12-01',
  '2025-12-02',
  '2025-12-03',
  '2025-12-04',
  '2025-12-05',
];

export default function StreakContainer() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const [completedDates] = useState<string[]>(MOCK_COMPLETED_DATES);

  const days = useMemo(() => {
    return generateCalendarDays(completedDates, year, month, 2);
  }, [completedDates, year, month]);

  const currentStreak = useMemo(() => {
    return calculateCurrentStreak(completedDates);
  }, [completedDates]);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <S.Container>
      <S.Content>
        <S.CardSection>
          <StreakCard streakCount={currentStreak} />
          <Calendar
            month={MONTHS[month]}
            year={year}
            days={days}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        </S.CardSection>
      </S.Content>
    </S.Container>
  );
}
