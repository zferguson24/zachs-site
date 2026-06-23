import React, { useRef, useEffect, useState } from "react";
import {
  Panel, PanelHead, CharName, CharMeta, PanelDivider,
  SlotGrid, SlotCell, WeaponSlotCell, IconWrap, SlotIcon, SlotBorder,
  SlotText, SlotItemName, SlotLabel, WeaponRowWrap, UnequipBtn, LoadingText,
  HoldOverlay,
} from "./CharacterPanel.styles";
import { CharacterData, SlotState } from "../../types/timewalking";
import { ICON_BASE_LARGE, ICON_BORDER_URL } from "../../constants/wow";
import { CLASS_COLORS } from "../../constants/wow";

const SLOT_LABELS: Record<string, string> = {
  HEAD: "Head", NECK: "Neck", SHOULDERS: "Shoulders", BACK: "Back",
  CHEST: "Chest", WRIST: "Wrist", HANDS: "Hands", WAIST: "Waist",
  LEGS: "Legs", FEET: "Feet", FINGER_1: "Finger 1", FINGER_2: "Finger 2",
  TRINKET_1: "Trinket 1", TRINKET_2: "Trinket 2",
  MAIN_HAND: "Main-Hand", OFF_HAND: "Off-Hand",
};

// zamimg has no inventoryslot_back — chest texture used as fallback (matches Wowhead's own planner)
const SLOT_PLACEHOLDERS: Record<string, string> = {
  HEAD: "inventoryslot_head", NECK: "inventoryslot_neck",
  SHOULDERS: "inventoryslot_shoulder", BACK: "inventoryslot_chest",
  CHEST: "inventoryslot_chest", WRIST: "inventoryslot_wrists",
  HANDS: "inventoryslot_hands", WAIST: "inventoryslot_waist",
  LEGS: "inventoryslot_legs", FEET: "inventoryslot_feet",
  FINGER_1: "inventoryslot_finger", FINGER_2: "inventoryslot_finger",
  TRINKET_1: "inventoryslot_trinket", TRINKET_2: "inventoryslot_trinket",
  MAIN_HAND: "inventoryslot_mainhand", OFF_HAND: "inventoryslot_offhand",
};

// Interleaved left+right columns so CSS grid fills left-col, right-col per row
const LEFT_COL  = ["HEAD", "NECK", "SHOULDERS", "BACK", "CHEST", "WRIST", "HANDS"];
const RIGHT_COL = ["WAIST", "LEGS", "FEET", "FINGER_1", "FINGER_2", "TRINKET_1", "TRINKET_2"];
const GRID_SLOTS = LEFT_COL.flatMap((l, i) => [l, RIGHT_COL[i]]);
const WEAPON_ROW = ["MAIN_HAND", "OFF_HAND"];

// On mobile (single column), left-col slots come first (order 1-7), then right-col (8-14).
// GRID_SLOTS interleaves them: even indices = left col, odd indices = right col.
function mobileSlotOrder(i: number): number {
  return i % 2 === 0 ? i / 2 + 1 : (i - 1) / 2 + 8;
}

interface CharacterPanelProps {
  character: CharacterData | null;
  loading: boolean;
  onUnequipAll: () => void;
  onUnequipSlot: (slot: string) => void;
}

function formatEnum(raw: string): string {
  return raw.split("_").map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

function slotIconSrc(slotName: string, slotData: SlotState | undefined): string {
  if (slotData?.equipped && slotData.item?.iconUrl) return slotData.item.iconUrl;
  return `${ICON_BASE_LARGE}${SLOT_PLACEHOLDERS[slotName]}.jpg`;
}

const CharacterPanel: React.FC<CharacterPanelProps> = ({
  character,
  loading,
  onUnequipAll,
  onUnequipSlot,
}) => {
  const hasAnimated   = useRef(false);
  const holdTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [holdingSlot, setHoldingSlot] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && character) hasAnimated.current = true;
  }, [loading, character]);

  // Clean up any pending hold timer on unmount
  useEffect(() => {
    return () => { if (holdTimerRef.current) clearTimeout(holdTimerRef.current); };
  }, []);

  if (loading) return <Panel><LoadingText>Loading character…</LoadingText></Panel>;
  if (!character) return null;

  const animated = !hasAnimated.current;
  const slotMap: Record<string, SlotState> = {};
  for (const s of character.equipment) slotMap[s.slot] = s;

  const clearHold = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = null;
    setHoldingSlot(null);
  };

  const renderSlotContent = (slotName: string, reversed: boolean) => {
    const s = slotMap[slotName];
    return (
      <>
        <IconWrap>
          <SlotIcon src={slotIconSrc(slotName, s)} alt={SLOT_LABELS[slotName]} />
          <SlotBorder src={ICON_BORDER_URL} alt="" />
        </IconWrap>
        <SlotText $reversed={reversed}>
          {s?.equipped && s.item && <SlotItemName>{s.item.name}</SlotItemName>}
          <SlotLabel>{SLOT_LABELS[slotName]}</SlotLabel>
        </SlotText>
      </>
    );
  };

  const contextMenuProps = (slotName: string) => {
    const s = slotMap[slotName];
    if (!s?.equipped || !s.item) {
      return { "aria-label": SLOT_LABELS[slotName] };
    }
    return {
      role: "button" as const,
      tabIndex: 0,
      "aria-label": `${SLOT_LABELS[slotName]}: ${s.item.name} — press Delete or hold to unequip`,
      title: "Right-click or Delete to unequip",
      onContextMenu: (e: React.MouseEvent) => {
        e.preventDefault();
        onUnequipSlot(slotName);
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Delete" || e.key === "Backspace") {
          e.preventDefault();
          onUnequipSlot(slotName);
        }
      },
      onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== "touch") return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + "%";
        const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + "%";
        e.currentTarget.style.setProperty("--hold-x", x);
        e.currentTarget.style.setProperty("--hold-y", y);
        setHoldingSlot(slotName);
        holdTimerRef.current = setTimeout(() => {
          onUnequipSlot(slotName);
          setHoldingSlot(null);
        }, 1000);
      },
      onPointerUp:     clearHold,
      onPointerCancel: clearHold,
      onPointerLeave:  clearHold,
    };
  };

  return (
    <Panel>
      <PanelHead>
        <CharName $color={CLASS_COLORS[character.characterClass] ?? "#e8f0f8"}>
          {character.name}
        </CharName>
        <CharMeta>
          {formatEnum(character.characterClass)} · {formatEnum(character.race)}
        </CharMeta>
      </PanelHead>
      <PanelDivider />

      <SlotGrid>
        {GRID_SLOTS.map((slot, i) => {
          const reversed = i % 2 === 1;
          const row = Math.floor(i / 2);
          return (
            <SlotCell
              key={slot}
              $reversed={reversed}
              $row={row}
              $animated={animated}
              $mobileOrder={mobileSlotOrder(i)}
              {...contextMenuProps(slot)}
            >
              <HoldOverlay $active={holdingSlot === slot} />
              {renderSlotContent(slot, reversed)}
            </SlotCell>
          );
        })}
      </SlotGrid>

      <WeaponRowWrap>
        {slotMap["MAIN_HAND"]?.item?.weaponSlot === "2H" ||
        slotMap["MAIN_HAND"]?.item?.weaponSlot === "Ranged" ? (
          <WeaponSlotCell
            $reversed={false}
            $row={LEFT_COL.length}
            $animated={animated}
            $mobileOrder={15}
            {...contextMenuProps("MAIN_HAND")}
          >
            <HoldOverlay $active={holdingSlot === "MAIN_HAND"} />
            {renderSlotContent("MAIN_HAND", false)}
          </WeaponSlotCell>
        ) : (
          WEAPON_ROW.map((slot, i) => (
            <WeaponSlotCell
              key={slot}
              $reversed={i === 1}
              $row={LEFT_COL.length}
              $animated={animated}
              $mobileOrder={15 + i}
              {...contextMenuProps(slot)}
            >
              <HoldOverlay $active={holdingSlot === slot} />
              {renderSlotContent(slot, i === 1)}
            </WeaponSlotCell>
          ))
        )}
      </WeaponRowWrap>

      <UnequipBtn onClick={onUnequipAll}>Unequip All</UnequipBtn>
    </Panel>
  );
};

export default CharacterPanel;
