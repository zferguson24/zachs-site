import styled from "styled-components";
import {
  BG_BASE,
  TEXT_PRIMARY,
  TEXT_NAV,
  BORDER_NAV,
  BORDER_NAV_HOVER,
  FONT_SM,
  FONT_MD,
  FONT_LG,
  RADIUS_LG,
} from "../styles/tokens";

export const Page = styled.main`
  min-height: 100vh;
  background-color: ${BG_BASE};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${TEXT_PRIMARY};
`;

export const ButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
`;

export const NavButton = styled.button`
  width: 33vw;
  padding: 18px 28px;
  font-size: ${FONT_MD};
  line-height: ${FONT_LG};
  color: ${TEXT_NAV};
  background: rgba(15, 30, 55, 0.75);
  border: 1.5px solid ${BORDER_NAV};
  border-radius: ${RADIUS_LG};
  cursor: pointer;
  letter-spacing: 0.5px;
  text-align: left;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgba(30, 65, 115, 0.85);
    border-color: ${BORDER_NAV_HOVER};
    box-shadow: 0 0 18px rgba(80, 140, 230, 0.3);
    color: #ffffff;
  }

  @media (max-width: 992px) {
    width: 80vw;
    font-size: ${FONT_SM};
    line-height: ${FONT_MD};
  }
`;
