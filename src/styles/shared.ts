import styled, { keyframes } from "styled-components";
import { BG_BASE, BORDER, BORDER_HOVER, TEXT_PRIMARY, TEXT_DIM } from "./tokens";

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

export const Spinner = styled.div`
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
  font-size: 14px;
  margin-top: 32px;
`;

// Shared page shell used by CharacterList and TimewalkingGearSelection
export const Page = styled.div`
  min-height: 100vh;
  background-color: ${BG_BASE};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px 72px;
  color: ${TEXT_PRIMARY};
`;

// 56-px icon with Wowhead border overlay — used in CharacterList and GearSearch
export const IconWrapper = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
`;

export const IconImg = styled.img`
  width: 56px;
  height: 56px;
  display: block;
`;

export const IconBorder = styled.img`
  position: absolute;
  top: -6px;
  left: -6px;
  width: 68px;
  height: 68px;
  pointer-events: none;
`;
