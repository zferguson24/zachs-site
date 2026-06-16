// Ordered list used for the class dropdown in the character creation form.
export const ALL_CLASSES = [
  "DEATH_KNIGHT", "DEMON_HUNTER", "DRUID", "EVOKER", "HUNTER",
  "MAGE", "MONK", "PALADIN", "PRIEST", "ROGUE", "SHAMAN", "WARLOCK", "WARRIOR",
] as const;

// Mirrors CharacterValidator.java — frontend filters the race dropdown for UX;
// backend is the authoritative source of truth.
export const VALID_RACES_BY_CLASS: Record<string, string[]> = {
  DEATH_KNIGHT: [
    "HUMAN", "ORC", "DWARF", "GNOME", "NIGHT_ELF", "DRAENEI", "WORGEN",
    "VOID_ELF", "LIGHTFORGED_DRAENEI", "KUL_TIRAN", "DARK_IRON_DWARF", "MECHAGNOME",
    "TROLL", "TAUREN", "UNDEAD", "BLOOD_ELF", "GOBLIN",
    "NIGHTBORNE", "HIGHMOUNTAIN_TAUREN", "MAGHAR_ORC", "VULPERA", "ZANDALARI_TROLL",
    "PANDAREN", "EARTHEN",
  ],
  DEMON_HUNTER: ["NIGHT_ELF", "BLOOD_ELF", "VOID_ELF"],
  DRUID: [
    "NIGHT_ELF", "WORGEN", "TAUREN", "TROLL", "ZANDALARI_TROLL",
    "KUL_TIRAN", "HIGHMOUNTAIN_TAUREN", "HARANIR",
  ],
  EVOKER: ["DRACTHYR"],
  HUNTER: [
    "HUMAN", "ORC", "DWARF", "GNOME", "NIGHT_ELF", "DRAENEI", "WORGEN",
    "VOID_ELF", "LIGHTFORGED_DRAENEI", "KUL_TIRAN", "DARK_IRON_DWARF", "MECHAGNOME",
    "TROLL", "TAUREN", "UNDEAD", "BLOOD_ELF", "GOBLIN",
    "NIGHTBORNE", "HIGHMOUNTAIN_TAUREN", "MAGHAR_ORC", "VULPERA", "ZANDALARI_TROLL",
    "PANDAREN", "DRACTHYR", "EARTHEN", "HARANIR",
  ],
  MAGE: [
    "HUMAN", "ORC", "DWARF", "GNOME", "NIGHT_ELF", "DRAENEI", "WORGEN",
    "VOID_ELF", "LIGHTFORGED_DRAENEI", "KUL_TIRAN", "DARK_IRON_DWARF", "MECHAGNOME",
    "TROLL", "TAUREN", "UNDEAD", "BLOOD_ELF", "GOBLIN",
    "NIGHTBORNE", "HIGHMOUNTAIN_TAUREN", "MAGHAR_ORC", "VULPERA", "ZANDALARI_TROLL",
    "PANDAREN", "DRACTHYR", "EARTHEN", "HARANIR",
  ],
  MONK: [
    "HUMAN", "ORC", "DWARF", "GNOME", "NIGHT_ELF", "DRAENEI", "WORGEN",
    "VOID_ELF", "LIGHTFORGED_DRAENEI", "KUL_TIRAN", "DARK_IRON_DWARF", "MECHAGNOME",
    "TROLL", "TAUREN", "UNDEAD", "BLOOD_ELF", "GOBLIN",
    "NIGHTBORNE", "HIGHMOUNTAIN_TAUREN", "MAGHAR_ORC", "VULPERA", "ZANDALARI_TROLL",
    "PANDAREN", "EARTHEN", "HARANIR",
  ],
  PALADIN: [
    "HUMAN", "DWARF", "DRAENEI", "BLOOD_ELF", "TAUREN",
    "LIGHTFORGED_DRAENEI", "DARK_IRON_DWARF", "ZANDALARI_TROLL", "EARTHEN",
  ],
  PRIEST: [
    "HUMAN", "ORC", "DWARF", "GNOME", "NIGHT_ELF", "DRAENEI", "WORGEN",
    "VOID_ELF", "LIGHTFORGED_DRAENEI", "KUL_TIRAN", "DARK_IRON_DWARF", "MECHAGNOME",
    "TROLL", "TAUREN", "UNDEAD", "BLOOD_ELF", "GOBLIN",
    "NIGHTBORNE", "HIGHMOUNTAIN_TAUREN", "MAGHAR_ORC", "VULPERA", "ZANDALARI_TROLL",
    "PANDAREN", "DRACTHYR", "EARTHEN", "HARANIR",
  ],
  ROGUE: [
    "HUMAN", "ORC", "DWARF", "GNOME", "NIGHT_ELF", "DRAENEI", "WORGEN",
    "VOID_ELF", "LIGHTFORGED_DRAENEI", "KUL_TIRAN", "DARK_IRON_DWARF", "MECHAGNOME",
    "TROLL", "TAUREN", "UNDEAD", "BLOOD_ELF", "GOBLIN",
    "NIGHTBORNE", "HIGHMOUNTAIN_TAUREN", "MAGHAR_ORC", "VULPERA", "ZANDALARI_TROLL",
    "PANDAREN", "DRACTHYR", "EARTHEN", "HARANIR",
  ],
  SHAMAN: [
    "ORC", "DWARF", "DARK_IRON_DWARF", "DRAENEI",
    "TROLL", "TAUREN", "GOBLIN", "HIGHMOUNTAIN_TAUREN", "MAGHAR_ORC",
    "VULPERA", "ZANDALARI_TROLL", "PANDAREN", "EARTHEN", "HARANIR",
  ],
  WARLOCK: [
    "HUMAN", "ORC", "DWARF", "GNOME", "NIGHT_ELF", "DRAENEI", "WORGEN",
    "VOID_ELF", "LIGHTFORGED_DRAENEI", "KUL_TIRAN", "DARK_IRON_DWARF", "MECHAGNOME",
    "TROLL", "TAUREN", "UNDEAD", "BLOOD_ELF", "GOBLIN",
    "NIGHTBORNE", "HIGHMOUNTAIN_TAUREN", "MAGHAR_ORC", "VULPERA", "ZANDALARI_TROLL",
    "PANDAREN", "DRACTHYR", "EARTHEN", "HARANIR",
  ],
  WARRIOR: [
    "HUMAN", "ORC", "DWARF", "GNOME", "NIGHT_ELF", "DRAENEI", "WORGEN",
    "VOID_ELF", "LIGHTFORGED_DRAENEI", "KUL_TIRAN", "DARK_IRON_DWARF", "MECHAGNOME",
    "TROLL", "TAUREN", "UNDEAD", "BLOOD_ELF", "GOBLIN",
    "NIGHTBORNE", "HIGHMOUNTAIN_TAUREN", "MAGHAR_ORC", "VULPERA", "ZANDALARI_TROLL",
    "PANDAREN", "DRACTHYR", "EARTHEN", "HARANIR",
  ],
};

// Icons ordered race → class (opposite of "Class · Race" text display)
export const RACE_ICON_SLUGS: Record<string, string> = {
  HUMAN:               "race_human_male",
  ORC:                 "race_orc_male",
  DWARF:               "race_dwarf_male",
  GNOME:               "race_gnome_male",
  NIGHT_ELF:           "race_nightelf_male",
  DRAENEI:             "race_draenei_male",
  WORGEN:              "race_worgen_male",
  VOID_ELF:            "race_voidelf_male",
  LIGHTFORGED_DRAENEI: "race_lightforgeddraenei_male",
  KUL_TIRAN:           "race_kultiran_male",
  DARK_IRON_DWARF:     "race_darkirondwarf_male",
  MECHAGNOME:          "race_mechagnome_male",
  TROLL:               "race_troll_male",
  TAUREN:              "race_tauren_male",
  UNDEAD:              "race_scourge_male",
  BLOOD_ELF:           "race_bloodelf_male",
  GOBLIN:              "race_goblin_male",
  NIGHTBORNE:          "race_nightborne_male",
  HIGHMOUNTAIN_TAUREN: "race_highmountaintauren_male",
  MAGHAR_ORC:          "race_magharorc_male",
  VULPERA:             "race_vulpera_male",
  ZANDALARI_TROLL:     "race_zandalaritroll_male",
  PANDAREN:            "race_pandaren_male",
  DRACTHYR:            "race_dracthyr_male",
  EARTHEN:             "race_earthendwarf_male",
  HARANIR:             "inv_misc_questionmark",
};

export const CLASS_ICON_SLUGS: Record<string, string> = {
  DEATH_KNIGHT: "classicon_deathknight",
  DEMON_HUNTER: "classicon_demonhunter",
  DRUID:        "classicon_druid",
  EVOKER:       "classicon_evoker",
  HUNTER:       "classicon_hunter",
  MAGE:         "classicon_mage",
  MONK:         "classicon_monk",
  PALADIN:      "classicon_paladin",
  PRIEST:       "classicon_priest",
  ROGUE:        "classicon_rogue",
  SHAMAN:       "classicon_shaman",
  WARLOCK:      "classicon_warlock",
  WARRIOR:      "classicon_warrior",
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
  DRUID:        "#FF7C0A",
  EVOKER:       "#33937F",
  HUNTER:       "#AAD372",
  MAGE:         "#3FC7EB",
  MONK:         "#00FF98",
  PALADIN:      "#F48CBA",
  PRIEST:       "#FFFFFF",
  ROGUE:        "#FFF468",
  SHAMAN:       "#0070DD",
  WARLOCK:      "#8788EE",
  WARRIOR:      "#C69B6D",
};
