import styled from "@emotion/styled";

export const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  aspect-ratio: 393 / 104;
  padding: 0.1em;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("/assets/shell.svg");
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.8;
    z-index: -1;
  }
`;

export const MenuItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  flex: 1 0 0;
`;

export const ChatButton = styled.button`
  position: absolute;
  top: 28.85%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14.25%;
  aspect-ratio: 1;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  z-index: 10;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: translate(-50%, -50%) scale(0.95);
  }
`;
