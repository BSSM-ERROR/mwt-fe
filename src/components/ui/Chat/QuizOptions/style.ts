import styled from '@emotion/styled';

export const QuizOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  width: 100%;
`;

export const OptionButton = styled.button<{ selected?: boolean }>`
  width: 100%;
  padding: 16px 20px;
  background: ${({ selected }) =>
    selected ? 'rgba(243, 81, 81, 0.2)' : 'rgba(255, 255, 255, 0.9)'};
  border: 2px solid ${({ selected }) =>
    selected ? '#F35151' : 'rgba(243, 81, 81, 0.3)'};
  border-radius: 12px;
  font-family: 'The Jamsil', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background: rgba(243, 81, 81, 0.1);
    border-color: #F35151;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const OptionLabel = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #F35151;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  flex-shrink: 0;
`;

export const OptionText = styled.span`
  flex: 1;
`;
