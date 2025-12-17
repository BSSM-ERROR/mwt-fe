'use client';

import Image from 'next/image';
import ChatBubble from '../ChatBubble';
import QuizOptions from '../QuizOptions';
import * as S from './style';
import type { QuizType, QuizOption } from '@/utils/quizParser';
import { removeMultipleChoiceOptions } from '@/utils/quizParser';

interface Message {
    id: string;
    text: string;
    isAI: boolean;
}

interface ChatViewProps {
    messages?: Message[];
    isRecording?: boolean;
    isMicDisabled?: boolean;
    playingMessageId?: string | null;
    quizType?: QuizType;
    quizOptions?: QuizOption[];
    isSessionEnded?: boolean;
    sessionProgress?: { current: number; total: number };
    onMicClick?: () => void;
    onSpeak?: (messageId: string) => void;
    onTranslate?: (messageId: string) => void;
    onQuizOptionSelect?: (option: QuizOption) => void;
}

const defaultMessages: Message[] = [
    {
        id: '1',
        text: "Hello! Let's practice English together today. I'm here to help you improve your conversation skills!",
        isAI: true,
    },
    {
        id: '2',
        text: "Hi! I'd like to practice ordering food at a restaurant. Can we role-play that scenario?",
        isAI: false,
    },
];

export default function ChatView({
    messages = defaultMessages,
    isRecording = false,
    isMicDisabled = false,
    playingMessageId = null,
    quizType = null,
    quizOptions = [],
    onMicClick,
    onSpeak,
    onTranslate,
    onQuizOptionSelect,
    isSessionEnded = false,
    sessionProgress = { current: 0, total: 0 },
}: ChatViewProps) {
    // 마지막 AI 메시지 인덱스 찾기
    const lastAIMessageIndex = messages.length > 0
        ? messages.map((m, idx) => m.isAI ? idx : -1).filter(idx => idx !== -1).pop()
        : -1;

    return (
        <S.Overlay>
            <S.Container>
                {sessionProgress.total > 0 && (
                    <S.ProgressText>
                        {sessionProgress.current} / {sessionProgress.total}
                    </S.ProgressText>
                )}
                <S.Handle />
                <S.MessagesContainer>
                    {messages.map((message, index) => {
                        // 마지막 AI 메시지이고 객관식 문제일 때 선택지 제거
                        const isLastAIMessage = index === lastAIMessageIndex;
                        const displayText = isLastAIMessage && quizType === 'multiple-choice'
                            ? removeMultipleChoiceOptions(message.text)
                            : message.text;

                        return (
                            <ChatBubble
                                key={message.id}
                                message={displayText}
                                isAI={message.isAI}
                                isPlaying={playingMessageId === message.id}
                                onSpeak={() => onSpeak?.(message.id)}
                                onTranslate={() => onTranslate?.(message.id)}
                            />
                        );
                    })}
                    {quizType === 'multiple-choice' && quizOptions.length > 0 && (
                        <QuizOptions
                            options={quizOptions}
                            onSelect={(option) => onQuizOptionSelect?.(option)}
                        />
                    )}
                </S.MessagesContainer>
                <S.InputContainer>
                    {isRecording && <S.RecordingText>Listening...</S.RecordingText>}
                    {isMicDisabled && !isRecording && (
                        <S.RecordingText>
                            {isSessionEnded ? 'Session Ended' : (quizType === 'multiple-choice' ? 'Select an answer...' : 'Waiting for AI...')}
                        </S.RecordingText>
                    )}
                    <S.MicButton
                        onClick={onMicClick}
                        aria-label="Record voice"
                        isRecording={isRecording}
                        disabled={isMicDisabled}
                        style={{ opacity: isMicDisabled ? 0.5 : 1, cursor: isMicDisabled ? 'not-allowed' : 'pointer' }}
                    >
                        <Image src="/icons/mic.svg" alt="mic" width={32} height={32} />
                    </S.MicButton>
                </S.InputContainer>
            </S.Container>
        </S.Overlay>
    );
}

