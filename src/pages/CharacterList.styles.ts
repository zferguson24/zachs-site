import styled from "styled-components";
import {
  BG_BASE, BG_ELEVATED, BG_HOVER, BG_ACCENT, BG_ACCENT_HOVER,
  BORDER, BORDER_HOVER, BORDER_ACCENT,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DIM, TEXT_ACCENT, TEXT_MUTED_ACTION, TEXT_ERROR,
  FONT_XS, FONT_SM, FONT_MD, FONT_LG, FONT_2XL,
  RADIUS_SM, RADIUS_MD, BREAKPOINT_MOBILE,
} from "../styles/tokens";

export {
  Page,
  Spinner,
  EmptyMessage,
  AnimatedCardWrapper,
} from "../styles/shared";

export {
  IconWrapper as SingleIconWrapper,
  IconImg    as RaceClassIcon,
  IconBorder as RaceClassIconBorder,
} from "../components/timewalking/WowIcon.styles";

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
`;

export const ListArea = styled.div`
  width: 100%;
  max-width: 760px;
`;

export const ChevronIndicator = styled.span`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%) translateX(-40px);
  opacity: 0;
  font-size: 2rem;
  line-height: 1;
  color: ${TEXT_DIM};
  pointer-events: none;
  user-select: none;
  transition: opacity 0.18s ease-out, transform 0.18s ease-out;
`;

export const CharacterCard = styled.button`
  position: relative;
  width: 100%;
  text-align: left;
  font-size: inherit;
  padding: 14px 20px;
  background-color: ${BG_ELEVATED};
  border: 1px solid ${BORDER};
  border-radius: ${RADIUS_MD};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;

  &:hover {
    border-color: ${BORDER_HOVER};
    background-color: ${BG_HOVER};
  }

  &:hover ${ChevronIndicator} {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }

  &:focus-visible {
    outline: 2px solid ${BORDER_HOVER};
    outline-offset: 2px;
  }
`;

export const IconsGroup = styled.div`
  display: flex;
  gap: 14px;
  flex-shrink: 0;
`;

export const CharInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CharName = styled.div<{ $color: string }>`
  font-size: ${FONT_MD};
  line-height: ${FONT_LG};
  font-weight: 700;
  color: ${({ $color }) => $color};
  text-shadow:
    0 0 2px rgba(0, 0, 0, 1),
    0 0 6px rgba(0, 0, 0, 1),
    0 2px 6px rgba(0, 0, 0, 0.9);
`;

export const CharMeta = styled.div`
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  color: ${TEXT_SECONDARY};
  margin-top: 8px;
`;

export const AddCharacterCard = styled.button`
  width: 100%;
  text-align: left;
  padding: 14px 20px;
  min-height: 84px;
  background-color: transparent;
  border: 1px dashed ${BORDER};
  border-radius: ${RADIUS_MD};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: ${TEXT_DIM};
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  transition: border-color 0.15s, color 0.15s;

  &:hover {
    border-color: ${BORDER_HOVER};
    color: ${TEXT_MUTED_ACTION};
  }

  &:focus-visible {
    outline: 2px solid ${BORDER_HOVER};
    outline-offset: 2px;
  }
`;

export const AddIcon = styled.span`
  font-size: ${FONT_2XL};
  line-height: 1;
  font-weight: 300;
`;

export const CreateForm = styled.form`
  padding: 16px 20px;
  background-color: ${BG_ELEVATED};
  border: 1px solid ${BORDER};
  border-radius: ${RADIUS_MD};
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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

  &::placeholder { color: ${TEXT_DIM}; }
  &:focus { border-color: ${BORDER_HOVER}; }

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    height: 44px;
  }
`;

export const FormSelect = styled.select`
  height: 36px;
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

  &:focus { border-color: ${BORDER_HOVER}; }
  &:disabled { opacity: 0.5; cursor: default; }

  option { background-color: ${BG_BASE}; }

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    height: 44px;
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    justify-content: stretch;
  }
`;

export const SubmitButton = styled.button`
  padding: 7px 20px;
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  font-weight: 600;
  border-radius: ${RADIUS_SM};
  border: 1px solid ${BORDER_ACCENT};
  background-color: ${BG_ACCENT};
  color: ${TEXT_ACCENT};
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;

  &:hover:not(:disabled) { border-color: ${BORDER_HOVER}; background-color: ${BG_ACCENT_HOVER}; }
  &:disabled { opacity: 0.5; cursor: default; }

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    flex: 1;
    padding: 11px 20px;
  }
`;

export const CancelButton = styled.button`
  padding: 7px 16px;
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  border-radius: ${RADIUS_SM};
  border: 1px solid ${BORDER};
  background-color: transparent;
  color: ${TEXT_SECONDARY};
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;

  &:hover { border-color: ${BORDER_HOVER}; color: ${TEXT_MUTED_ACTION}; }

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    flex: 1;
    padding: 11px 16px;
  }
`;

export const FormError = styled.div.attrs({ role: "alert" })`
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  color: ${TEXT_ERROR};
  background-color: rgba(224, 80, 80, 0.1);
  border: 1px solid rgba(224, 80, 80, 0.25);
  border-radius: ${RADIUS_SM};
  padding: 7px 12px;
`;
