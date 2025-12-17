import type { SelectOption } from "@/types/chat";

export const difficultyLevels: SelectOption[] = [
  {
    id: "beginner",
    tag: "EASY",
    title: "Beginner",
    description: "기본 인사말, 자기소개, 간단한 어휘",
  },
  {
    id: "elementary",
    tag: "MEDIUM",
    title: "Elementary",
    description: "일상 대화, 간단한 질문/답변, 중급 어휘",
  },
  {
    id: "intermediate",
    tag: "HARD",
    title: "Intermediate",
    description: "감정 표현, 복잡한 대화, 상급 어휘",
  },
  {
    id: "advanced",
    tag: "EXPERT",
    title: "Advanced",
    description: "깊은 주제, 토론, 농담, 전문가 어휘",
  },
];

export const learningMethods: SelectOption[] = [
  {
    id: "free-talking",
    tag: "BASIC CONVERSATION",
    title: "Free talking mode",
    description: "자유로운 대화, 문법/발음 피드백",
  },
  {
    id: "scenario",
    tag: "SITUATIONAL CONVERSATION",
    title: "Scenario mode",
    description: "특정 상황 연습 (카페 주문, 길 물어보기 등)",
  },
  {
    id: "quiz",
    tag: "APPLIED QUIZ",
    title: "Quiz mode",
    description: "선생 ↔ 학생 관계처럼 수업하는 형식",
  },
];
