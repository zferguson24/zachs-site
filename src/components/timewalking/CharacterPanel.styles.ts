import styled, { keyframes, css } from "styled-components";
import {
  BG_BASE, BG_ELEVATED, BG_SLOT,
  BORDER, BORDER_HOVER, BORDER_SLOT, BORDER_DIVIDER,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DIM, TEXT_ITEM,
} from "../../styles/tokens";

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const ROW_MS = 50;

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

export const CharName = styled.span<{ $color: string }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  letter-spacing: 0.03em;
  text-shadow:
    0 0 2px rgba(0, 0, 0, 1),
    0 0 6px rgba(0, 0, 0, 1),
    0 2px 6px rgba(0, 0, 0, 0.9);
`;

export const CharMeta = styled.span`
  font-size: 13px;
  color: ${TEXT_SECONDARY};
`;

export const PanelDivider = styled.hr`
  border: none;
  border-top: 1px solid ${BORDER_DIVIDER};
  margin: 0 0 14px;
`;

export const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
`;

export const SlotCell = styled.div<{ $reversed: boolean; $row: number; $animated: boolean }>`
  display: flex;
  flex-direction: ${({ $reversed }) => ($reversed ? "row-reverse" : "row")};
  align-items: center;
  gap: 10px;
  padding: 5px 8px;
  border-radius: 5px;
  background-color: ${BG_SLOT};
  border: 1px solid ${BORDER_SLOT};
  ${({ $animated, $reversed, $row }) => $animated
    ? css`
        opacity: 0;
        animation: ${$reversed ? slideInRight : slideInLeft} ${ROW_MS}ms ease both;
        animation-delay: ${$row * ROW_MS}ms;
      `
    : css`opacity: 1;`
  }
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
  color: ${TEXT_ITEM};
  text-shadow: 0 0 2px rgba(0, 0, 0, 1), 0 1px 4px rgba(0, 0, 0, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
`;

export const SlotLabel = styled.div`
  font-size: 11px;
  color: ${TEXT_DIM};
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
  background-color: ${BG_BASE};
  border: 1px solid ${BORDER};
  border-radius: 6px;
  color: ${TEXT_DIM};
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background-color 0.15s;

  &:hover {
    border-color: ${BORDER_HOVER};
    color: ${TEXT_PRIMARY};
    background-color: ${BG_ELEVATED};
  }
`;

export const LoadingText = styled.div`
  color: ${TEXT_DIM};
  font-size: 14px;
  text-align: center;
  margin-top: 32px;
`;
