'use client';

import Image from 'next/image';
import * as S from './style';

interface SelectCardProps {
    tag: string;
    title: string;
    description: string;
    onClick?: () => void;
}

export default function SelectCard({
    tag,
    title,
    description,
    onClick,
}: SelectCardProps) {
    return (
        <S.Container onClick={onClick}>
            <S.TextContainer>
                <S.Tag>{tag}</S.Tag>
                <S.Title>{title}</S.Title>
                <S.Description>{description}</S.Description>
            </S.TextContainer>
            <S.IconWrapper>
                <Image src="/icons/arrow.svg" alt="arrow" width={24} height={24} />
            </S.IconWrapper>
        </S.Container>
    );
}

