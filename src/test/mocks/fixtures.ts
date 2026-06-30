import type { CharacterData, GearPlanResponse, GearSearchResultDTO } from "../../types/timewalking";

const ALL_SLOTS = [
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

const emptyEquipment = ALL_SLOTS.map((slot) => ({ slot, equipped: false, item: null }));

export const baseCharacter: CharacterData = {
  name: "TESTCHAR",
  race: "HUMAN",
  characterClass: "WARRIOR",
  gender: "MALE",
  equipment: emptyEquipment,
};

export const characterWithHead: CharacterData = {
  ...baseCharacter,
  equipment: emptyEquipment.map((s) =>
    s.slot === "HEAD" ? { slot: "HEAD", equipped: true, item: { name: "Iron Helm", iconUrl: null } } : s,
  ),
};

export const characterWithFinger1: CharacterData = {
  ...baseCharacter,
  equipment: emptyEquipment.map((s) =>
    s.slot === "FINGER_1" ? { slot: "FINGER_1", equipped: true, item: { name: "Gold Ring", iconUrl: null } } : s,
  ),
};

export const characterWithTrinket1: CharacterData = {
  ...baseCharacter,
  equipment: emptyEquipment.map((s) =>
    s.slot === "TRINKET_1"
      ? { slot: "TRINKET_1", equipped: true, item: { name: "Ancient Trinket", iconUrl: null } }
      : s,
  ),
};

export const characterWith2H: CharacterData = {
  ...baseCharacter,
  equipment: emptyEquipment.map((s) =>
    s.slot === "MAIN_HAND"
      ? { slot: "MAIN_HAND", equipped: true, item: { name: "Big Axe", iconUrl: null, weaponSlot: "2H" } }
      : s,
  ),
};

export const characterWithRanged: CharacterData = {
  ...baseCharacter,
  equipment: emptyEquipment.map((s) =>
    s.slot === "MAIN_HAND"
      ? { slot: "MAIN_HAND", equipped: true, item: { name: "Longbow", iconUrl: null, weaponSlot: "Ranged" } }
      : s,
  ),
};

export const characterWith1H: CharacterData = {
  ...baseCharacter,
  equipment: emptyEquipment.map((s) =>
    s.slot === "MAIN_HAND"
      ? { slot: "MAIN_HAND", equipped: true, item: { name: "Short Sword", iconUrl: null, weaponSlot: "1H" } }
      : s,
  ),
};

export const characterWithIcon: CharacterData = {
  ...baseCharacter,
  equipment: emptyEquipment.map((s) =>
    s.slot === "HEAD"
      ? {
          slot: "HEAD",
          equipped: true,
          item: { name: "Iron Helm", iconUrl: "https://wow.zamimg.com/images/wow/icons/large/inv_helm.jpg" },
        }
      : s,
  ),
};

export const warriorGearPlan: GearPlanResponse = {
  characterName: "TESTCHAR",
  resolvedStat: "Strength",
  fullyEquipped: false,
  fullyEquippedDate: null,
  alreadyEquippedSlots: [],
  unresolvableSlots: [],
  statOptions: [],
  events: [
    {
      expansion: "Classic",
      startDate: "2026-07-01",
      endDate: "2026-07-08",
      turbulentTimeways: false,
      cumulativeSlotsFilled: 2,
      slots: [
        { slot: "HEAD", itemName: "Iron Helm", iconUrl: null, cost: 150 },
        { slot: "CHEST", itemName: "Iron Chestplate", iconUrl: null, cost: 200 },
      ],
    },
  ],
};

export const druidGearPlan: GearPlanResponse = {
  ...warriorGearPlan,
  characterName: "DRUID",
  resolvedStat: "Agility",
  statOptions: ["Agility", "Intellect"],
};

export const fullyEquippedPlan: GearPlanResponse = {
  characterName: "TESTCHAR",
  resolvedStat: "Strength",
  fullyEquipped: true,
  fullyEquippedDate: "2026-07-08",
  alreadyEquippedSlots: ALL_SLOTS,
  unresolvableSlots: [],
  statOptions: [],
  events: [
    {
      expansion: "Classic",
      startDate: "2026-07-01",
      endDate: "2026-07-08",
      turbulentTimeways: false,
      cumulativeSlotsFilled: 16,
      slots: [{ slot: "HEAD", itemName: "Iron Helm", iconUrl: null, cost: 150 }],
    },
  ],
};

export const alreadyFullPlan: GearPlanResponse = {
  characterName: "TESTCHAR",
  resolvedStat: "Strength",
  fullyEquipped: true,
  fullyEquippedDate: null,
  alreadyEquippedSlots: ALL_SLOTS,
  unresolvableSlots: [],
  statOptions: [],
  events: [],
};

export const planWithUnresolvable: GearPlanResponse = {
  ...warriorGearPlan,
  unresolvableSlots: ["OFF_HAND"],
};

export const turbulentPlan: GearPlanResponse = {
  ...warriorGearPlan,
  events: [{ ...warriorGearPlan.events[0], turbulentTimeways: true }],
};

export const twoEventPlan: GearPlanResponse = {
  ...warriorGearPlan,
  events: [
    warriorGearPlan.events[0],
    {
      expansion: "Burning Crusade",
      startDate: "2026-08-01",
      endDate: "2026-08-08",
      turbulentTimeways: false,
      cumulativeSlotsFilled: 4,
      slots: [{ slot: "LEGS", itemName: "BC Leggings", iconUrl: null, cost: 175 }],
    },
  ],
};

export const searchResults: GearSearchResultDTO = {
  armorPieces: [
    {
      armorType: "Plate",
      slot: "Head",
      name: "Iron Helm",
      expansion: "Classic",
      primaryStat: "Strength",
      secondaryStat: "Stamina",
      cost: 150,
      notes: "",
      wowheadUrl: "",
      iconUrl: null,
    },
    {
      armorType: "Agnostic",
      slot: "Finger",
      name: "Gold Ring",
      expansion: "Classic",
      primaryStat: "",
      secondaryStat: "",
      cost: 100,
      notes: "",
      wowheadUrl: "",
      iconUrl: null,
    },
    {
      armorType: "Agnostic",
      slot: "Trinket",
      name: "Ancient Trinket",
      expansion: "Classic",
      primaryStat: "",
      secondaryStat: "",
      cost: 120,
      notes: "",
      wowheadUrl: "",
      iconUrl: null,
    },
  ],
  weapons: [
    {
      weaponSlot: "1H",
      weaponStat: "Strength",
      weaponType: "Sword",
      name: "Broad Sword",
      expansion: "Classic",
      primaryStat: "Strength",
      secondaryStat: "Stamina",
      cost: 200,
      notes: "",
      wowheadUrl: "",
      iconUrl: null,
    },
    {
      weaponSlot: "2H",
      weaponStat: "Strength",
      weaponType: "Axe",
      name: "Great Axe",
      expansion: "Classic",
      primaryStat: "Strength",
      secondaryStat: "Stamina",
      cost: 300,
      notes: "",
      wowheadUrl: "",
      iconUrl: null,
    },
    {
      weaponSlot: "Off-Hand",
      weaponStat: "Intellect",
      weaponType: "Shield",
      name: "Iron Shield",
      expansion: "Classic",
      primaryStat: "Stamina",
      secondaryStat: "",
      cost: 100,
      notes: "",
      wowheadUrl: "",
      iconUrl: null,
    },
    {
      weaponSlot: "Ranged",
      weaponStat: "Agility",
      weaponType: "Bow",
      name: "Hunter's Bow",
      expansion: "Classic",
      primaryStat: "Agility",
      secondaryStat: "Stamina",
      cost: 150,
      notes: "",
      wowheadUrl: "",
      iconUrl: null,
    },
  ],
};

export const emptySearchResults: GearSearchResultDTO = {
  armorPieces: [],
  weapons: [],
};
