"use client";

import styled from "@emotion/styled";
import { ReactNode } from "react";

import dynamic from "next/dynamic";
import { useLive2DStore } from "@/store/useLive2DStore";
import NavBar from "@/components/ui/NavigationBar/NavigationBar";
import Stamina from "../ui/Stamina/Stamina";

const Live2DViewer = dynamic(
  () => import("@/components/ui/Live2d/Live2DViewer"),
  {
    ssr: false,
  }
);

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
    content: "";
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background-image: url("/assets/background.png");
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
  const isLive2DVisible = useLive2DStore((state) => state.isVisible);

  return (
    <Container>
      <Stamina currentStamina={3} />
      {isLive2DVisible && <StyledLive2DViewer speaking={false} />}
      {children}
      <NavBar />
    </Container>
  );
}
