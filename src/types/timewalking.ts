export interface ArmorPieceDTO {
  armorType: string;
  slot: string;
  name: string;
  expansion: string;
  primaryStat: string;
  secondaryStat: string;
  cost: number;
  notes: string;
  wowheadUrl: string;
  iconUrl: string | null;
}

export interface WeaponDTO {
  weaponSlot: string;
  weaponStat: string;
  weaponType: string;
  name: string;
  expansion: string;
  primaryStat: string;
  secondaryStat: string;
  cost: number;
  notes: string;
  wowheadUrl: string;
  iconUrl: string | null;
}

export type GearResult = ({ kind: "armor" } & ArmorPieceDTO) | ({ kind: "weapon" } & WeaponDTO);

export interface EquippedItem {
  name: string;
  iconUrl: string | null;
  weaponSlot?: string | null;
}

export interface SlotState {
  slot: string;
  equipped: boolean;
  item: EquippedItem | null;
}

export interface CharacterData {
  name: string;
  race: string;
  characterClass: string;
  gender: string;
  equipment: SlotState[];
}

export interface NotFoundSlot {
  slot: string;
  itemName: string;
}

// Wrapped response from PATCH /api/characters/{name}/gear. `notFound` lists
// requested items whose names had no match in the database (silently skipped
// server-side), so the UI can surface partial applies.
export interface EquipResponse {
  character: CharacterData;
  equipped: string[];
  notFound: NotFoundSlot[];
}

export interface ExpansionGearDTO {
  expansion: string;
  armorPieces: ArmorPieceDTO[];
  weapons: WeaponDTO[];
}

export interface GearSearchResultDTO {
  armorPieces: ArmorPieceDTO[];
  weapons: WeaponDTO[];
}

export interface CharacterSummaryDTO {
  name: string;
  race: string;
  characterClass: string;
  gender: string;
}

export interface GearPlanSlot {
  slot: string;
  itemName: string;
  iconUrl: string | null;
  cost: number;
}

export interface GearPlanEvent {
  expansion: string;
  startDate: string;
  endDate: string;
  slots: GearPlanSlot[];
  cumulativeSlotsFilled: number;
  turbulentTimeways: boolean;
}

export interface GearPlanResponse {
  characterName: string;
  resolvedStat: string;
  fullyEquipped: boolean;
  fullyEquippedDate: string | null;
  alreadyEquippedSlots: string[];
  unresolvableSlots: string[];
  events: GearPlanEvent[];
  statOptions: string[];
}
