import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CharacterSummaryDTO } from "../types/timewalking";
import {
  Page, PageTitle, PageSubtitle, ListArea, CharacterCard,
  IconsGroup, SingleIconWrapper, RaceClassIcon, RaceClassIconBorder,
  CharInfo, CharName, CharMeta,
  Spinner, EmptyMessage, AnimatedCardWrapper,
  AddCharacterCard, AddIcon, CreateForm, FormRow, FormField, FormLabel,
  FormInput, FormSelect, FormActions, SubmitButton, CancelButton, FormError,
} from "./CharacterList.styles";

const ICON_BASE = "https://wow.zamimg.com/images/wow/icons/medium/";
const ICON_BORDER_URL = "https://wow.zamimg.com/images/Icon/large/border/default.png";

const ALL_CLASSES = [
  "DEATH_KNIGHT", "DEMON_HUNTER", "DRUID", "EVOKER", "HUNTER",
  "MAGE", "MONK", "PALADIN", "PRIEST", "ROGUE", "SHAMAN", "WARLOCK", "WARRIOR",
];

// Mirrors CharacterValidator.java — frontend filters the race dropdown for UX;
// backend is the authoritative source of truth.
const VALID_RACES_BY_CLASS: Record<string, string[]> = {
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

// Icons are ordered race → class (opposite of "Class · Race" text order)
const RACE_ICON_SLUGS: Record<string, string> = {
  HUMAN:                "race_human_male",
  ORC:                  "race_orc_male",
  DWARF:                "race_dwarf_male",
  GNOME:                "race_gnome_male",
  NIGHT_ELF:            "race_nightelf_male",
  DRAENEI:              "race_draenei_male",
  WORGEN:               "race_worgen_male",
  VOID_ELF:             "race_voidelf_male",
  LIGHTFORGED_DRAENEI:  "race_lightforgeddraenei_male",
  KUL_TIRAN:            "race_kultiran_male",
  DARK_IRON_DWARF:      "race_darkirondwarf_male",
  MECHAGNOME:           "race_mechagnome_male",
  TROLL:                "race_troll_male",
  TAUREN:               "race_tauren_male",
  UNDEAD:               "race_scourge_male",
  BLOOD_ELF:            "race_bloodelf_male",
  GOBLIN:               "race_goblin_male",
  NIGHTBORNE:           "race_nightborne_male",
  HIGHMOUNTAIN_TAUREN:  "race_highmountaintauren_male",
  MAGHAR_ORC:           "race_magharorc_male",
  VULPERA:              "race_vulpera_male",
  ZANDALARI_TROLL:      "race_zandalaritroll_male",
  PANDAREN:             "race_pandaren_male",
  DRACTHYR:             "race_dracthyr_male",
  EARTHEN:              "race_earthendwarf_male",
  HARANIR:              "inv_misc_questionmark",
};

const CLASS_COLORS: Record<string, string> = {
  DEATH_KNIGHT:  "#C41E3A",
  DEMON_HUNTER:  "#A330C9",
  DRUID:         "#FF7C0A",
  EVOKER:        "#33937F",
  HUNTER:        "#AAD372",
  MAGE:          "#3FC7EB",
  MONK:          "#00FF98",
  PALADIN:       "#F48CBA",
  PRIEST:        "#FFFFFF",
  ROGUE:         "#FFF468",
  SHAMAN:        "#0070DD",
  WARLOCK:       "#8788EE",
  WARRIOR:       "#C69B6D",
};

const CLASS_ICON_SLUGS: Record<string, string> = {
  DEATH_KNIGHT:  "classicon_deathknight",
  DEMON_HUNTER:  "classicon_demonhunter",
  DRUID:         "classicon_druid",
  EVOKER:        "classicon_evoker",
  HUNTER:        "classicon_hunter",
  MAGE:          "classicon_mage",
  MONK:          "classicon_monk",
  PALADIN:       "classicon_paladin",
  PRIEST:        "classicon_priest",
  ROGUE:         "classicon_rogue",
  SHAMAN:        "classicon_shaman",
  WARLOCK:       "classicon_warlock",
  WARRIOR:       "classicon_warrior",
};

function formatEnum(raw: string): string {
  return raw.split("_").map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newClass, setNewClass] = useState("");
  const [newRace, setNewRace] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/characters")
      .then((res) => res.json())
      .then((data: CharacterSummaryDTO[]) => {
        setCharacters(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = (name: string) => {
    navigate("/timewalking/gear", { state: { characterName: name } });
  };

  const openForm = () => {
    setNewName("");
    setNewClass("");
    setNewRace("");
    setFormError(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormError(null);
  };

  const handleClassChange = (cls: string) => {
    setNewClass(cls);
    setNewRace("");
    setFormError(null);
  };

  const handleSubmit = async () => {
    if (!newName.trim()) { setFormError("Name is required."); return; }
    if (!newClass) { setFormError("Please select a class."); return; }
    if (!newRace) { setFormError("Please select a race."); return; }

    setSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), race: newRace, characterClass: newClass }),
      });

      if (res.ok) {
        const data: { name: string } = await res.json();
        navigate("/timewalking/gear", { state: { characterName: data.name } });
      } else {
        const data: { message?: string } = await res.json();
        setFormError(data.message ?? "Failed to create character.");
      }
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const validRaces = newClass ? (VALID_RACES_BY_CLASS[newClass] ?? []) : [];

  return (
    <Page>
      <PageTitle>Characters</PageTitle>
      <PageSubtitle>Select a character to manage their gear.</PageSubtitle>

      <ListArea>
        {loading && <Spinner />}

        {!loading && characters.length === 0 && !formOpen && (
          <EmptyMessage>No characters found.</EmptyMessage>
        )}

        {!loading && characters.map((char, i) => {
          const raceSlug = RACE_ICON_SLUGS[char.race] ?? "inv_misc_questionmark";
          const classSlug = CLASS_ICON_SLUGS[char.characterClass] ?? "inv_misc_questionmark";
          const classColor = CLASS_COLORS[char.characterClass] ?? "#e8f0f8";
          return (
            <AnimatedCardWrapper key={char.name} $index={i}>
              <CharacterCard onClick={() => handleSelect(char.name)}>
                <IconsGroup>
                  <SingleIconWrapper>
                    <RaceClassIcon src={`${ICON_BASE}${raceSlug}.jpg`} alt={formatEnum(char.race)} />
                    <RaceClassIconBorder src={ICON_BORDER_URL} alt="" />
                  </SingleIconWrapper>
                  <SingleIconWrapper>
                    <RaceClassIcon src={`${ICON_BASE}${classSlug}.jpg`} alt={formatEnum(char.characterClass)} />
                    <RaceClassIconBorder src={ICON_BORDER_URL} alt="" />
                  </SingleIconWrapper>
                </IconsGroup>
                <CharInfo>
                  <CharName $color={classColor}>{char.name}</CharName>
                  <CharMeta>
                    {formatEnum(char.characterClass)} · {formatEnum(char.race)}
                  </CharMeta>
                </CharInfo>
              </CharacterCard>
            </AnimatedCardWrapper>
          );
        })}

        {!loading && !formOpen && (
          <AddCharacterCard onClick={openForm}>
            <AddIcon>+</AddIcon>
            Create a new character...
          </AddCharacterCard>
        )}

        {!loading && formOpen && (
          <CreateForm>
            <FormRow>
              <FormField style={{ flex: 2 }}>
                <FormLabel htmlFor="char-name">Name</FormLabel>
                <FormInput
                  id="char-name"
                  type="text"
                  placeholder="Character name"
                  value={newName}
                  onChange={(e) => { setNewName(e.target.value); setFormError(null); }}
                  autoFocus
                />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <FormLabel htmlFor="char-class">Class</FormLabel>
                <FormSelect
                  id="char-class"
                  value={newClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                >
                  <option value="">Select class...</option>
                  {ALL_CLASSES.map((cls) => (
                    <option key={cls} value={cls}>{formatEnum(cls)}</option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel htmlFor="char-race">Race</FormLabel>
                <FormSelect
                  id="char-race"
                  value={newRace}
                  onChange={(e) => { setNewRace(e.target.value); setFormError(null); }}
                  disabled={!newClass}
                >
                  <option value="">Select race...</option>
                  {validRaces.map((race) => (
                    <option key={race} value={race}>{formatEnum(race)}</option>
                  ))}
                </FormSelect>
              </FormField>
            </FormRow>
            {formError && <FormError>{formError}</FormError>}
            <FormActions>
              <CancelButton type="button" onClick={closeForm}>Cancel</CancelButton>
              <SubmitButton type="button" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Creating..." : "Create Character"}
              </SubmitButton>
            </FormActions>
          </CreateForm>
        )}
      </ListArea>
    </Page>
  );
};

export default CharacterList;
