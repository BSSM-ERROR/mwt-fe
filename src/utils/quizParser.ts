export type QuizType = 'multiple-choice' | 'fill-in-blank' | 'answer' | null;

export interface QuizOption {
  label: string; // A, B, C, D
  text: string;  // 선택지 내용
}

// 문제 유형 감지
export function detectQuizType(text: string): QuizType {
  // 객관식 감지
  if (text.includes('A)') && text.includes('B)') && text.includes('C)')) {
    return 'multiple-choice';
  }

  // 주관식 감지
  if (text.includes('Fill in the blank:') || text.includes('_____')) {
    return 'fill-in-blank';
  }

  // 정답 확인
  if (text.includes('correct answer is') || text.includes('Correct answer:')) {
    return 'answer';
  }

  return null;
}

// 객관식 선택지 파싱
export function parseMultipleChoiceOptions(text: string): QuizOption[] {
  const options: QuizOption[] = [];
  const optionLabels = ['A', 'B', 'C', 'D', 'E'];

  for (const label of optionLabels) {
    const regex = new RegExp(`${label}\\)\\s*([^\\n]+?)(?=\\s*[A-E]\\)|$)`, 's');
    const match = text.match(regex);

    if (match) {
      options.push({
        label,
        text: match[1].trim(),
      });
    }
  }

  return options;
}

// 객관식 선택지 부분 제거 (질문만 남김)
export function removeMultipleChoiceOptions(text: string): string {
  // A)로 시작하는 부분부터 끝까지 제거
  const questionOnly = text.replace(/\s*A\)[\s\S]*$/, '');
  return questionOnly.trim();
}
