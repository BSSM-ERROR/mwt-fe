import styled from "@emotion/styled";
import { frostedGlass } from "../shared";

export const MessageWrapper = styled.div<{ isAI?: boolean }>`
  display: flex;
  justify-content: ${({ isAI }) => (isAI ? "flex-start" : "flex-end")};
  width: 100%;
`;

export const MessageBubble = styled.div<{ isAI?: boolean }>`
  max-width: 85%;
  padding: 16px 20px;
  border-radius: ${({ isAI }) =>
    isAI ? "20px 20px 20px 4px" : "20px 20px 4px 20px"};
  background: ${({ isAI }) => (isAI ? "#F35151" : "rgba(255, 255, 255, 0.85)")};
  ${frostedGlass}
  color: ${({ isAI }) => (isAI ? "#FFFFFF" : "#333333")};
  font-family: "The Jamsil", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  position: relative;
`;

export const MessageActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  gap: 12px;
`;

export const ActionButton = styled.button`
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 1;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  svg {
    width: 20px;
    height: 20px;
    fill: rgba(255, 255, 255, 0.9);
  }
`;

export const TypingIndicator = styled.span`
  display: inline-block;
  animation: typing 1.5s ease-in-out infinite;

  @keyframes typing {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }
`;

export const ScenarioDescription = styled.span`
  color: rgba(234, 234, 234, 0.7);
  font-style: italic;
  display: block;
  margin-bottom: 8px;
`;

export const ScenarioText = styled.span`
  color: rgba(234, 234, 234, 0.7);
  font-style: italic;
`;

export const QuestionText = styled.span`
  display: block;
  font-weight: 700;
  margin-top: 8px;
`;

export const MessageContent = styled.span`
  display: block;
`;
