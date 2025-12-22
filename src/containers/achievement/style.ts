import styled from '@emotion/styled';

export const Wrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  gap: 20px;
  width: 100%;
  max-width: 520px;
  margin: 0 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
`;

export const Title = styled.h1`
  font-family: 'The Jamsil', sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: #F35151;
  opacity: 0.8;
  margin: 0 auto;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
