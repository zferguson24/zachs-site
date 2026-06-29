import styled from "styled-components";
import { TEXT_SECONDARY, TEXT_PRIMARY, FONT_XS, FONT_SM } from "../styles/tokens";

export { Page } from "../styles/shared";

export const BackButton = styled.button`
  width: 100%;
  max-width: 960px;
  background: none;
  border: none;
  color: ${TEXT_SECONDARY};
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  cursor: pointer;
  padding: 0 0;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s;
  text-align: left;

  &:hover {
    color: ${TEXT_PRIMARY};
  }
`;
