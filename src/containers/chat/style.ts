import styled from "@emotion/styled";

export const Highlight = styled.span`
  color: #f35151;
`;

export const ScenarioInputContainer = styled.div`
  padding: 20px 0;
`;

export const ScenarioTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 16px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  resize: vertical;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #f35151;
  }

  &::placeholder {
    color: #999;
  }
`;

export const ScenarioSubmitButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  margin-top: 16px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  font-family: "The Jamsil";
  background-color: ${({ disabled }) => (disabled ? "#e0e0e0" : "#f35151")};
  color: white;
  border: none;
  border-radius: 12px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #f35151;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

export const SessionEndedButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 0;
`;

export const SessionEndedButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  font-family: "The Jamsil";
  background-color: ${({ variant }) => (variant === 'secondary' ? '#f0f0f0' : '#f35151')};
  color: ${({ variant }) => (variant === 'secondary' ? '#666' : 'white')};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.95);
  }

  &:active {
    transform: scale(0.98);
  }
`;
