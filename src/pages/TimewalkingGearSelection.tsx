import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

const Page = styled.div`
  min-height: 100vh;
  background-color: #1e2a38;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
  color: #e8f0f8;
  font-family: inherit;
`;

const SearchWrapper = styled.div`
  width: 100%;
  max-width: 640px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  background-color: #253344;
  border: 1px solid #3d5068;
  border-radius: 6px;
  color: #e8f0f8;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: #5a7490;
  }

  &:focus {
    border-color: #6a9dbf;
  }
`;

const ResultsArea = styled.div`
  width: 100%;
  max-width: 640px;
  margin-top: 16px;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid #3d5068;
  border-top-color: #6a9dbf;
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
  margin: 32px auto;
`;

const ResultCard = styled.div`
  padding: 12px 16px;
  background-color: #253344;
  border: 1px solid #3d5068;
  border-radius: 6px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const IconWrapper = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
`;

const ItemIconImg = styled.img`
  width: 56px;
  height: 56px;
  display: block;
`;

const IconBorder = styled.img`
  position: absolute;
  top: -6px;
  left: -6px;
  width: 68px;
  height: 68px;
  pointer-events: none;
`;

const ResultContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ResultName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #e8f0f8;
`;

const TypeBadge = styled.span<{ $isWeapon: boolean }>`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  background-color: ${({ $isWeapon }) => ($isWeapon ? "#2e3f28" : "#2a2e42")};
  color: ${({ $isWeapon }) => ($isWeapon ? "#7bc97a" : "#8fa8e8")};
  border: 1px solid ${({ $isWeapon }) => ($isWeapon ? "#4a7a48" : "#4a5a88")};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const ResultMeta = styled.div`
  font-size: 13px;
  color: #7a9ab5;
  margin-top: 6px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const MetaItem = styled.span``;

const EmptyMessage = styled.div`
  text-align: center;
  color: #5a7490;
  font-size: 14px;
  margin-top: 32px;
`;

interface ArmorPieceDTO {
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

interface WeaponDTO {
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

type GearResult =
  | ({ kind: "armor" } & ArmorPieceDTO)
  | ({ kind: "weapon" } & WeaponDTO);

const DEBOUNCE_MS = 500;
const MIN_LENGTH = 3;

const TimewalkingGearSelection: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GearResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
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
      const [armorRes, weaponRes] = await Promise.all([
        fetch(`/api/gear/armor/search?name=${encoded}`),
        fetch(`/api/gear/weapons/search?name=${encoded}`),
      ]);

      const [armorData, weaponData]: [ArmorPieceDTO[], WeaponDTO[]] =
        await Promise.all([armorRes.json(), weaponRes.json()]);

      const merged: GearResult[] = [
        ...armorData.map((a) => ({ kind: "armor" as const, ...a })),
        ...weaponData.map((w) => ({ kind: "weapon" as const, ...w })),
      ].sort((a, b) => a.name.localeCompare(b.name));

      setResults(merged);
      setLoading(false);
      setSearched(true);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <Page>
      <SearchWrapper>
        <SearchInput
          type="text"
          placeholder="Search gear by name..."
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

        {!loading &&
          results.map((item, i) => (
            <ResultCard key={`${item.kind}-${item.name}-${i}`}>
              {item.iconUrl && (
                <IconWrapper>
                  <ItemIconImg src={item.iconUrl} alt={item.name} />
                  <IconBorder
                    src="https://wow.zamimg.com/images/Icon/large/border/default.png"
                    alt=""
                  />
                </IconWrapper>
              )}
              <ResultContent>
                <ResultHeader>
                  <ResultName>{item.name}</ResultName>
                  <TypeBadge $isWeapon={item.kind === "weapon"}>
                    {item.kind === "weapon" ? "Weapon" : "Armor"}
                  </TypeBadge>
                </ResultHeader>
                <ResultMeta>
                  <MetaItem>
                    {item.kind === "armor"
                      ? `${item.armorType} · ${item.slot}`
                      : `${item.weaponType} · ${item.weaponSlot}`}
                  </MetaItem>
                  <MetaItem>{item.expansion}</MetaItem>
                  {item.primaryStat && <MetaItem>{item.primaryStat}</MetaItem>}
                  {item.secondaryStat && (
                    <MetaItem>{item.secondaryStat}</MetaItem>
                  )}
                </ResultMeta>
              </ResultContent>
            </ResultCard>
          ))}
      </ResultsArea>
    </Page>
  );
};

export default TimewalkingGearSelection;
