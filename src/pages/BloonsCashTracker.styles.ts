import styled from "styled-components";
import {
  BG_BASE,
  BG_ELEVATED,
  BG_HOVER,
  BORDER,
  BORDER_HOVER,
  BORDER_ACCENT,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_DIM,
  TEXT_BRIGHT,
  FONT_XS,
  FONT_SM,
  FONT_MD,
  FONT_2XL,
  RADIUS_SM,
  RADIUS_MD,
  BREAKPOINT_MOBILE,
} from "../styles/tokens";

export { Page } from "../styles/shared";

// Page-local breakpoint: the 7-tile difficulty row starts cramping well before the site's
// shared mobile breakpoint kicks in and stacks it, so it gets one intermediate size step down.
const BREAKPOINT_COMPACT = "1000px";

export const PageTitle = styled.h1`
  font-size: ${FONT_2XL};
  line-height: 30px;
  font-weight: 700;
  color: ${TEXT_PRIMARY};
  margin: 0 0 8px;
  letter-spacing: 0.02em;
`;

export const PageSubtitle = styled.p`
  font-size: ${FONT_SM};
  line-height: ${FONT_MD};
  color: ${TEXT_SECONDARY};
  margin: 0 0 32px;
  max-width: 640px;
  text-align: center;
`;

export const ContentArea = styled.div`
  width: 100%;
  max-width: 1280px;
`;

export const Panel = styled.div`
  padding: 26px;
  background-color: ${BG_ELEVATED};
  border: 1px solid ${BORDER};
  border-radius: ${RADIUS_MD};
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    flex-direction: column;
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

export const FormLabel = styled.label`
  font-size: ${FONT_SM};
  line-height: ${FONT_MD};
  font-weight: 600;
  color: ${TEXT_SECONDARY};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const FormInput = styled.input`
  height: 46px;
  box-sizing: border-box;
  padding: 0 14px;
  font-size: ${FONT_SM};
  background-color: ${BG_BASE};
  border: 1px solid ${BORDER};
  border-radius: ${RADIUS_SM};
  color: ${TEXT_PRIMARY};
  outline: none;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    opacity: 0.8;
    filter: invert(100%);
    cursor: pointer;
  }

  &:focus {
    border-color: ${BORDER_HOVER};
  }

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    height: 50px;
  }
`;

export const RangeHint = styled.div`
  font-size: ${FONT_XS};
  color: ${TEXT_DIM};
`;

export const DifficultyRow = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    flex-direction: column;
  }
`;

export const DifficultyButton = styled.button<{ $active: boolean }>`
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 8px;
  background-color: ${({ $active }) => ($active ? BG_HOVER : BG_BASE)};
  border: 2px solid ${({ $active }) => ($active ? BORDER_ACCENT : BORDER)};
  border-radius: ${RADIUS_MD};
  color: ${({ $active }) => ($active ? TEXT_BRIGHT : TEXT_SECONDARY)};
  font-size: ${FONT_SM};
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background-color 0.15s,
    color 0.15s;

  &:hover {
    border-color: ${BORDER_HOVER};
    background-color: ${BG_HOVER};
  }

  &:focus-visible {
    outline: 2px solid ${BORDER_HOVER};
    outline-offset: 2px;
  }

  @media (max-width: ${BREAKPOINT_COMPACT}) {
    gap: 6px;
    padding: 10px 4px;
    font-size: ${FONT_XS};
  }

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    flex: none;
    width: 100%;
  }
`;

export const DifficultyIcon = styled.img`
  height: 88px;
  width: auto;
  max-width: 100%;

  @media (max-width: ${BREAKPOINT_COMPACT}) {
    height: 48px;
  }
`;

export const ToggleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const ToggleLabel = styled.label<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: ${FONT_SM};
  line-height: ${FONT_MD};
  color: ${({ $disabled }) => ($disabled ? TEXT_DIM : TEXT_PRIMARY)};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
`;

export const ToggleInput = styled.input`
  width: 18px;
  height: 18px;
  background-color: ${BG_BASE};
  border: 1px solid ${BORDER};
  border-radius: 3px;
  accent-color: ${BORDER_ACCENT};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ToggleIcon = styled.img`
  height: 28px;
  width: auto;
`;

export const ResultsGrid = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    flex-direction: column;
  }
`;

export const ResultCard = styled.div`
  flex: 1;
  padding: 22px 26px;
  background-color: ${BG_ELEVATED};
  border: 1px solid ${BORDER_ACCENT};
  border-radius: ${RADIUS_MD};
`;

export const ResultLabel = styled.div`
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  font-weight: 600;
  color: ${TEXT_SECONDARY};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
`;

export const ResultValue = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: ${FONT_2XL};
  line-height: 34px;
  font-weight: 700;
  color: ${TEXT_BRIGHT};
`;

export const ResultIcon = styled.img`
  height: 32px;
  width: auto;
`;

export const ResultFootnote = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed ${BORDER};
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  color: ${TEXT_DIM};
`;

export const Note = styled.p`
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  color: ${TEXT_DIM};
  margin: 0;

  a {
    color: ${TEXT_SECONDARY};
  }
`;
