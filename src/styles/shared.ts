import styled, { keyframes } from "styled-components";
import { BG_BASE, BORDER, BORDER_HOVER, TEXT_PRIMARY, TEXT_DIM, FONT_XS, FONT_SM } from "./tokens";

export const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`to { transform: rotate(360deg); }`;

export const AnimatedCardWrapper = styled.div<{ $index: number }>`
  opacity: 0;
  animation: ${fadeSlideUp} 0.25s ease both;
  animation-delay: ${({ $index }) => $index * 50}ms;
`;

export const Spinner = styled.div.attrs({ role: "status", "aria-label": "Loading" })`
  width: 28px;
  height: 28px;
  border: 3px solid ${BORDER};
  border-top-color: ${BORDER_HOVER};
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
  margin: 32px auto;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  color: ${TEXT_DIM};
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  margin-top: 32px;
`;

// Shared page shell used by CharacterList and TimewalkingGearSelection
export const Page = styled.main`
  min-height: 100vh;
  background-color: ${BG_BASE};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px 72px;
  color: ${TEXT_PRIMARY};
`;

