'use client';

import Image from 'next/image';
import * as S from './style';

interface StreakCardProps {
  streakCount: number;
}

export default function StreakCard({ streakCount }: StreakCardProps) {
  return (
    <S.Container>
      <S.FireIcon>
        <Image
          src="/icons/fire.svg"
          alt="Fire icon"
          width={54}
          height={63}
        />
      </S.FireIcon>
      <S.StreakNumber>{streakCount}</S.StreakNumber>
      <S.StreakText>day streak</S.StreakText>
    </S.Container>
  );
}
