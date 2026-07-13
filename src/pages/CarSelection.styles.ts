import styled from "styled-components";
import {
  BG_ACCENT,
  BG_ACCENT_HOVER,
  BORDER_ACCENT,
  FONT_XS,
  FONT_SM,
  FONT_XXS,
  FONT_2XL,
  RADIUS_SM,
  TEXT_ACCENT,
  TEXT_BRIGHT,
  TEXT_ERROR,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "../styles/tokens";

export const Content = styled.div`
  width: 100%;
  max-width: 860px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

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
  margin: 0 0 16px;
`;

export const SectionLabel = styled.h2`
  font-size: ${FONT_XXS};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${TEXT_BRIGHT};
  font-weight: 600;
  margin: 10px 0 0;
`;

export const PreferencesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 12px;
`;

export const SubmitRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin: 6px 0 10px;
`;

export const MatchButton = styled.button`
  background: ${BG_ACCENT};
  border: 1px solid ${BORDER_ACCENT};
  border-radius: ${RADIUS_SM};
  color: ${TEXT_ACCENT};
  font-size: ${FONT_XS};
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 10px 22px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${BG_ACCENT_HOVER};
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:focus-visible {
    outline: 2px solid ${BORDER_ACCENT};
    outline-offset: 2px;
  }
`;

export const ErrorLine = styled.p`
  font-size: ${FONT_XS};
  color: ${TEXT_ERROR};
  margin: 0;
`;

export const HintLine = styled.span`
  font-size: ${FONT_XS};
  color: ${TEXT_SECONDARY};
`;
