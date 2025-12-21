import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: transparent;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 17px 0;
  overflow: auto;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 38px;
`;

export const CardSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
