'use client';

import Image from 'next/image';
import * as S from './style';

interface AchievementItemProps {
    icon: string;
    title: string;
    description: string;
    points: number;
    current: number;
    total: number;
    disabled?: boolean;
}

export default function AchievementItem({
    icon,
    title,
    description,
    points,
    current,
    total,
    disabled = false,
}: AchievementItemProps) {
    return (
        <S.Container disabled={disabled}>
            <S.IconWrapper disabled={disabled}>
                <Image src={icon} alt={title} width={48} height={48} />
            </S.IconWrapper>
            <S.Content>
                <S.Title>{title}</S.Title>
                <S.DescriptionWrapper>
                    <S.Description>{description}</S.Description>
                    <S.Progress>({current}/{total})</S.Progress>
                </S.DescriptionWrapper>
            </S.Content>
            <S.Points>
                <Image
                    src={disabled ? '/icons/candy/black-candy.svg' : '/icons/candy/colored-candy.svg'}
                    alt="candy"
                    width={20}
                    height={20}
                />
                <S.Plus $disabled={disabled}>+</S.Plus>
                <S.PointValue $disabled={disabled}>{points}</S.PointValue>
            </S.Points>
        </S.Container>
    );
}
