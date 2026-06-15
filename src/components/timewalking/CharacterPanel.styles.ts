import styled from "styled-components";

export const Panel = styled.div`
  width: 100%;
  max-width: 760px;
  margin-top: 32px;
`;

export const PanelHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
`;

export const CharName = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #e8f0f8;
  letter-spacing: 0.03em;
`;

export const CharMeta = styled.span`
  font-size: 13px;
  color: #7a9ab5;
`;

export const PanelDivider = styled.hr`
  border: none;
  border-top: 1px solid #2d4055;
  margin: 0 0 14px;
`;

export const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
`;

export const SlotCell = styled.div<{ $reversed: boolean }>`
  display: flex;
  flex-direction: ${({ $reversed }) => ($reversed ? "row-reverse" : "row")};
  align-items: center;
  gap: 10px;
  padding: 5px 8px;
  border-radius: 5px;
  background-color: #1b2634;
  border: 1px solid #222f3f;
`;

export const WeaponSlotCell = styled(SlotCell)`
  width: 255px;
`;

export const IconWrap = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
`;

export const SlotIcon = styled.img`
  width: 40px;
  height: 40px;
  display: block;
`;

export const SlotBorder = styled.img`
  position: absolute;
  top: -4px;
  left: -4px;
  width: 48px;
  height: 48px;
  pointer-events: none;
`;

export const SlotText = styled.div<{ $reversed: boolean }>`
  min-width: 0;
  flex: 1;
  text-align: ${({ $reversed }) => ($reversed ? "right" : "left")};
`;

export const SlotItemName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #0070dd;
  text-shadow: 0 0 2px rgba(0, 0, 0, 1), 0 1px 4px rgba(0, 0, 0, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
`;

export const SlotLabel = styled.div`
  font-size: 11px;
  color: #5a7490;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const WeaponRowWrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 5px;
`;

export const UnequipBtn = styled.button`
  margin-top: 12px;
  width: 100%;
  padding: 9px;
  background-color: #1e2a38;
  border: 1px solid #3d5068;
  border-radius: 6px;
  color: #5a7490;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background-color 0.15s;

  &:hover {
    border-color: #6a9dbf;
    color: #e8f0f8;
    background-color: #253344;
  }
`;

export const LoadingText = styled.div`
  color: #5a7490;
  font-size: 14px;
  text-align: center;
  margin-top: 32px;
`;
