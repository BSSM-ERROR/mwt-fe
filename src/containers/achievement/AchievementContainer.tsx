'use client';

import { AchievementItem } from '@/components/ui/Achievement';
import * as S from './style'

const MOCK_ACHIEVEMENTS = [
    {
        id: 1,
        icon: '/icons/achievement/target.svg',
        title: '쓰담쓰담',
        description: '세리나 한번 쓰다듬기',
        points: 30,
        current: 1,
        total: 1,
        isCompleted: true,
    },
    {
        id: 2,
        icon: '/icons/achievement/fire.svg',
        title: '앗 뜨거!',
        description: '스트릭 7일 달성',
        points: 60,
        current: 3,
        total: 7,
        isCompleted: false,
    },
    {
        id: 3,
        icon: '/icons/achievement/paper-quill.svg',
        title: '오. 공. 완.',
        description: '오늘 레슨 완료하기',
        points: 30,
        current: 1,
        total: 1,
        isCompleted: true,
    },
    {
        id: 4,
        icon: '/icons/achievement/cart.svg',
        title: '한 바구니만 더...',
        description: '추가 스테미너 구매하기',
        points: 50,
        current: 1,
        total: 1,
        isCompleted: true,
    },
];

export default function AchievementContainer() {
    return (
        <S.Wrapper>
            <S.Container>
                <S.Title>도전과제</S.Title>
                <S.List>
                    {MOCK_ACHIEVEMENTS.map((achievement) => (
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
            </S.Container>
        </S.Wrapper>
    );
}
