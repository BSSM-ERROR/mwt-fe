'use client';

import { ReactNode } from 'react';
import * as S from './style';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: ReactNode;
    children: ReactNode;
}

export default function BottomSheet({
    isOpen,
    onClose,
    title,
    children,
}: BottomSheetProps) {
    if (!isOpen) return null;

    return (
        <S.Overlay onClick={onClose}>
            <S.Container onClick={(e) => e.stopPropagation()}>
                <S.Handle onClick={onClose} />
                <S.Title>{title}</S.Title>
                <S.ListContainer>{children}</S.ListContainer>
            </S.Container>
        </S.Overlay>
    );
}

export { Highlight } from './style';
