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

export type GearResult =
  | ({ kind: "armor" } & ArmorPieceDTO)
  | ({ kind: "weapon" } & WeaponDTO);

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
  equipment: SlotState[];
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
