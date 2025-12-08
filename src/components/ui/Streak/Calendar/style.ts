import styled from '@emotion/styled';
import { css } from '@emotion/react';

type DayStatus = 'completed' | 'missed' | 'streak' | 'current' | 'empty';
type StreakPosition = 'single' | 'start' | 'middle' | 'end' | 'none';

export const Container = styled.div`
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px 25px 30px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const NavButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MonthYear = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #545052;
  text-align: center;
`;

export const WeekdayRow = styled.div`
  display: flex;
  width: 100%;
`;

export const Weekday = styled.span`
  flex: 1;
  font-family: 'The Jamsil', sans-serif;
  font-weight: 400;
  font-size: 10px;
  color: #0a0a0a;
  text-align: center;
  text-transform: uppercase;
  padding: 4px;
`;

export const DaysGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const WeekRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const getDayStatusStyles = (status: DayStatus) => {
  switch (status) {
    case 'completed':
      return css`
        background: #ffce51;
      `;
    case 'missed':
      return css`
        background: #e4e5e7;
      `;
    case 'streak':
      return css`
        background: #ffce51;
      `;
    case 'current':
      return css`
        background: #f35151;
      `;
    default:
      return css`
        background: #e4e5e7;
      `;
  }
};

const getStreakPositionStyles = (position: StreakPosition) => {
  const bgColor = 'rgba(255, 206, 81, 0.3)';
  switch (position) {
    case 'single':
      return css`
        background: ${bgColor};
        border-radius: 20px;
        padding: 4px 8px;
      `;
    case 'start':
      return css`
        background: ${bgColor};
        border-radius: 20px 0 0 20px;
        padding: 4px 0 4px 8px;
        margin-right: -8px;
      `;
    case 'middle':
      return css`
        background: ${bgColor};
        border-radius: 0;
        padding: 4px 0;
        margin: 0 -8px;
      `;
    case 'end':
      return css`
        background: ${bgColor};
        border-radius: 0 20px 20px 0;
        padding: 4px 8px 4px 0;
        margin-left: -8px;
      `;
    default:
      return css``;
  }
};

export const DayCellWrapper = styled.div<{ streakPosition: StreakPosition }>`
  flex: 1;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  ${({ streakPosition }) => streakPosition !== 'none' && css`
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: 32px;
      background: rgba(255, 206, 81, 0.3);
      z-index: 0;
      ${streakPosition === 'single' && css`
        left: 8px;
        right: 8px;
        border-radius: 16px;
      `}
      ${streakPosition === 'start' && css`
        left: 8px;
        right: 0;
        border-radius: 16px 0 0 16px;
      `}
      ${streakPosition === 'middle' && css`
        left: 0;
        right: 0;
        border-radius: 0;
      `}
      ${streakPosition === 'end' && css`
        left: 0;
        right: 8px;
        border-radius: 0 16px 16px 0;
      `}
    }
  `}
`;

export const DayCell = styled.div<{ status: DayStatus }>`
  width: 23px;
  height: 23px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  ${({ status }) => getDayStatusStyles(status)}
`;

export const StreakIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
