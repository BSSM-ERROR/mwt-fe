'use client';

import { useState, useMemo } from 'react';
import { StreakCard, Calendar } from '@/components/ui/Streak';
import { calculateCurrentStreak } from '@/utils/calendar';
import * as S from './style';

const MOCK_COMPLETED_DATES = [
  '2025-11-01',
  '2025-11-02',
  '2025-11-03',
  '2025-12-01',
  '2025-12-02',
  '2025-12-03',
  '2025-12-08',
  '2025-12-09',
];

export default function StreakContainer() {
  const [completedDates] = useState<string[]>(MOCK_COMPLETED_DATES);

  const currentStreak = useMemo(() => {
    return calculateCurrentStreak(completedDates);
  }, [completedDates]);

  return (
    <S.Container>
      <S.Content>
        <S.CardSection>
          <StreakCard streakCount={currentStreak} />
          <Calendar completedDates={completedDates} />
        </S.CardSection>
      </S.Content>
    </S.Container>
  );
}
