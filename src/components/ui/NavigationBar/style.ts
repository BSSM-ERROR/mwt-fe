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

export const MenuWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 1rem;
  position: relative;
  transform: translateY(-0.5rem);
`;

export const MenuItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  flex: 1 0 0;
  cursor: pointer;
  padding: 0.5rem;

  &:hover {
    opacity: 0.8;
  }

  &:nth-of-type(2) {
    margin-right: 15%;
  }

  &:nth-of-type(3) {
    margin-left: 15%;
  }
`;

export const IconWrapper = styled.div`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    width: 2.5rem;
    height: 2.5rem;
  }

  img {
    width: 100%;
    height: 100%;
  }
`;

export const Label = styled.span<{ isActive?: boolean }>`
  font-size: 0.75rem;
  font-weight: 400;
  color: ${({ isActive }) => (isActive ? "#F35151" : "#4a4a4a")};

  @media (min-width: 768px) {
    font-size: 1rem;
  }
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
