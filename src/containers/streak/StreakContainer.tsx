'use client';

import { useMemo } from 'react';
import { StreakCard, Calendar } from '@/components/ui/Streak';
import { calculateCurrentStreak } from '@/utils/calendar';
import { useStreak } from '@/hooks/useStreak';
import * as S from './style';

export default function StreakContainer() {
  const { data, isLoading } = useStreak();

  const completedDates = data?.completedDates ?? [];

  const currentStreak = useMemo(() => {
    return calculateCurrentStreak(completedDates);
  }, [completedDates]);

  if (isLoading) {
    return (
      <S.Container>
        <S.Content>
          <S.CardSection>
            <StreakCard streakCount={0} />
            <Calendar completedDates={[]} />
          </S.CardSection>
        </S.Content>
      </S.Container>
    );
  }

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
