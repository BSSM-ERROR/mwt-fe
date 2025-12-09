import styled from "@emotion/styled";

export const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  min-height: 10rem;
  padding: 0.1em;
  max-width: 600px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("/assets/shell.svg");
    background-size: 100% auto;
    background-position: center bottom;
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
