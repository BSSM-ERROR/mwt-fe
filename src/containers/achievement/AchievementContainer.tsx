'use client';

import { AchievementItem } from '@/components/ui/Achievement';
import { useMissions } from "@/hooks/useMission";
import { Mission } from "@/types/mission";
import * as S from './style'

const ICONS: Record<string, string> = {
  "쓰담쓰담": "/icons/achievement/target.svg",
  "오늘 완료 미션": "/icons/achievement/paper-quill.svg",
};

const mapMissionToAchievement = (mission: Mission) => {
  const icon = ICONS[mission.title] ?? "/icons/achievement/fire.svg";
  return {
    id: mission.id,
    icon,
    title: mission.title,
    description: mission.description,
    points: mission.reward,
    current: mission.did_count,
    total: mission.total_count,
    isCompleted: !!mission.status,
  };
};

export default function AchievementContainer() {
  const { data, isLoading, error } = useMissions();
  const achievements = (data ?? []).map(mapMissionToAchievement);

  return (
    <S.Wrapper>
      <S.Container>
        <S.Title>도전과제</S.Title>
        {isLoading && <div>불러오는 중...</div>}
        {error && <div>도전과제를 불러오지 못했어요.</div>}
        {!isLoading && !error && (
          <S.List>
            {achievements.map((achievement) => (
              <AchievementItem
                key={achievement.id}
                icon={achievement.icon}
                title={achievement.title}
                description={achievement.description}
                points={achievement.points}
                current={achievement.current}
                total={achievement.total}
                disabled={!achievement.isCompleted}
              />
            ))}
          </S.List>
        )}
      </S.Container>
    </S.Wrapper>
  );
}
