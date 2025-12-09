import styled from '@emotion/styled';
import { frostedGlass } from '../shared';

export const Container = styled.div`
  background: rgba(30, 30, 30, 0.45);
  ${frostedGlass}
  border-radius: 24px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`;

export const TextContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Tag = styled.span`
  font-family: 'The Jamsil', sans-serif;
  font-weight: 400;
  font-size: 10px;
  line-height: 16px;
  color: #f35151;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

export const Title = styled.h3`
  font-family: 'The Jamsil', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.87);
  margin: 0;
`;

export const Description = styled.p`
  font-family: 'The Jamsil', sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
`;

export const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
    fill: rgba(255, 255, 255, 0.6);
  }
`;
