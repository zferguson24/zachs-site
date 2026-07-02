import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CharacterSummaryDTO, CharacterData } from "../types/timewalking";
import { ROUTES } from "../constants/routes";
import { getJson, sendJson, apiErrorMessage } from "../services/api";
import { formatEnum } from "../utils/format";
import { ICON_BASE, ICON_BORDER_URL } from "../constants/wow";
import { ALL_CLASSES, CLASS_ICON_SLUGS, CLASS_COLORS, getRaceIconSlug } from "../constants/wow";
import {
  Page,
  PageTitle,
  PageSubtitle,
  ListArea,
  CharacterCard,
  ChevronIndicator,
  IconsGroup,
  SingleIconWrapper,
  RaceClassIcon,
  RaceClassIconBorder,
  CharInfo,
  CharName,
  CharMeta,
  Spinner,
  EmptyMessage,
  AnimatedCardWrapper,
  AddCharacterCard,
  AddIcon,
  CreateForm,
  FormRow,
  FormField,
  FormLabel,
  FormInput,
  FormSelect,
  FormActions,
  SubmitButton,
  CancelButton,
  FormError,
} from "./CharacterList.styles";

const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterSummaryDTO[]>([]);
  const [racesByClass, setRacesByClass] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newClass, setNewClass] = useState("");
  const [newRace, setNewRace] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [addButtonAnimated, setAddButtonAnimated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const charsFetch = getJson<CharacterSummaryDTO[]>("/api/characters");

    // creation-info failing shouldn't block the list — the form just loses its
    // race options, so fall back to an empty map.
    const infoFetch = getJson<Record<string, string[]>>("/api/characters/creation-info").catch(
      () => ({}) as Record<string, string[]>,
    );

    Promise.all([charsFetch, infoFetch])
      .then(([chars, raceClasses]) => {
        setCharacters(chars);
        setRacesByClass(raceClasses);
        setLoading(false);
      })
      .catch(() => {
        setFetchError(true);
        setLoading(false);
      });
  }, []);

  const handleSelect = (name: string) => {
    navigate(ROUTES.TIMEWALKING_GEAR, { state: { characterName: name } });
  };

  const openForm = () => {
    setAddButtonAnimated(true);
    setNewName("");
    setNewGender("");
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
    if (!newName.trim()) {
      setFormError("Name is required.");
      return;
    }
    if (!newGender) {
      setFormError("Please select a gender.");
      return;
    }
    if (!newClass) {
      setFormError("Please select a class.");
      return;
    }
    if (!newRace) {
      setFormError("Please select a race.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const data = await sendJson<CharacterData>("/api/characters", "POST", {
        name: newName.trim(),
        race: newRace,
        characterClass: newClass,
        gender: newGender,
      });
      navigate(ROUTES.TIMEWALKING_GEAR, { state: { characterName: data.name } });
    } catch (err) {
      setFormError(apiErrorMessage(err, "Failed to create character."));
    } finally {
      setSubmitting(false);
    }
  };

  const validRaces = newClass ? (racesByClass[newClass] ?? []) : [];

  return (
    <Page>
      <PageTitle>Characters</PageTitle>
      <PageSubtitle>Select a character to manage their gear.</PageSubtitle>

      <ListArea>
        {loading && <Spinner />}

        {/* A failed fetch and an empty list are different situations — say which one happened. */}
        {!loading && fetchError && (
          <EmptyMessage role="alert">Couldn't load characters. Please try again later.</EmptyMessage>
        )}

        {!loading && !fetchError && characters.length === 0 && (
          <EmptyMessage>No characters yet — create your first one below.</EmptyMessage>
        )}

        {!loading &&
          !fetchError &&
          characters.map((char, i) => {
            const raceSlug = getRaceIconSlug(char.race, char.gender);
            const classSlug = CLASS_ICON_SLUGS[char.characterClass] ?? "inv_misc_questionmark";
            const classColor = CLASS_COLORS[char.characterClass] ?? "#e8f0f8";
            return (
              <AnimatedCardWrapper key={char.name} $index={i}>
                <CharacterCard type="button" onClick={() => handleSelect(char.name)}>
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
                  <ChevronIndicator aria-hidden="true">❯</ChevronIndicator>
                </CharacterCard>
              </AnimatedCardWrapper>
            );
          })}

        {!loading &&
          !fetchError &&
          !formOpen &&
          (addButtonAnimated ? (
            <AddCharacterCard type="button" onClick={openForm}>
              <AddIcon>+</AddIcon>Create a new character...
            </AddCharacterCard>
          ) : (
            <AnimatedCardWrapper $index={characters.length}>
              <AddCharacterCard type="button" onClick={openForm}>
                <AddIcon>+</AddIcon>Create a new character...
              </AddCharacterCard>
            </AnimatedCardWrapper>
          ))}

        {!loading && formOpen && (
          <CreateForm
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit();
            }}
          >
            <FormRow>
              <FormField style={{ flex: 2 }}>
                <FormLabel htmlFor="char-name">Name</FormLabel>
                <FormInput
                  id="char-name"
                  type="text"
                  placeholder="Character name"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setFormError(null);
                  }}
                  autoComplete="off"
                  autoFocus
                />
              </FormField>
              <FormField style={{ flex: 1 }}>
                <FormLabel htmlFor="char-gender">Gender</FormLabel>
                <FormSelect
                  id="char-gender"
                  value={newGender}
                  onChange={(e) => {
                    setNewGender(e.target.value);
                    setFormError(null);
                  }}
                >
                  <option value="">Select gender...</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </FormSelect>
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <FormLabel htmlFor="char-class">Class</FormLabel>
                <FormSelect id="char-class" value={newClass} onChange={(e) => handleClassChange(e.target.value)}>
                  <option value="">Select class...</option>
                  {ALL_CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      {formatEnum(cls)}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel htmlFor="char-race">Race</FormLabel>
                <FormSelect
                  id="char-race"
                  value={newRace}
                  onChange={(e) => {
                    setNewRace(e.target.value);
                    setFormError(null);
                  }}
                  disabled={!newClass}
                >
                  <option value="">Select race...</option>
                  {validRaces.map((race) => (
                    <option key={race} value={race}>
                      {formatEnum(race)}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
            </FormRow>
            {formError && <FormError>{formError}</FormError>}
            <FormActions>
              <CancelButton type="button" onClick={closeForm}>
                Cancel
              </CancelButton>
              <SubmitButton type="submit" disabled={submitting}>
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
