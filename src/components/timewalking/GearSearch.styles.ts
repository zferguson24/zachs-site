import styled from "styled-components";
import {
  BG_BASE, BG_ELEVATED, BG_HOVER,
  BORDER, BORDER_HOVER,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DIM, TEXT_BRIGHT, TEXT_ITEM, TEXT_MUTED_ACTION,
  FONT_XS, FONT_SM, FONT_MD,
  RADIUS_SM, RADIUS_MD, BREAKPOINT_MOBILE,
} from "../../styles/tokens";

export {
  Spinner,
  EmptyMessage,
  AnimatedCardWrapper,
} from "../../styles/shared";

export {
  IconWrapper,
  IconImg    as ItemIconImg,
  IconBorder,
} from "./WowIcon.styles";

export const SearchWrapper = styled.div`
  width: 100%;
  max-width: 960px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: ${FONT_SM};
  line-height: ${FONT_MD};
  background-color: ${BG_ELEVATED};
  border: 1px solid ${BORDER};
  border-radius: ${RADIUS_MD};
  color: ${TEXT_PRIMARY};
  outline: none;

  &::placeholder { color: ${TEXT_DIM}; }
  &:focus { border-color: ${BORDER_HOVER}; }
`;

export const ResultsArea = styled.div`
  width: 100%;
  max-width: 960px;
  margin-top: 16px;
`;

export const ResultsScroller = styled.div<{ $capped: boolean }>`
  overflow-y: ${({ $capped }) => ($capped ? "auto" : "visible")};
  max-height: ${({ $capped }) => ($capped ? "292px" : "none")};
  padding-right: ${({ $capped }) => ($capped ? "4px" : "0")};
  scrollbar-width: thin;
  scrollbar-color: ${BORDER} transparent;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background-color: ${BORDER}; border-radius: ${RADIUS_SM}; }
`;

export const ResultCard = styled.div<{ $clickable: boolean }>`
  width: 100%;
  text-align: left;
  font-size: inherit;
  padding: 12px 16px;
  background-color: ${BG_ELEVATED};
  border: 1px solid ${BORDER};
  border-radius: ${RADIUS_MD};
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  &:hover {
    border-color: ${BORDER_HOVER};
    background-color: ${BG_HOVER};
  }

  &:focus-visible {
    outline: 2px solid ${BORDER_HOVER};
    outline-offset: 2px;
  }
`;

export const CardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const ResultContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const ResultName = styled.span`
  font-size: ${FONT_SM};
  line-height: ${FONT_MD};
  font-weight: 600;
  color: ${TEXT_ITEM};
  text-shadow:
    0 0 2px rgba(0, 0, 0, 1),
    0 0 6px rgba(0, 0, 0, 1),
    0 2px 6px rgba(0, 0, 0, 0.9);
`;

export const TypeBadge = styled.span<{ $isWeapon: boolean }>`
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  font-weight: 600;
  padding: 2px 7px;
  border-radius: ${RADIUS_SM};
  background-color: ${({ $isWeapon }) => ($isWeapon ? "#2e3f28" : "#2a2e42")};
  color: ${({ $isWeapon }) => ($isWeapon ? "#7bc97a" : "#8fa8e8")};
  border: 1px solid ${({ $isWeapon }) => ($isWeapon ? "#4a7a48" : "#4a5a88")};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ResultMeta = styled.div`
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  color: ${TEXT_SECONDARY};
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  min-width: 0;
`;

export const MetaItem = styled.span``;

export const MetaExpansion = styled(MetaItem)`
  font-weight: 600;
  color: ${TEXT_BRIGHT};
`;

export const MetaStats = styled(MetaItem)`
  font-style: italic;
`;

export const SlotButtonRow = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    width: 100%;
  }
`;

export const SlotButton = styled.button`
  padding: 5px 14px;
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  font-weight: 600;
  border-radius: ${RADIUS_SM};
  border: 1px solid ${BORDER};
  background-color: ${BG_BASE};
  color: ${TEXT_MUTED_ACTION};
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background-color 0.15s;

  &:hover {
    border-color: ${BORDER_HOVER};
    color: ${TEXT_PRIMARY};
    background-color: ${BG_ELEVATED};
  }

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    flex: 1;
    padding: 8px 14px;
  }
`;
