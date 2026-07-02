import React, { useState, useEffect } from "react";
import {
  PlanWrapper,
  PlanHead,
  PlanTitle,
  PlanSummary,
  PlanActions,
  BadgeTotal,
  BadgeCount,
  BadgeIconWrap,
  BadgeIconImg,
  BadgeIconBorder,
  ApplyPlanButton,
  StatButtonGroup,
  StatButton,
  PlanDivider,
  EventList,
  EventCard,
  EventCardHeader,
  ExpansionIconWrap,
  ExpansionIconImg,
  ExpansionIconBorder,
  EventHeaderText,
  EventDateRange,
  EventExpansion,
  TurbulentBadge,
  TurbulentLabel,
  TurbulentIconWrap,
  TurbulentIconImg,
  TurbulentIconBorder,
  PlanStatusLine,
  SlotItemGrid,
  SlotItemCard,
  SlotItemDetails,
  SlotIconWrap,
  SlotItemImg,
  SlotItemBorderImg,
  SlotPlaceholder,
  SlotItemName,
  SlotItemLabel,
  SlotItemCost,
} from "./GearPlan.styles";
import { ICON_BASE, ICON_BORDER_URL, EXPANSION_ICON_SLUGS, SLOT_LABELS } from "../../constants/wow";

const JUSTICE_ICON_URL = `${ICON_BASE}pvecurrency-justice.jpg`;
const TURBULENT_ICON_URL = `${ICON_BASE}ability_evoker_timedilation.jpg`;
import { GearPlanResponse } from "../../types/timewalking";
import { getJson } from "../../services/api";

// WoW primary stat colors: green / red / blue
const STAT_COLOR: Record<string, string> = {
  Agility: "#1eff00",
  Strength: "#c41e3a",
  Intellect: "#0070dd",
};

// Backend returns date-only ISO strings (e.g. "2025-03-15"). Parsing with new Date(iso)
// interprets them as UTC midnight, which shifts the displayed date in negative-offset timezones.
// Constructing via year/month/day avoids that shift.
function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDateRange(start: string, end: string): string {
  const s = parseLocalDate(start);
  const e = parseLocalDate(end);
  const shortOpts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const endOpts: Intl.DateTimeFormatOptions =
    e.getFullYear() !== new Date().getFullYear() ? { month: "short", day: "numeric", year: "numeric" } : shortOpts;
  return `${s.toLocaleDateString("en-US", shortOpts)} - ${e.toLocaleDateString("en-US", endOpts)}`;
}

function formatFullDate(iso: string): string {
  return parseLocalDate(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface GearPlanProps {
  characterName: string;
  refreshKey: number;
  onEquipSlot: (slot: string, itemName: string) => Promise<void>;
  onApplyPlan: (slots: Array<{ slot: string; itemName: string }>) => Promise<void>;
}

const GearPlan: React.FC<GearPlanProps> = ({ characterName, refreshKey, onEquipSlot, onApplyPlan }) => {
  const [plan, setPlan] = useState<GearPlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [equipping, setEquipping] = useState(false);

  // null means no user override — backend resolves to the class default
  const [preferredStat, setPreferredStat] = useState<string | null>(null);

  // Re-fetches whenever gear changes (refreshKey) or the user picks a different stat.
  // The stale plan stays visible while loading so the layout doesn't collapse.
  useEffect(() => {
    setLoading(true);
    setError(false);
    const url = preferredStat
      ? `/api/characters/${characterName}/gear-plan?preferredStat=${preferredStat}`
      : `/api/characters/${characterName}/gear-plan`;
    getJson<GearPlanResponse>(url)
      .then(setPlan)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [characterName, refreshKey, preferredStat]);

  const summaryText = (): string => {
    if (loading && !plan) {
      return "Loading…";
    }
    if (error || !plan) {
      return "";
    }
    if (plan.fullyEquipped && plan.events.length === 0) {
      return "Already fully equipped.";
    }
    if (plan.fullyEquipped && plan.fullyEquippedDate) {
      return `Fully equipped by ${formatFullDate(plan.fullyEquippedDate)} · ${plan.events.length} event${plan.events.length !== 1 ? "s" : ""}`;
    }
    return "";
  };

  const handleEquipItem = async (slot: string, itemName: string) => {
    setEquipping(true);
    try {
      await onEquipSlot(slot, itemName);
    } finally {
      setEquipping(false);
    }
  };

  // Flattens every slot across all events into a single PATCH request rather than one per item.
  const handleApplyAll = async () => {
    if (!plan) {
      return;
    }
    const allSlots = plan.events.flatMap((e) => e.slots.map((s) => ({ slot: s.slot, itemName: s.itemName })));
    setEquipping(true);
    try {
      await onApplyPlan(allSlots);
    } finally {
      setEquipping(false);
    }
  };

  const hasEvents = plan && plan.events.length > 0;
  const totalCost = hasEvents ? plan.events.flatMap((e) => e.slots).reduce((sum, s) => sum + s.cost, 0) : 0;

  return (
    <PlanWrapper>
      <PlanHead>
        <PlanTitle>Gear Plan</PlanTitle>
        <PlanSummary>{summaryText()}</PlanSummary>

        {/* statOptions is backend-driven — only hybrid classes (Druid, Monk, Paladin, Shaman) receive multiple options.
            preferredStat ?? resolvedStat gives instant visual feedback when the user clicks before the refetch settles. */}
        {plan && plan.statOptions.length > 0 && (
          <StatButtonGroup>
            {plan.statOptions.map((stat) => (
              <StatButton
                key={stat}
                $active={(preferredStat ?? plan.resolvedStat) === stat}
                $color={STAT_COLOR[stat]}
                aria-pressed={(preferredStat ?? plan.resolvedStat) === stat}
                onClick={() => setPreferredStat(stat)}
              >
                {stat}
              </StatButton>
            ))}
          </StatButtonGroup>
        )}

        {hasEvents && (
          <PlanActions>
            <BadgeTotal>
              <BadgeCount>{totalCost.toLocaleString()}</BadgeCount>
              <BadgeIconWrap>
                <BadgeIconImg src={JUSTICE_ICON_URL} alt="" />
                <BadgeIconBorder src={ICON_BORDER_URL} alt="" />
              </BadgeIconWrap>
            </BadgeTotal>
            <ApplyPlanButton onClick={handleApplyAll} disabled={equipping || loading}>
              Equip All
            </ApplyPlanButton>
          </PlanActions>
        )}
      </PlanHead>
      <PlanDivider />

      {error && (
        <PlanStatusLine $error role="alert">
          Could not load gear plan.
        </PlanStatusLine>
      )}

      {!error && plan && plan.unresolvableSlots.length > 0 && (
        <PlanStatusLine $error>
          No upcoming event covers: {plan.unresolvableSlots.map((s) => SLOT_LABELS[s] ?? s).join(", ")}
        </PlanStatusLine>
      )}

      {!error && plan && plan.events.length === 0 && plan.fullyEquipped && (
        <PlanStatusLine>Nothing left to plan — all slots are filled.</PlanStatusLine>
      )}

      <EventList $stale={loading && !!plan} aria-live="polite" aria-busy={loading}>
        {plan?.events.map((event, i) => (
          <EventCard key={i} $turbulent={event.turbulentTimeways}>
            <EventCardHeader>
              <ExpansionIconWrap>
                <ExpansionIconImg
                  src={`${ICON_BASE}${EXPANSION_ICON_SLUGS[event.expansion] ?? "inv_misc_questionmark"}.jpg`}
                  alt={event.expansion}
                />
                <ExpansionIconBorder src={ICON_BORDER_URL} alt="" />
              </ExpansionIconWrap>
              <EventHeaderText>
                <EventExpansion>{event.expansion}</EventExpansion>
                <EventDateRange>{formatDateRange(event.startDate, event.endDate)}</EventDateRange>
              </EventHeaderText>
            </EventCardHeader>
            {event.turbulentTimeways && (
              <TurbulentBadge>
                <TurbulentLabel>Turbulent Timeways</TurbulentLabel>
                <TurbulentIconWrap>
                  <TurbulentIconImg src={TURBULENT_ICON_URL} alt="Turbulent Timeways" />
                  <TurbulentIconBorder src={ICON_BORDER_URL} alt="" />
                </TurbulentIconWrap>
              </TurbulentBadge>
            )}
            <SlotItemGrid>
              {event.slots.map((s) => (
                <SlotItemCard
                  key={s.slot}
                  onClick={() => handleEquipItem(s.slot, s.itemName)}
                  disabled={equipping || loading}
                  aria-label={`Equip ${s.itemName} in ${SLOT_LABELS[s.slot] ?? s.slot}`}
                >
                  <SlotIconWrap>
                    {s.iconUrl ? (
                      <>
                        <SlotItemImg src={s.iconUrl} alt={s.itemName} />
                        <SlotItemBorderImg src={ICON_BORDER_URL} alt="" />
                      </>
                    ) : (
                      <SlotPlaceholder aria-hidden="true" />
                    )}
                  </SlotIconWrap>
                  <SlotItemDetails>
                    <SlotItemName title={s.itemName}>{s.itemName}</SlotItemName>
                    <SlotItemLabel>{SLOT_LABELS[s.slot] ?? s.slot}</SlotItemLabel>
                    <SlotItemCost>
                      {s.cost}
                      <BadgeIconWrap>
                        <BadgeIconImg src={JUSTICE_ICON_URL} alt="" />
                        <BadgeIconBorder src={ICON_BORDER_URL} alt="" />
                      </BadgeIconWrap>
                    </SlotItemCost>
                  </SlotItemDetails>
                </SlotItemCard>
              ))}
            </SlotItemGrid>
          </EventCard>
        ))}
      </EventList>
    </PlanWrapper>
  );
};

export default GearPlan;
