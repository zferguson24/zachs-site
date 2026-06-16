import React, { useState, useEffect, useRef } from "react";
import {
  SearchWrapper, SearchInput, ResultsArea, Spinner, ResultsScroller,
  ResultCard, CardRow, IconWrapper, ItemIconImg, IconBorder,
  ResultContent, ResultHeader, ResultName, TypeBadge,
  MetaRow, ResultMeta, MetaItem, MetaExpansion, MetaStats,
  EmptyMessage, SlotButtonRow, SlotButton, AnimatedCardWrapper,
} from "./GearSearch.styles";
import { GearSearchResultDTO, GearResult } from "../../types/timewalking";
import { ICON_BORDER_URL } from "../../constants/icons";
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
        { value: "MAIN_HAND", label: "Main Hand" },
        { value: "OFF_HAND", label: "Off Hand" },
      ];
    }
    return null;
  }

  if (item.slot === "Ring") {
    return [
      { value: "FINGER_1", label: "Ring 1" },
      { value: "FINGER_2", label: "Ring 2" },
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
  // Incremented on each completed search so result cards remount and re-animate
  const [searchVersion, setSearchVersion] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < MIN_LENGTH) {
      setResults([]);
      setLoading(false);
      setSearched(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const encoded = encodeURIComponent(query);
      const res = await fetch(`/api/gear/search?q=${encoded}`);

      if (!res.ok) {
        setResults([]);
        setLoading(false);
        setSearched(true);
        return;
      }

      const data: GearSearchResultDTO = await res.json();
      const merged: GearResult[] = [
        ...data.armorPieces.map((a) => ({ kind: "armor" as const, ...a })),
        ...data.weapons.map((w) => ({ kind: "weapon" as const, ...w })),
      ];

      setResults(merged);
      setSearchVersion((v) => v + 1);
      setLoading(false);
      setSearched(true);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <>
      <SearchWrapper>
        <SearchInput
          type="text"
          placeholder="Search gear..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </SearchWrapper>

      <ResultsArea>
        {loading && <Spinner />}

        {!loading && searched && results.length === 0 && (
          <EmptyMessage>No gear found for "{query}"</EmptyMessage>
        )}

        {!loading && results.length > 0 && (
          <ResultsScroller key={searchVersion} $capped={results.length >= 4}>
            {results.map((item, i) => {
              const slotOptions = getSlotOptions(item);
              const clickable = slotOptions === null;

              return (
                <AnimatedCardWrapper key={`${item.kind}-${item.name}-${i}`} $index={i}>
                <ResultCard
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
