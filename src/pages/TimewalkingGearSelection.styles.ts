import styled from "styled-components";
import { TEXT_SECONDARY, TEXT_PRIMARY } from "../styles/tokens";

export { Page } from "../styles/shared";

export const BackButton = styled.button`
  width: 100%;
  max-width: 760px;
  background: none;
  border: none;
  color: ${TEXT_SECONDARY};
  font-size: 13px;
  cursor: pointer;
  padding: 0 0 24px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s;
  text-align: left;

  &:hover { color: ${TEXT_PRIMARY}; }
`;
