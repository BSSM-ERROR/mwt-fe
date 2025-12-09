'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomSheet, SelectCard, ChatView, Highlight } from '@/components/ui/Chat';
import { difficultyLevels, learningMethods } from '@/constants/chat';
import type { SelectOption, Step } from '@/types/chat';

export default function ChatContainer() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('level');

  const handleClose = () => {
    router.back();
  };

  const handleSelectLevel = (level: SelectOption) => {
    console.log('Selected level:', level);
    setStep('method');
  };

  const handleSelectMethod = (method: SelectOption) => {
    console.log('Selected method:', method);
    setStep('chat');
  };

  const handleMicClick = () => {
    console.log('Mic clicked');
  };

  const handleSpeak = (messageId: string) => {
    console.log('Speak message:', messageId);
  };

  const handleTranslate = (messageId: string) => {
    console.log('Translate message:', messageId);
  };

  const renderStep = () => {
    switch (step) {
      case 'chat':
        return (
          <ChatView
            onMicClick={handleMicClick}
            onSpeak={handleSpeak}
            onTranslate={handleTranslate}
          />
        );

      case 'method':
        return (
          <BottomSheet
            isOpen={true}
            onClose={handleClose}
            title={
              <>
                <Highlight>학습 방식</Highlight>을 설정해주세요
              </>
            }
          >
            {learningMethods.map((method) => (
              <SelectCard
                key={method.id}
                tag={method.tag}
                title={method.title}
                description={method.description}
                onClick={() => handleSelectMethod(method)}
              />
            ))}
          </BottomSheet>
        );

      case 'level':
      default:
        return (
          <BottomSheet
            isOpen={true}
            onClose={handleClose}
            title={
              <>
                <Highlight>난이도</Highlight>를 설정해주세요
              </>
            }
          >
            {difficultyLevels.map((level) => (
              <SelectCard
                key={level.id}
                tag={level.tag}
                title={level.title}
                description={level.description}
                onClick={() => handleSelectLevel(level)}
              />
            ))}
          </BottomSheet>
        );
    }
  };

  return renderStep();
}
