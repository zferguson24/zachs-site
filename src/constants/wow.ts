export const SLOT_LABELS: Record<string, string> = {
  HEAD: "Head",
  NECK: "Neck",
  SHOULDERS: "Shoulders",
  BACK: "Back",
  CHEST: "Chest",
  WRIST: "Wrist",
  HANDS: "Hands",
  WAIST: "Waist",
  LEGS: "Legs",
  FEET: "Feet",
  FINGER_1: "Finger 1",
  FINGER_2: "Finger 2",
  TRINKET_1: "Trinket 1",
  TRINKET_2: "Trinket 2",
  MAIN_HAND: "Main-Hand",
  OFF_HAND: "Off-Hand",
};

export const ICON_BASE = "https://wow.zamimg.com/images/wow/icons/large/";
export const ICON_BORDER_URL = "https://wow.zamimg.com/images/Icon/large/border/default.png";

export const EXPANSION_ICON_SLUGS: Record<string, string> = {
  Classic: "achievement_zone_elwynnforest",
  "Burning Crusade": "expansionicon_burningcrusade",
  "Wrath of the Lich King": "expansionicon_wrathofthelichking",
  Cataclysm: "expansionicon_cataclysm",
  "Mists of Pandaria": "expansionicon_mistsofpandaria",
  "Warlords of Draenor": "expansionicon_draenor",
  Legion: "achievements_zone_brokenshore",
  "Battle for Azeroth": "icon_treasuremap",
  Shadowlands: "achievement_raid_revendrethraid_siredenathrius",
  Dragonflight: "achievement_zone_thaldraszus",
};

// Ordered list used for the class dropdown in the character creation form.
export const ALL_CLASSES = [
  "DEATH_KNIGHT",
  "DEMON_HUNTER",
  "DRUID",
  "EVOKER",
  "HUNTER",
  "MAGE",
  "MONK",
  "PALADIN",
  "PRIEST",
  "ROGUE",
  "SHAMAN",
  "WARLOCK",
  "WARRIOR",
] as const;

// Icons ordered race → class (opposite of "Class · Race" text display)
export const RACE_ICON_SLUGS: Record<string, string> = {
  HUMAN: "race_human_male",
  ORC: "race_orc_male",
  DWARF: "race_dwarf_male",
  GNOME: "race_gnome_male",
  NIGHT_ELF: "race_nightelf_male",
  DRAENEI: "race_draenei_male",
  WORGEN: "race_worgen_male",
  VOID_ELF: "race_voidelf_male",
  LIGHTFORGED_DRAENEI: "race_lightforgeddraenei_male",
  KUL_TIRAN: "race_kultiran_male",
  DARK_IRON_DWARF: "race_darkirondwarf_male",
  MECHAGNOME: "race_mechagnome_male",
  TROLL: "race_troll_male",
  TAUREN: "race_tauren_male",
  UNDEAD: "race_scourge_male",
  BLOOD_ELF: "race_bloodelf_male",
  GOBLIN: "race_goblin_male",
  NIGHTBORNE: "race_nightborne_male",
  HIGHMOUNTAIN_TAUREN: "race_highmountaintauren_male",
  MAGHAR_ORC: "race_magharorc_male",
  VULPERA: "race_vulpera_male",
  ZANDALARI_TROLL: "race_zandalaritroll_male",
  PANDAREN: "race_pandaren_male",
  DRACTHYR: "race_dracthyr_male",
  EARTHEN: "race_earthendwarf_male",
  HARANIR: "inv12_haranir_character_creation_male",
};

export const CLASS_ICON_SLUGS: Record<string, string> = {
  DEATH_KNIGHT: "classicon_deathknight",
  DEMON_HUNTER: "classicon_demonhunter",
  DRUID: "classicon_druid",
  EVOKER: "classicon_evoker",
  HUNTER: "classicon_hunter",
  MAGE: "classicon_mage",
  MONK: "classicon_monk",
  PALADIN: "classicon_paladin",
  PRIEST: "classicon_priest",
  ROGUE: "classicon_rogue",
  SHAMAN: "classicon_shaman",
  WARLOCK: "classicon_warlock",
  WARRIOR: "classicon_warrior",
};

export function getRaceIconSlug(race: string, gender: string): string {
  const base = RACE_ICON_SLUGS[race] ?? "inv_misc_questionmark";
  if (gender === "FEMALE") {
    return base.replace("_male", "_female");
  }
  return base;
}

export const CLASS_COLORS: Record<string, string> = {
  DEATH_KNIGHT: "#C41E3A",
  DEMON_HUNTER: "#A330C9",
  DRUID: "#FF7C0A",
  EVOKER: "#33937F",
  HUNTER: "#AAD372",
  MAGE: "#3FC7EB",
  MONK: "#00FF98",
  PALADIN: "#F48CBA",
  PRIEST: "#FFFFFF",
  ROGUE: "#FFF468",
  SHAMAN: "#0070DD",
  WARLOCK: "#8788EE",
  WARRIOR: "#C69B6D",
};
