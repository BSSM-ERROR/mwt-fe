'use client';

import { useState } from 'react';
import * as S from './style';
import type { QuizOption } from '@/utils/quizParser';

interface QuizOptionsProps {
  options: QuizOption[];
  onSelect: (option: QuizOption) => void;
  disabled?: boolean;
}

export default function QuizOptions({ options, onSelect, disabled = false }: QuizOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: QuizOption) => {
    if (disabled) return;

    setSelectedOption(option.label);
    onSelect(option);
  };

  return (
    <S.QuizOptionsContainer>
      {options.map((option) => (
        <S.OptionButton
          key={option.label}
          selected={selectedOption === option.label}
          onClick={() => handleSelect(option)}
          disabled={disabled}
        >
          <S.OptionLabel>{option.label}</S.OptionLabel>
          <S.OptionText>{option.text}</S.OptionText>
        </S.OptionButton>
      ))}
    </S.QuizOptionsContainer>
  );
}
