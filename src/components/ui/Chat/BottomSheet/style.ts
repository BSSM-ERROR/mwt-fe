import styled from '@emotion/styled';
import { Overlay as BaseOverlay, Handle as BaseHandle, frostedGlass, slideUpAnimation } from '../shared';

export const Overlay = BaseOverlay;

export const Container = styled.div`
  background: rgba(255, 255, 255, 0.15);
  ${frostedGlass}
  border-radius: 32px 32px 0 0;
  padding: 20px;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  ${slideUpAnimation}
`;

export const Handle = styled(BaseHandle)`
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

export const Title = styled.h2`
  font-family: 'The Jamsil', sans-serif;
  font-weight: 500;
  font-size: 28px;
  color: #545052;
  text-align: center;
  margin: 0;
`;

export const Highlight = styled.span`
  color: #f35151;
`;

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
