'use client';

import Image from 'next/image';
import { Fragment } from 'react';
import * as S from './style';

interface ChatBubbleProps {
    message: string;
    isAI?: boolean;
    isPlaying?: boolean;
    onSpeak?: () => void;
    onTranslate?: () => void;
}

// 괄호로 묶인 텍스트를 파싱하여 스타일링 적용
const formatMessage = (text: string) => {
    const parts = text.split(/(\([^)]+\))/g);
    return parts.map((part, index) => {
        if (part.startsWith('(') && part.endsWith(')')) {
            // 괄호가 첫 번째 요소이거나, 그 앞의 요소가 공백뿐인 경우 (즉, 채팅버블의 시작인 경우)
            // 위에 줄바꿈을 하지 않음
            const isFirst = index === 0 || (index === 1 && parts[0].trim() === '');
            
            return (
                <Fragment key={index}>
                    {!isFirst && <br />}
                    <S.ScenarioText>{part.slice(1, -1)}</S.ScenarioText>
                    <br />
                </Fragment>
            );
        }
        return part;
    });
};

// Q. 부분 분리
function parseScenarioMessage(message: string) {
    const questionMatch = message.match(/^(.*?)(Q\..*)$/s);

    if (questionMatch) {
        const beforeQuestion = questionMatch[1].trim();
        const questionPart = questionMatch[2].trim();

        return {
            beforeQuestion: beforeQuestion || null,
            question: questionPart,
            content: null
        };
    }

    return { beforeQuestion: null, question: null, content: message };
}

export default function ChatBubble({
    message,
    isAI = false,
    isPlaying = false,
    onSpeak,
    onTranslate,
}: ChatBubbleProps) {
    const isTyping = message === '';
    const { beforeQuestion, question, content } = parseScenarioMessage(message);

    return (
        <S.MessageWrapper isAI={isAI}>
            <S.MessageBubble isAI={isAI}>
                {isTyping ? (
                    <S.TypingIndicator>...</S.TypingIndicator>
                ) : (
                    <>
                        {beforeQuestion && (
                            <S.MessageContent>{formatMessage(beforeQuestion)}</S.MessageContent>
                        )}
                        {question && (
                            <S.QuestionText>{formatMessage(question)}</S.QuestionText>
                        )}
                        {content && (
                            <S.MessageContent>{formatMessage(content)}</S.MessageContent>
                        )}
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

