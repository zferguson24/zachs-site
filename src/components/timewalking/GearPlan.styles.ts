import styled, { css } from "styled-components";
import {
  BG_SLOT,
  BG_ELEVATED,
  BG_HOVER,
  BG_ACCENT,
  BG_ACCENT_HOVER,
  BORDER_SLOT,
  BORDER_DIVIDER,
  BORDER,
  BORDER_HOVER,
  BORDER_ACCENT,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_DIM,
  TEXT_BRIGHT,
  TEXT_ERROR,
  TEXT_ITEM,
  TEXT_ACCENT,
  FONT_XXS,
  FONT_XS,
  FONT_SM,
  FONT_MD,
  FONT_LG,
  RADIUS_MD,
  RADIUS_SM,
  BREAKPOINT_MOBILE,
} from "../../styles/tokens";

export const PlanWrapper = styled.div`
  width: 100%;
  max-width: 960px;
  margin-top: 32px;
`;

export const PlanHead = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

export const StatButtonGroup = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

export const StatButton = styled.button<{ $active: boolean; $color: string }>`
  padding: 3px 11px;
  font-size: ${FONT_XS};
  font-family: inherit;
  font-weight: 600;
  border-radius: ${RADIUS_SM};
  cursor: pointer;
  transition:
    color 0.15s,
    background 0.15s,
    border-color 0.15s;

  color: ${({ $active, $color }) => ($active ? $color : TEXT_DIM)};
  background: ${({ $active, $color }) => ($active ? `${$color}1a` : BG_ELEVATED)};
  border: 1px solid ${({ $active, $color }) => ($active ? $color : BORDER)};

  &:hover:not(:disabled) {
    border-color: ${({ $color }) => $color};
    color: ${({ $color }) => $color};
    background: ${({ $color }) => `${$color}1a`};
  }

  &:focus-visible {
    outline: 2px solid ${({ $color }) => $color};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const PlanActions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const BadgeTotal = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const BadgeCount = styled.span`
  font-size: ${FONT_MD};
  font-weight: 700;
  color: ${TEXT_BRIGHT};
`;

export const BadgeIconWrap = styled.div`
  position: relative;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

export const BadgeIconImg = styled.img`
  width: 16px;
  height: 16px;
  display: block;
`;

export const BadgeIconBorder = styled.img`
  position: absolute;
  top: -2px;
  left: -2px;
  width: 20px;
  height: 20px;
  pointer-events: none;
`;

export const ApplyPlanButton = styled.button`
  padding: 5px 14px;
  font-size: ${FONT_SM};
  font-family: inherit;
  font-weight: 600;
  color: ${TEXT_ACCENT};
  background: ${BG_ACCENT};
  border: 1px solid ${BORDER_ACCENT};
  border-radius: ${RADIUS_SM};
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.15s,
    border-color 0.15s;

  &:hover:not(:disabled) {
    background: ${BG_ACCENT_HOVER};
    border-color: ${BORDER_HOVER};
  }

  &:focus-visible {
    outline: 2px solid ${BORDER_HOVER};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const PlanTitle = styled.span`
  font-size: ${FONT_LG};
  font-weight: 700;
  color: ${TEXT_PRIMARY};
  letter-spacing: 0.03em;
`;

export const PlanSummary = styled.span`
  font-size: ${FONT_SM};
  color: ${TEXT_SECONDARY};
`;

export const PlanDivider = styled.hr`
  border: none;
  border-top: 1px solid ${BORDER_DIVIDER};
  margin: 0 0 14px;
`;

export const EventList = styled.div<{ $stale?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: ${({ $stale }) => ($stale ? 0.5 : 1)};
  transition: opacity 0.15s;
`;

export const EventCard = styled.div<{ $turbulent?: boolean }>`
  position: relative;
  padding: 12px 14px;
  background-color: ${BG_SLOT};
  border: 1px solid ${BORDER_SLOT};
  border-radius: ${RADIUS_MD};
  ${({ $turbulent }) =>
    $turbulent &&
    css`
      border-left: 3px solid rgba(200, 162, 74, 0.65);
      background-color: rgba(200, 162, 74, 0.05);
    `}
`;

export const EventCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 9px;
`;

export const ExpansionIconWrap = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
`;

export const ExpansionIconImg = styled.img`
  width: 48px;
  height: 48px;
  display: block;
`;

export const ExpansionIconBorder = styled.img`
  position: absolute;
  top: -5px;
  left: -5px;
  width: 58px;
  height: 58px;
  pointer-events: none;
`;

export const EventHeaderText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TurbulentBadge = styled.div`
  position: absolute;
  top: 11px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TurbulentLabel = styled.span`
  font-size: ${FONT_SM};
  font-weight: 700;
  color: rgba(200, 162, 74, 0.85);
  letter-spacing: 0.02em;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    display: none;
  }
`;

export const TurbulentIconWrap = styled.div`
  position: relative;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
`;

export const TurbulentIconImg = styled.img`
  width: 28px;
  height: 28px;
  display: block;
`;

export const TurbulentIconBorder = styled.img`
  position: absolute;
  top: -3px;
  left: -3px;
  width: 34px;
  height: 34px;
  pointer-events: none;
`;

export const EventDateRange = styled.div`
  font-size: ${FONT_SM};
  color: ${TEXT_SECONDARY};
  margin-bottom: 3px;
`;

export const EventExpansion = styled.div`
  font-size: ${FONT_MD};
  font-weight: 700;
  color: ${TEXT_BRIGHT};
  letter-spacing: 0.03em;
`;

export const SlotTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

export const SlotTag = styled.span`
  font-size: ${FONT_XXS};
  color: ${TEXT_DIM};
  background: ${BG_ELEVATED};
  border: 1px solid ${BORDER};
  border-radius: ${RADIUS_SM};
  padding: 2px 7px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const SlotItemGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    flex-direction: column;
  }
`;

export const SlotItemCard = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  flex: 1;
  max-width: calc(25% - 6px);
  background: ${BG_ELEVATED};
  border: 1px solid ${BORDER};
  border-radius: ${RADIUS_MD};
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition:
    border-color 0.15s,
    background 0.15s;

  &:hover:not(:disabled) {
    border-color: ${BORDER_HOVER};
    background: ${BG_HOVER};
  }

  &:focus-visible {
    outline: 2px solid ${BORDER_HOVER};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    width: 100%;
    max-width: 100%;
  }
`;

export const SlotItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  flex: 1;
  min-width: 0;
`;

export const SlotIconWrap = styled.div`
  position: relative;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
`;

export const SlotItemImg = styled.img`
  width: 44px;
  height: 44px;
  display: block;
`;

export const SlotItemBorderImg = styled.img`
  position: absolute;
  top: -4px;
  left: -4px;
  width: 52px;
  height: 52px;
  pointer-events: none;
`;

export const SlotPlaceholder = styled.div`
  width: 36px;
  height: 36px;
  background: ${BG_SLOT};
  border: 1px solid ${BORDER_SLOT};
  border-radius: ${RADIUS_SM};
`;

export const SlotItemName = styled.div`
  font-size: ${FONT_XS};
  font-weight: 700;
  color: ${TEXT_ITEM};
  line-height: 1.3;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SlotItemLabel = styled.div`
  font-size: ${FONT_XXS};
  color: ${TEXT_DIM};
  text-transform: uppercase;
  letter-spacing: 0.04em;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    display: none;
  }
`;

export const SlotItemCost = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${FONT_XXS};
  font-weight: 700;
  color: ${TEXT_SECONDARY};
`;

export const PlanStatusLine = styled.div<{ $error?: boolean }>`
  font-size: ${FONT_SM};
  color: ${({ $error }) => ($error ? TEXT_ERROR : TEXT_DIM)};
  padding: 4px 0 10px;
`;
