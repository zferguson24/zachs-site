import React, { useState, useEffect } from "react";
import {
  SearchWrapper,
  SearchInput,
  ResultsArea,
  Spinner,
  ResultsScroller,
  ResultCard,
  CardRow,
  IconWrapper,
  ItemIconImg,
  IconBorder,
  ResultContent,
  ResultHeader,
  ResultName,
  TypeBadge,
  MetaRow,
  ResultMeta,
  MetaItem,
  MetaExpansion,
  MetaStats,
  EmptyMessage,
  SlotButtonRow,
  SlotButton,
  AnimatedCardWrapper,
} from "./GearSearch.styles";
import { GearSearchResultDTO, GearResult } from "../../types/timewalking";
import { ICON_BORDER_URL } from "../../constants/wow";
import { getJson } from "../../services/api";
const DEBOUNCE_MS = 500;
const MIN_LENGTH = 3;

interface SlotOption {
  value: string;
  label: string;
}

// Returns explicit slot choices when the user must pick; null means auto-derive (whole card clickable).
// 1H weapons, rings, and trinkets always show slot buttons since either slot is a valid target.
function getSlotOptions(item: GearResult): SlotOption[] | null {
  if (item.kind === "weapon") {
    if (item.weaponSlot === "1H") {
      return [
        { value: "MAIN_HAND", label: "Main-Hand" },
        { value: "OFF_HAND", label: "Off-Hand" },
      ];
    }
    return null;
  }

  if (item.slot === "Finger") {
    return [
      { value: "FINGER_1", label: "Finger 1" },
      { value: "FINGER_2", label: "Finger 2" },
    ];
  }

  if (item.slot === "Trinket") {
    return [
      { value: "TRINKET_1", label: "Trinket 1" },
      { value: "TRINKET_2", label: "Trinket 2" },
    ];
  }

  return null;
}

interface GearSearchProps {
  onEquip: (item: GearResult, slot?: string) => void;
}

const GearSearch: React.FC<GearSearchProps> = ({ onEquip }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GearResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(false);
  // Incremented on each completed search; passed as `key` to ResultsScroller so cards remount and re-animate.
  const [searchVersion, setSearchVersion] = useState(0);

  // Each keystroke re-runs this effect; the cleanup cancels both the pending
  // debounce timer and any in-flight request. Aborting on supersession is what
  // prevents the stale-response race (an older, slower response overwriting a
  // newer one) — after abort, the catch/finally below deliberately do nothing.
  useEffect(() => {
    if (query.length < MIN_LENGTH) {
      setResults([]);
      setLoading(false);
      setSearched(false);
      setError(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const data = await getJson<GearSearchResultDTO>(
          `/api/gear/search?q=${encodeURIComponent(query)}`,
          controller.signal,
        );
        // Backend returns separate armorPieces and weapons arrays; merge into one list
        // tagged with `kind` so downstream components can branch on armor vs weapon logic.
        const merged: GearResult[] = [
          ...data.armorPieces.map((a) => ({ kind: "armor" as const, ...a })),
          ...data.weapons.map((w) => ({ kind: "weapon" as const, ...w })),
        ];

        setResults(merged);
        setSearchVersion((v) => v + 1);
        setSearched(true);
        setError(false);
      } catch {
        if (controller.signal.aborted) {
          return;
        }
        setResults([]);
        setSearched(true);
        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <SearchWrapper>
        <SearchInput
          type="text"
          placeholder="Search gear..."
          aria-label="Search gear"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </SearchWrapper>

      <ResultsArea>
        {loading && <Spinner />}

        {!loading && searched && error && <EmptyMessage role="alert">Search failed. Please try again.</EmptyMessage>}

        {!loading && searched && !error && results.length === 0 && (
          <EmptyMessage>No gear found for "{query}"</EmptyMessage>
        )}

        {!loading && results.length > 0 && (
          <ResultsScroller key={searchVersion} $capped={results.length >= 4}>
            {results.map((item, i) => {
              const slotOptions = getSlotOptions(item);
              // When slot choice is ambiguous (1H, ring, trinket), render per-slot buttons instead
              // of making the whole card clickable. Unambiguous items equip on card click.
              const clickable = slotOptions === null;

              return (
                <AnimatedCardWrapper key={`${item.kind}-${item.name}-${i}`} $index={i}>
                  <ResultCard
                    as={clickable ? "button" : "div"}
                    $clickable={clickable}
                    onClick={clickable ? () => onEquip(item) : undefined}
                  >
                    <CardRow>
                      {item.iconUrl && (
                        <IconWrapper>
                          <ItemIconImg src={item.iconUrl} alt={item.name} />
                          <IconBorder src={ICON_BORDER_URL} alt="" />
                        </IconWrapper>
                      )}
                      <ResultContent>
                        <ResultHeader>
                          <ResultName>{item.name}</ResultName>
                          <TypeBadge $isWeapon={item.kind === "weapon"}>
                            {item.kind === "weapon" ? "Weapon" : "Armor"}
                          </TypeBadge>
                        </ResultHeader>
                        <MetaRow>
                          <ResultMeta>
                            <MetaExpansion>{item.expansion}</MetaExpansion>
                            <MetaItem>
                              {item.kind === "armor"
                                ? item.armorType === "Agnostic"
                                  ? item.slot
                                  : `${item.armorType} · ${item.slot}`
                                : `${item.weaponType} · ${item.weaponSlot}`}
                            </MetaItem>
                            {(item.primaryStat || item.secondaryStat) && (
                              <MetaStats>
                                {[item.primaryStat, item.secondaryStat].filter(Boolean).join(" + ")}
                              </MetaStats>
                            )}
                          </ResultMeta>
                          {slotOptions && (
                            <SlotButtonRow>
                              {slotOptions.map((opt) => (
                                <SlotButton
                                  key={opt.value}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEquip(item, opt.value);
                                  }}
                                >
                                  {opt.label}
                                </SlotButton>
                              ))}
                            </SlotButtonRow>
                          )}
                        </MetaRow>
                      </ResultContent>
                    </CardRow>
                  </ResultCard>
                </AnimatedCardWrapper>
              );
            })}
          </ResultsScroller>
        )}
      </ResultsArea>
    </>
  );
};

export default GearSearch;
