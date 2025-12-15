'use client';

import Image from 'next/image';
import * as S from './style';

interface ChatBubbleProps {
    message: string;
    isAI?: boolean;
    isPlaying?: boolean;
    onSpeak?: () => void;
    onTranslate?: () => void;
}

// 괄호로 묶인 시나리오 설명과 본문을 분리하는 함수
function parseScenarioMessage(message: string) {
    const scenarioMatch = message.match(/^\(([^)]+)\)\s*/);

    if (scenarioMatch) {
        const description = scenarioMatch[1]; // 괄호 제거, 내용만
        const content = message.slice(scenarioMatch[0].length).trim();
        return { description, content };
    }

    return { description: null, content: message };
}

export default function ChatBubble({
    message,
    isAI = false,
    isPlaying = false,
    onSpeak,
    onTranslate,
}: ChatBubbleProps) {
    const isTyping = message === '';
    const { description, content } = parseScenarioMessage(message);

    return (
        <S.MessageWrapper isAI={isAI}>
            <S.MessageBubble isAI={isAI}>
                {isTyping ? (
                    <S.TypingIndicator>...</S.TypingIndicator>
                ) : (
                    <>
                        {description && isAI && (
                            <S.ScenarioDescription>{description}</S.ScenarioDescription>
                        )}
                        <S.MessageContent>{content}</S.MessageContent>
                    </>
                )}
                {isAI && !isTyping && (
                    <S.MessageActions>
                        <S.ActionButton
                            onClick={onSpeak}
                            aria-label="Listen"
                            disabled={isPlaying}
                        >
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

