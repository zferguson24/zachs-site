import styled from "styled-components";
import {
  BG_BASE, BG_ELEVATED, BG_HOVER,
  BORDER, BORDER_HOVER,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DIM, TEXT_BRIGHT, TEXT_ITEM, TEXT_MUTED_ACTION,
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
  max-width: 760px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  background-color: ${BG_ELEVATED};
  border: 1px solid ${BORDER};
  border-radius: 6px;
  color: ${TEXT_PRIMARY};
  outline: none;

  &::placeholder { color: ${TEXT_DIM}; }
  &:focus { border-color: ${BORDER_HOVER}; }
`;

export const ResultsArea = styled.div`
  width: 100%;
  max-width: 760px;
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
  &::-webkit-scrollbar-thumb { background-color: ${BORDER}; border-radius: 4px; }
`;

export const ResultCard = styled.div<{ $clickable: boolean }>`
  padding: 12px 16px;
  background-color: ${BG_ELEVATED};
  border: 1px solid ${BORDER};
  border-radius: 6px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  &:hover {
    border-color: ${BORDER_HOVER};
    background-color: ${BG_HOVER};
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
  font-size: 15px;
  font-weight: 600;
  color: ${TEXT_ITEM};
  text-shadow:
    0 0 2px rgba(0, 0, 0, 1),
    0 0 6px rgba(0, 0, 0, 1),
    0 2px 6px rgba(0, 0, 0, 0.9);
`;

export const TypeBadge = styled.span<{ $isWeapon: boolean }>`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
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
  margin-top: 6px;
`;

export const ResultMeta = styled.div`
  font-size: 13px;
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
`;

export const SlotButton = styled.button`
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
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
`;
