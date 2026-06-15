import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import GearSearch from "../components/timewalking/GearSearch";
import CharacterPanel from "../components/timewalking/CharacterPanel";
import Toast from "../components/Toast";
import { GearResult, CharacterData, SlotState } from "../types/timewalking";

const Page = styled.div`
  min-height: 100vh;
  background-color: #1e2a38;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px 72px;
  color: #e8f0f8;
  font-family: inherit;
`;

const BackButton = styled.button`
  width: 100%;
  max-width: 760px;
  background: none;
  border: none;
  color: #7a9ab5;
  font-size: 13px;
  cursor: pointer;
  padding: 0 0 24px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s;
  text-align: left;

  &:hover { color: #e8f0f8; }
`;

// DB armor slot names → EquipmentSlot enum values
// Ring/Trinket auto-fill is handled here; explicit slot overrides come from GearSearch slot buttons
const ARMOR_TO_SLOT: Record<string, string> = {
  Helm: "HEAD", Shoulder: "SHOULDERS", Chest: "CHEST", Bracers: "WRIST",
  Gloves: "HANDS", Belt: "WAIST", Legs: "LEGS", Feet: "FEET",
  Neck: "NECK", Cloak: "BACK",
};

const WEAPON_TO_SLOT: Record<string, string> = {
  "1H": "MAIN_HAND", "2H": "MAIN_HAND", Offhand: "OFF_HAND", Ranged: "MAIN_HAND",
};

const ALL_EQUIPMENT_SLOTS = [
  "HEAD", "NECK", "SHOULDERS", "BACK", "CHEST", "WRIST", "HANDS",
  "WAIST", "LEGS", "FEET", "FINGER_1", "FINGER_2", "TRINKET_1", "TRINKET_2",
  "MAIN_HAND", "OFF_HAND",
];

function deriveTargetSlot(item: GearResult, equipment: SlotState[]): string | null {
  if (item.kind === "armor") {
    if (item.slot === "Ring") {
      const f1 = equipment.find((e) => e.slot === "FINGER_1");
      return f1?.equipped ? "FINGER_2" : "FINGER_1";
    }
    if (item.slot === "Trinket") {
      const t1 = equipment.find((e) => e.slot === "TRINKET_1");
      return t1?.equipped ? "TRINKET_2" : "TRINKET_1";
    }
    return ARMOR_TO_SLOT[item.slot] ?? null;
  }
  return WEAPON_TO_SLOT[item.weaponSlot] ?? null;
}

const TimewalkingGearSelection: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const characterName = (location.state as { characterName?: string } | null)?.characterName;

  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [characterLoading, setCharacterLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!characterName) return;
    fetch(`/api/characters/${characterName}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json() as Promise<CharacterData>;
      })
      .then(setCharacter)
      .catch(() => setToast("Could not load character data."))
      .finally(() => setCharacterLoading(false));
  }, [characterName]);

  if (!characterName) {
    return <Navigate to="/timewalking/characters" replace />;
  }

  const handleEquip = async (item: GearResult, explicitSlot?: string) => {
    if (!character) return;

    const targetSlot = explicitSlot ?? deriveTargetSlot(item, character.equipment);
    if (!targetSlot) {
      setToast(`Cannot determine equip slot for "${item.name}".`);
      return;
    }

    try {
      const res = await fetch(`/api/characters/${characterName}/gear`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots: [{ slot: targetSlot, itemName: item.name }] }),
      });

      if (res.ok) {
        const data: { character: CharacterData } = await res.json();
        setCharacter(data.character);
      } else if (res.status === 400) {
        const data: { message: string; rejected: { slot: string; reason: string }[] } =
          await res.json();
        setToast(data.rejected?.[0]?.reason ?? data.message ?? "Validation failed.");
      } else {
        setToast("Failed to equip item. Please try again.");
      }
    } catch {
      setToast("Network error. Please try again.");
    }
  };

  const handleUnequipSlot = async (slot: string) => {
    try {
      const res = await fetch(`/api/characters/${characterName}/gear`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots: [slot] }),
      });

      if (res.ok) {
        const data: CharacterData = await res.json();
        setCharacter(data);
      } else {
        setToast("Failed to unequip item. Please try again.");
      }
    } catch {
      setToast("Network error. Please try again.");
    }
  };

  const handleUnequipAll = async () => {
    try {
      const res = await fetch(`/api/characters/${characterName}/gear`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots: ALL_EQUIPMENT_SLOTS }),
      });

      if (res.ok) {
        const data: CharacterData = await res.json();
        setCharacter(data);
      } else {
        setToast("Failed to unequip items. Please try again.");
      }
    } catch {
      setToast("Network error. Please try again.");
    }
  };

  return (
    <Page>
      <BackButton onClick={() => navigate("/timewalking/characters")}>
        ⮜ Back to Characters
      </BackButton>

      <GearSearch onEquip={handleEquip} />

      <CharacterPanel
        character={character}
        loading={characterLoading}
        onUnequipAll={handleUnequipAll}
        onUnequipSlot={handleUnequipSlot}
      />

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </Page>
  );
};

export default TimewalkingGearSelection;
