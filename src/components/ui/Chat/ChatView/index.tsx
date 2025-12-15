'use client';

import Image from 'next/image';
import ChatBubble from '../ChatBubble';
import QuizOptions from '../QuizOptions';
import * as S from './style';
import type { QuizType, QuizOption } from '@/utils/quizParser';

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
}: ChatViewProps) {
    return (
        <S.Overlay>
            <S.Container>
                <S.Handle />
                <S.MessagesContainer>
                    {messages.map((message) => (
                        <ChatBubble
                            key={message.id}
                            message={message.text}
                            isAI={message.isAI}
                            isPlaying={playingMessageId === message.id}
                            onSpeak={() => onSpeak?.(message.id)}
                            onTranslate={() => onTranslate?.(message.id)}
                        />
                    ))}
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
                            {quizType === 'multiple-choice' ? 'Select an answer...' : 'Waiting for AI...'}
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

