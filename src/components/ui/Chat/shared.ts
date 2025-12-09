import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const frostedGlass = css`
  backdrop-filter: blur(10px);
`;

export const slideUpAnimation = css`
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;

export const Handle = styled.div`
  width: 36px;
  height: 5px;
  background: #545052;
  border-radius: 4px;
  margin: 0 auto;
  flex-shrink: 0;
`;

export const MicButton = styled.button`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #F35151;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(243, 81, 81, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(243, 81, 81, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 28px;
    height: 28px;
    fill: #FFFFFF;
  }
`;
