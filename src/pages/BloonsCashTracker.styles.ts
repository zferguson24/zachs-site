import styled from "styled-components";
import {
  BG_BASE,
  BG_ELEVATED,
  BORDER,
  BORDER_HOVER,
  BORDER_ACCENT,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_DIM,
  TEXT_BRIGHT,
  FONT_XXS,
  FONT_XS,
  FONT_SM,
  FONT_2XL,
  RADIUS_SM,
  RADIUS_MD,
  BREAKPOINT_MOBILE,
} from "../styles/tokens";

export { Page } from "../styles/shared";

export const PageTitle = styled.h1`
  font-size: ${FONT_2XL};
  line-height: 26px;
  font-weight: 700;
  color: ${TEXT_PRIMARY};
  margin: 0 0 6px;
  letter-spacing: 0.02em;
`;

export const PageSubtitle = styled.p`
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  color: ${TEXT_SECONDARY};
  margin: 0 0 28px;
  max-width: 560px;
  text-align: center;
`;

export const ContentArea = styled.div`
  width: 100%;
  max-width: 560px;
`;

export const Panel = styled.div`
  padding: 20px;
  background-color: ${BG_ELEVATED};
  border: 1px solid ${BORDER};
  border-radius: ${RADIUS_MD};
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    flex-direction: column;
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
`;

export const FormLabel = styled.label`
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  font-weight: 600;
  color: ${TEXT_SECONDARY};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const FormInput = styled.input`
  height: 36px;
  box-sizing: border-box;
  padding: 0 12px;
  font-size: ${FONT_XS};
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
    height: 44px;
  }
`;

export const FormSelect = styled.select`
  height: 36px;
  width: 100%;
  box-sizing: border-box;
  padding: 0 36px 0 12px;
  font-size: ${FONT_XS};
  background-color: ${BG_BASE};
  border: 1px solid ${BORDER};
  border-radius: ${RADIUS_SM};
  color: ${TEXT_PRIMARY};
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a9ab5' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;

  &:focus {
    border-color: ${BORDER_HOVER};
  }

  option {
    background-color: ${BG_BASE};
  }

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    height: 44px;
  }
`;

export const RangeHint = styled.div`
  font-size: ${FONT_XXS};
  color: ${TEXT_DIM};
`;

export const ToggleRow = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

export const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  color: ${TEXT_PRIMARY};
  cursor: pointer;
`;

export const ToggleInput = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${BORDER_ACCENT};
  cursor: pointer;
`;

export const ResultsGrid = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    flex-direction: column;
  }
`;

export const ResultCard = styled.div`
  flex: 1;
  padding: 18px 20px;
  background-color: ${BG_ELEVATED};
  border: 1px solid ${BORDER_ACCENT};
  border-radius: ${RADIUS_MD};
`;

export const ResultLabel = styled.div`
  font-size: ${FONT_XXS};
  line-height: ${FONT_SM};
  font-weight: 600;
  color: ${TEXT_SECONDARY};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
`;

export const ResultValue = styled.div`
  font-size: ${FONT_2XL};
  line-height: 28px;
  font-weight: 700;
  color: ${TEXT_BRIGHT};
`;

export const ResultFootnote = styled.div`
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed ${BORDER};
  font-size: ${FONT_XXS};
  line-height: ${FONT_SM};
  color: ${TEXT_DIM};
`;

export const Note = styled.p`
  font-size: ${FONT_XXS};
  line-height: ${FONT_SM};
  color: ${TEXT_DIM};
  margin: 0;

  a {
    color: ${TEXT_SECONDARY};
  }
`;