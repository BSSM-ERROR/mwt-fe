import styled from '@emotion/styled';
import { Overlay as BaseOverlay, Handle as BaseHandle, MicButton as BaseMicButton, frostedGlass, slideUpAnimation } from '../shared';

export const Overlay = BaseOverlay;
export const MicButton = BaseMicButton;

export const Container = styled.div`
  background: rgba(255, 255, 255, 0.15);
  ${frostedGlass}
  border-radius: 32px 32px 0 0;
  padding: 20px;
  padding-bottom: 0;
  width: 100%;
  max-width: 600px;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  position: relative;
  ${slideUpAnimation}
`;

export const Handle = styled(BaseHandle)`
  margin-bottom: 16px;
`;

export const MessagesContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 0 20px;
  overflow-y: auto;
`;

export const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  padding-bottom: 40px;
`;
