import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const Container = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 16px;
  background: rgba(250, 250, 250, 0.8);
  border: 1.5px solid ${({ disabled }) => (disabled ? '#545052' : '#f35151')};
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
`;

export const IconWrapper = styled.div<{ disabled?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${({ disabled }) =>
    disabled &&
    css`
      filter: grayscale(1);
      opacity: 0.6;
    `}
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
  padding-left: 4px;
`;

export const Title = styled.span`
  font-family: 'The Jamsil', sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.2;
  color: #0a0a0a;
`;

export const DescriptionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const Description = styled.span`
  font-family: 'The Jamsil', sans-serif;
  font-weight: 300;
  font-size: 12px;
  color: #545052;
`;

export const Progress = styled.span`
  font-family: 'The Jamsil', sans-serif;
  font-weight: 300;
  font-size: 11px;
  color: #545052;
`;

export const Points = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  padding-right: 4px;
`;

export const Plus = styled.span<{ $disabled?: boolean }>`
  font-family: 'The Jamsil', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${({ $disabled }) => ($disabled ? '#0a0a0a' : '#f35151')};
`;

export const PointValue = styled.span<{ $disabled?: boolean }>`
  font-family: 'The Jamsil', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: ${({ $disabled }) => ($disabled ? '#0a0a0a' : '#f35151')};
`;
