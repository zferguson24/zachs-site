import styled, { keyframes, css } from "styled-components";
import {
  BG_BASE,
  BG_ELEVATED,
  BG_SLOT,
  BORDER,
  BORDER_HOVER,
  BORDER_SLOT,
  BORDER_DIVIDER,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_DIM,
  TEXT_ITEM,
  FONT_XS,
  FONT_SM,
  FONT_MD,
  FONT_LG,
  RADIUS_MD,
  BREAKPOINT_MOBILE,
} from "../../styles/tokens";

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const holdFill = keyframes`
  0%   { clip-path: circle(0%   at var(--hold-x, 50%) var(--hold-y, 50%)); }
  80%  { clip-path: circle(32%  at var(--hold-x, 50%) var(--hold-y, 50%)); }
  100% { clip-path: circle(150% at var(--hold-x, 50%) var(--hold-y, 50%)); }
`;

const equipGlow = keyframes`
  0%   { border-color: ${BORDER_SLOT}; box-shadow: none;                                    transform: scale(1);    }
  18%  { border-color: #c8a84b;        box-shadow: 0 0 10px 2px rgba(200, 168, 75, 0.45); transform: scale(1.03); }
  60%  { border-color: #8a6e2a;        box-shadow: 0 0 4px 1px rgba(200, 168, 75, 0.15);  transform: scale(1.01); }
  100% { border-color: ${BORDER_SLOT}; box-shadow: none;                                    transform: scale(1);    }
`;

const unequipPulse = keyframes`
  0%   { border-color: ${BORDER_SLOT}; box-shadow: none;                                     transform: scale(1);    }
  18%  { border-color: #8a2020;        box-shadow: 0 0 8px 2px rgba(160, 40, 40, 0.35);   transform: scale(0.97); }
  60%  { border-color: #5a1818;        box-shadow: 0 0 3px 1px rgba(160, 40, 40, 0.15);   transform: scale(0.99); }
  100% { border-color: ${BORDER_SLOT}; box-shadow: none;                                     transform: scale(1);    }
`;

const ROW_MS = 50;

export const Panel = styled.div`
  width: 100%;
  max-width: 960px;
  margin-top: 32px;
`;

export const PanelHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
`;

export const CharName = styled.span<{ $color: string }>`
  font-size: ${FONT_MD};
  line-height: ${FONT_LG};
  font-weight: 700;
  color: ${({ $color }) => $color};
  letter-spacing: 0.03em;
  text-shadow:
    0 0 2px rgba(0, 0, 0, 1),
    0 0 6px rgba(0, 0, 0, 1),
    0 2px 6px rgba(0, 0, 0, 0.9);
`;

export const CharMeta = styled.span`
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
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

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    grid-template-columns: 1fr;
  }
`;

export const SlotCell = styled.div<{
  $reversed: boolean;
  $row: number;
  $animated: boolean;
  $mobileOrder: number;
  $justEquipped: boolean;
  $equipDelay: number;
  $justUnequipped: boolean;
  $unequipDelay: number;
}>`
  position: relative;
  display: flex;
  flex-direction: ${({ $reversed }) => ($reversed ? "row-reverse" : "row")};
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: ${RADIUS_MD};
  background-color: ${BG_SLOT};
  border: 1px solid ${BORDER_SLOT};
  ${({ $animated, $reversed, $row, $mobileOrder }) =>
    $animated
      ? css`
          opacity: 0;
          animation: ${$reversed ? slideInRight : slideInLeft} ${ROW_MS}ms ease both;
          animation-delay: ${$row * ROW_MS}ms;
          @media (max-width: ${BREAKPOINT_MOBILE}) {
            animation: ${slideUp} ${ROW_MS}ms ease both;
            animation-delay: ${($mobileOrder - 1) * ROW_MS}ms;
          }
        `
      : css`
          opacity: 1;
        `}
  ${({ $justEquipped, $equipDelay }) =>
    $justEquipped &&
    css`
      animation: ${equipGlow} 0.42s ease both;
      animation-delay: ${$equipDelay}ms;
      z-index: 1;
    `}
  ${({ $justUnequipped, $unequipDelay }) =>
    $justUnequipped &&
    css`
      animation: ${unequipPulse} 0.38s ease both;
      animation-delay: ${$unequipDelay}ms;
      z-index: 1;
    `}

  &:focus-visible {
    outline: 2px solid ${BORDER_HOVER};
    outline-offset: 1px;
  }

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    flex-direction: row;
    order: ${({ $mobileOrder }) => $mobileOrder};
    user-select: none;
  }
`;

export const WeaponSlotCell = styled(SlotCell)`
  width: 320px;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    width: auto;
  }
`;

export const IconWrap = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
`;

export const SlotIcon = styled.img`
  width: 48px;
  height: 48px;
  display: block;
`;

export const SlotBorder = styled.img`
  position: absolute;
  top: -4px;
  left: -4px;
  width: 56px;
  height: 56px;
  pointer-events: none;
`;

export const SlotText = styled.div<{ $reversed: boolean }>`
  min-width: 0;
  flex: 1;
  text-align: ${({ $reversed }) => ($reversed ? "right" : "left")};

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    text-align: left;
  }
`;

export const SlotItemName = styled.div`
  font-size: ${FONT_SM};
  line-height: ${FONT_MD};
  font-weight: 600;
  color: ${TEXT_ITEM};
  text-shadow:
    0 0 2px rgba(0, 0, 0, 1),
    0 1px 4px rgba(0, 0, 0, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
`;

export const SlotLabel = styled.div`
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  color: ${TEXT_DIM};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const WeaponRowWrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 5px;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    flex-direction: column;
    width: 100%;
  }
`;

export const UnequipBtn = styled.button`
  margin-top: 12px;
  width: 100%;
  padding: 9px;
  background-color: ${BG_BASE};
  border: 1px solid ${BORDER};
  border-radius: ${RADIUS_MD};
  color: ${TEXT_DIM};
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  cursor: pointer;
  transition:
    border-color 0.15s,
    color 0.15s,
    background-color 0.15s;

  &:hover {
    border-color: ${BORDER_HOVER};
    color: ${TEXT_PRIMARY};
    background-color: ${BG_ELEVATED};
  }
`;

export const LoadingText = styled.div`
  color: ${TEXT_DIM};
  font-size: ${FONT_XS};
  line-height: ${FONT_SM};
  text-align: center;
  margin-top: 32px;
`;

export const HoldOverlay = styled.div<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
  background: rgba(30, 35, 42, 0.9);
  clip-path: circle(0% at var(--hold-x, 50%) var(--hold-y, 50%));
  ${({ $active }) =>
    $active
      ? css`
          animation: ${holdFill} 1s linear forwards;
        `
      : css`
          animation: none;
        `}
`;
