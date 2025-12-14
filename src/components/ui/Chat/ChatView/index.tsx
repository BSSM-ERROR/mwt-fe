'use client';

import Image from 'next/image';
import ChatBubble from '../ChatBubble';
import * as S from './style';

interface Message {
    id: string;
    text: string;
    isAI: boolean;
}

interface ChatViewProps {
    messages?: Message[];
    isRecording?: boolean;
    onMicClick?: () => void;
    onSpeak?: (messageId: string) => void;
    onTranslate?: (messageId: string) => void;
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
    onMicClick,
    onSpeak,
    onTranslate,
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
                            onSpeak={() => onSpeak?.(message.id)}
                            onTranslate={() => onTranslate?.(message.id)}
                        />
                    ))}
                </S.MessagesContainer>
                <S.InputContainer>
                    {isRecording && <S.RecordingText>Listening...</S.RecordingText>}
                    <S.MicButton onClick={onMicClick} aria-label="Record voice" isRecording={isRecording}>
                        <Image src="/icons/mic.svg" alt="mic" width={32} height={32} />
                    </S.MicButton>
                </S.InputContainer>
            </S.Container>
        </S.Overlay>
    );
}

