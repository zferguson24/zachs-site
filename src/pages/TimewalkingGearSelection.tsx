import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Page, BackButton } from "./TimewalkingGearSelection.styles";
import GearSearch from "../components/timewalking/GearSearch";
import CharacterPanel from "../components/timewalking/CharacterPanel";
import GearPlan from "../components/timewalking/GearPlan";
import Toast from "../components/Toast";
import { GearResult, CharacterData, SlotState } from "../types/timewalking";

// DB armor slot names → EquipmentSlot enum values
// Ring/Trinket auto-fill is handled here; explicit slot overrides come from GearSearch slot buttons
const ARMOR_TO_SLOT: Record<string, string> = {
  Head: "HEAD",
  Shoulders: "SHOULDERS",
  Chest: "CHEST",
  Wrist: "WRIST",
  Hands: "HANDS",
  Waist: "WAIST",
  Legs: "LEGS",
  Feet: "FEET",
  Neck: "NECK",
  Back: "BACK",
};

const WEAPON_TO_SLOT: Record<string, string> = {
  "1H": "MAIN_HAND",
  "2H": "MAIN_HAND",
  "Off-Hand": "OFF_HAND",
  Ranged: "MAIN_HAND",
};

const ALL_EQUIPMENT_SLOTS = [
  "HEAD",
  "NECK",
  "SHOULDERS",
  "BACK",
  "CHEST",
  "WRIST",
  "HANDS",
  "WAIST",
  "LEGS",
  "FEET",
  "FINGER_1",
  "FINGER_2",
  "TRINKET_1",
  "TRINKET_2",
  "MAIN_HAND",
  "OFF_HAND",
];

// Maps a search result to the equipment slot it should fill. Rings and trinkets auto-fill
// the first empty slot (FINGER_1/TRINKET_1), falling back to slot 2 if slot 1 is occupied.
// 1H weapons and explicit slot overrides from GearSearch bypass this function entirely.
function deriveTargetSlot(item: GearResult, equipment: SlotState[]): string | null {
  if (item.kind === "armor") {
    if (item.slot === "Finger") {
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
  // Incrementing gearPlanKey forces GearPlan to re-fetch after any gear mutation.
  const [gearPlanKey, setGearPlanKey] = useState(0);

  useEffect(() => {
    if (!characterName) {
      return;
    }
    fetch(`/api/characters/${characterName}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("not found");
        }
        return res.json() as Promise<CharacterData>;
      })
      .then(setCharacter)
      .catch(() => setToast("Could not load character data."))
      .finally(() => setCharacterLoading(false));
  }, [characterName]);

  if (!characterName) {
    return <Navigate to={ROUTES.TIMEWALKING_CHARACTERS} replace />;
  }

  // patchGear and deleteGear are the two API primitives. All equip/unequip actions are thin
  // wrappers over one of these — they share error handling and the post-mutation state update.
  const patchGear = async (slots: Array<{ slot: string; itemName: string }>, errorMsg: string) => {
    try {
      const res = await fetch(`/api/characters/${characterName}/gear`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots }),
      });
      if (res.ok) {
        const data: CharacterData = await res.json();
        setCharacter(data);
        setGearPlanKey((k) => k + 1);
      } else if (res.status === 400) {
        const data: { message: string; rejected: { slot: string; reason: string }[] } = await res.json();
        setToast(data.rejected?.[0]?.reason ?? data.message ?? "Validation failed.");
      } else {
        setToast(errorMsg);
      }
    } catch {
      setToast("Network error. Please try again.");
    }
  };

  const deleteGear = async (slots: string[]) => {
    try {
      const res = await fetch(`/api/characters/${characterName}/gear`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots }),
      });
      if (res.ok) {
        const data: CharacterData = await res.json();
        setCharacter(data);
        setGearPlanKey((k) => k + 1);
      } else {
        setToast("Failed to unequip items. Please try again.");
      }
    } catch {
      setToast("Network error. Please try again.");
    }
  };

  const handleEquip = async (item: GearResult, explicitSlot?: string) => {
    if (!character) {
      return;
    }
    const targetSlot = explicitSlot ?? deriveTargetSlot(item, character.equipment);
    if (!targetSlot) {
      setToast(`Cannot determine equip slot for "${item.name}".`);
      return;
    }
    await patchGear([{ slot: targetSlot, itemName: item.name }], "Failed to equip item. Please try again.");
  };

  const handleUnequipSlot = (slot: string) => deleteGear([slot]);
  const handleUnequipAll = () => deleteGear(ALL_EQUIPMENT_SLOTS);
  const handleEquipSlotItem = (slot: string, itemName: string) =>
    patchGear([{ slot, itemName }], "Failed to equip item. Please try again.");
  const handleApplyPlan = (slots: Array<{ slot: string; itemName: string }>) =>
    patchGear(slots, "Failed to apply gear plan. Please try again.");

  return (
    <Page>
      <BackButton onClick={() => navigate(ROUTES.TIMEWALKING_CHARACTERS)}>⮜ Back to Characters</BackButton>

      <GearSearch onEquip={handleEquip} />

      <CharacterPanel
        character={character}
        loading={characterLoading}
        onUnequipAll={handleUnequipAll}
        onUnequipSlot={handleUnequipSlot}
      />

      {characterName && (
        <GearPlan
          characterName={characterName}
          refreshKey={gearPlanKey}
          onEquipSlot={handleEquipSlotItem}
          onApplyPlan={handleApplyPlan}
        />
      )}

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </Page>
  );
};

export default TimewalkingGearSelection;
