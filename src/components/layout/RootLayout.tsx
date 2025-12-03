"use client";

import styled from "@emotion/styled";
import { ReactNode } from "react";

import Live2DViewer from "@/components/ui/Live2d/Live2DViewer";

const Container = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #ffffff;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background-image: url('/assets/background.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    filter: blur(4px);
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

interface RootLayoutProps {
  children: ReactNode;
}

const StyledLive2DViewer = styled(Live2DViewer)`
  position: absolute !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0 !important;
`;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Container>
      <StyledLive2DViewer speaking={true} />
      {children}
    </Container>
  );
};