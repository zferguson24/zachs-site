import styled, { keyframes } from "styled-components";

export const SearchWrapper = styled.div`
  width: 100%;
  max-width: 760px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  background-color: #253344;
  border: 1px solid #3d5068;
  border-radius: 6px;
  color: #e8f0f8;
  outline: none;
  box-sizing: border-box;

  &::placeholder { color: #5a7490; }
  &:focus { border-color: #6a9dbf; }
`;

export const ResultsArea = styled.div`
  width: 100%;
  max-width: 760px;
  margin-top: 16px;
`;

const spin = keyframes`to { transform: rotate(360deg); }`;

export const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid #3d5068;
  border-top-color: #6a9dbf;
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
  margin: 32px auto;
`;

export const ResultsScroller = styled.div<{ $capped: boolean }>`
  overflow-y: ${({ $capped }) => ($capped ? "auto" : "visible")};
  max-height: ${({ $capped }) => ($capped ? "292px" : "none")};
  padding-right: ${({ $capped }) => ($capped ? "4px" : "0")};
  scrollbar-width: thin;
  scrollbar-color: #3d5068 transparent;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background-color: #3d5068; border-radius: 4px; }
`;

export const ResultCard = styled.div<{ $clickable: boolean }>`
  padding: 12px 16px;
  background-color: #253344;
  border: 1px solid #3d5068;
  border-radius: 6px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  &:hover {
    border-color: #6a9dbf;
    background-color: #2a3a4d;
  }
`;

export const CardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const IconWrapper = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
`;

export const ItemIconImg = styled.img`
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
  color: #0070dd;
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
  color: #7a9ab5;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  min-width: 0;
`;

export const MetaItem = styled.span``;

export const MetaExpansion = styled(MetaItem)`
  font-weight: 600;
  color: #b8d0e8;
`;

export const MetaStats = styled(MetaItem)`
  font-style: italic;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  color: #5a7490;
  font-size: 14px;
  margin-top: 32px;
`;

export const SlotButtonRow = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// Wraps each result card to apply a staggered fade-slide-up on each new search.
// animation-fill-mode: both holds the card at opacity 0 before the delay fires.
export const AnimatedCardWrapper = styled.div<{ $index: number }>`
  opacity: 0;
  animation: ${fadeSlideUp} 0.25s ease both;
  animation-delay: ${({ $index }) => $index * 50}ms;
`;

export const SlotButton = styled.button`
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid #3d5068;
  background-color: #1e2a38;
  color: #a0c0d8;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background-color 0.15s;

  &:hover {
    border-color: #6a9dbf;
    color: #e8f0f8;
    background-color: #253344;
  }
`;
