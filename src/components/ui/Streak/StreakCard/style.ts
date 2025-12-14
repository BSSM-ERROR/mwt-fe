import styled from '@emotion/styled';

export const Container = styled.div`
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 26px 86px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const FireIcon = styled.div`
  width: 74px;
  height: 74px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StreakNumber = styled.p`
  font-family: 'The Jamsil', sans-serif;
  font-weight: 800;
  font-size: 96px;
  line-height: 1.2;
  color: #f35151;
  opacity: 0.8;
  margin: 0;
  text-align: center;
`;

export const StreakText = styled.p`
  font-family: 'The Jamsil', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 1.2;
  color: #f35151;
  opacity: 0.8;
  margin: 0;
  text-align: center;
`;
