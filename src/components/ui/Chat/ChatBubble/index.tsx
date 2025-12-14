'use client';

import Image from 'next/image';
import * as S from './style';

interface ChatBubbleProps {
    message: string;
    isAI?: boolean;
    onSpeak?: () => void;
    onTranslate?: () => void;
}

export default function ChatBubble({
    message,
    isAI = false,
    onSpeak,
    onTranslate,
}: ChatBubbleProps) {
    const isTyping = message === '';

    return (
        <S.MessageWrapper isAI={isAI}>
            <S.MessageBubble isAI={isAI}>
                {isTyping ? <S.TypingIndicator>...</S.TypingIndicator> : message}
                {isAI && !isTyping && (
                    <S.MessageActions>
                        <S.ActionButton onClick={onSpeak} aria-label="Listen">
                            <Image src="/icons/speaker.svg" alt="speaker" width={20} height={20} />
                        </S.ActionButton>
                        <S.ActionButton onClick={onTranslate} aria-label="Translate">
                            <Image src="/icons/translate.svg" alt="translate" width={20} height={20} />
                        </S.ActionButton>
                    </S.MessageActions>
                )}
            </S.MessageBubble>
        </S.MessageWrapper>
    );
}

