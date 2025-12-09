import styled from "@emotion/styled";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

export const CanvasContainer = styled.div`
  height: 100%;
  width: 100%;
`;

export const ErrorOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  font-size: 0.875rem;
  color: #fecdd3;
  backdrop-filter: blur(4px);
`;
