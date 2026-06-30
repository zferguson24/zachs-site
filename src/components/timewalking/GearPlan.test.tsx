import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../../test/mocks/server";
import {
  warriorGearPlan,
  druidGearPlan,
  fullyEquippedPlan,
  alreadyFullPlan,
  planWithUnresolvable,
  turbulentPlan,
  twoEventPlan,
} from "../../test/mocks/fixtures";
import GearPlan from "./GearPlan";

// ─── helpers ─────────────────────────────────────────────────────────────────

function renderPlan({
  characterName = "TESTCHAR",
  refreshKey = 0,
  onEquipSlot = vi.fn(),
  onApplyPlan = vi.fn(),
} = {}) {
  return {
    onEquipSlot,
    onApplyPlan,
    ...render(
      <GearPlan
        characterName={characterName}
        refreshKey={refreshKey}
        onEquipSlot={onEquipSlot}
        onApplyPlan={onApplyPlan}
      />,
    ),
  };
}

// ─── tests ───────────────────────────────────────────────────────────────────

describe("GearPlan", () => {
  // ── loading state ──────────────────────────────────────────────────────────

  it("shows 'Loading…' in the summary area while the plan is fetching", async () => {
    // Plan never resolves — just checking the loading text appears momentarily
    server.use(http.get("/api/characters/TESTCHAR/gear-plan", async () => {
      await new Promise(() => {}); // hang forever
    }));
    renderPlan();
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  // ── error state ────────────────────────────────────────────────────────────

  it("shows an error alert when the gear-plan fetch fails", async () => {
    server.use(http.get("/api/characters/TESTCHAR/gear-plan", () => new HttpResponse(null, { status: 500 })));
    renderPlan();
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not load gear plan/i);
  });

  // ── event rendering ────────────────────────────────────────────────────────

  it("renders event cards with the expansion name", async () => {
    renderPlan();
    expect(await screen.findByText("Classic")).toBeInTheDocument();
  });

  it("renders a date range for each event", async () => {
    renderPlan();
    await screen.findByText("Classic");
    // warriorGearPlan has startDate "2026-07-01", endDate "2026-07-08" — same year as today (2026)
    // so end date should NOT include year
    expect(screen.getByText(/Jul 1 - Jul 8/i)).toBeInTheDocument();
  });

  it("includes the year in the end date when the end date is not in the current year", async () => {
    server.use(
      http.get("/api/characters/TESTCHAR/gear-plan", () =>
        HttpResponse.json({
          ...warriorGearPlan,
          events: [
            {
              ...warriorGearPlan.events[0],
              startDate: "2026-12-01",
              endDate: "2027-01-05",
            },
          ],
        }),
      ),
    );
    renderPlan();
    await screen.findByText("Classic");
    expect(screen.getByText(/Jan 5, 2027/i)).toBeInTheDocument();
  });

  it("does not shift dates to the previous day (parseLocalDate avoids UTC midnight)", async () => {
    server.use(
      http.get("/api/characters/TESTCHAR/gear-plan", () =>
        HttpResponse.json({
          ...warriorGearPlan,
          events: [
            {
              ...warriorGearPlan.events[0],
              startDate: "2026-03-15",
              endDate: "2026-03-22",
            },
          ],
        }),
      ),
    );
    renderPlan();
    await screen.findByText("Classic");
    // "Mar 15" must be visible, not "Mar 14" (which UTC midnight would show in negative-offset zones)
    expect(screen.getByText(/Mar 15/i)).toBeInTheDocument();
  });

  it("renders slot items within each event card", async () => {
    renderPlan();
    await screen.findByText("Iron Helm");
    expect(screen.getByText("Iron Chestplate")).toBeInTheDocument();
  });

  it("renders slot labels using SLOT_LABELS mapping (HEAD → 'Head')", async () => {
    renderPlan();
    // Both "Iron Helm" (item) and "Head" (label) should be present
    await screen.findByText("Iron Helm");
    expect(screen.getByText("Head")).toBeInTheDocument();
  });

  it("shows the Turbulent Timeways badge for turbulent events", async () => {
    server.use(http.get("/api/characters/TESTCHAR/gear-plan", () => HttpResponse.json(turbulentPlan)));
    renderPlan();
    await screen.findByText("Classic");
    expect(screen.getByText("Turbulent Timeways")).toBeInTheDocument();
  });

  it("does not show the Turbulent Timeways badge for regular events", async () => {
    renderPlan();
    await screen.findByText("Classic");
    expect(screen.queryByText("Turbulent Timeways")).not.toBeInTheDocument();
  });

  // ── stat selection (hybrid classes) ──────────────────────────────────────

  it("renders stat buttons for hybrid classes (Druid gets Agility and Intellect)", async () => {
    renderPlan({ characterName: "DRUID" });
    expect(await screen.findByRole("button", { name: "Agility" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Intellect" })).toBeInTheDocument();
  });

  it("does not render stat buttons for pure classes (Warrior has no statOptions)", async () => {
    renderPlan();
    await screen.findByText("Classic");
    expect(screen.queryByRole("button", { name: "Agility" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Intellect" })).not.toBeInTheDocument();
  });

  it("marks the resolvedStat button as active on initial load", async () => {
    renderPlan({ characterName: "DRUID" });
    const agilityBtn = await screen.findByRole("button", { name: "Agility" });
    // druidGearPlan.resolvedStat = "Agility"
    expect(agilityBtn).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Intellect" })).toHaveAttribute("aria-pressed", "false");
  });

  it("refetches the plan with ?preferredStat= when a stat button is clicked", async () => {
    renderPlan({ characterName: "DRUID" });
    await screen.findByRole("button", { name: "Agility" });
    await userEvent.click(screen.getByRole("button", { name: "Intellect" }));
    // After refetch, resolvedStat changes to Intellect — the backend mock reflects this
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Intellect" })).toHaveAttribute("aria-pressed", "true"),
    );
  });

  // ── equip actions ─────────────────────────────────────────────────────────

  it("calls onEquipSlot with (slot, itemName) when a slot card is clicked", async () => {
    const { onEquipSlot } = renderPlan();
    await screen.findByText("Iron Helm");
    await userEvent.click(screen.getByRole("button", { name: /equip iron helm in head/i }));
    expect(onEquipSlot).toHaveBeenCalledWith("HEAD", "Iron Helm");
  });

  it("calls onApplyPlan with all flattened slots when 'Equip All' is clicked", async () => {
    server.use(http.get("/api/characters/TESTCHAR/gear-plan", () => HttpResponse.json(twoEventPlan)));
    const { onApplyPlan } = renderPlan();
    await screen.findByText(/equip all/i);
    await userEvent.click(screen.getByRole("button", { name: /equip all/i }));
    expect(onApplyPlan).toHaveBeenCalledOnce();
    const [slots] = onApplyPlan.mock.calls[0] as [Array<{ slot: string; itemName: string }>];
    expect(slots).toContainEqual({ slot: "HEAD", itemName: "Iron Helm" });
    expect(slots).toContainEqual({ slot: "CHEST", itemName: "Iron Chestplate" });
    expect(slots).toContainEqual({ slot: "LEGS", itemName: "BC Leggings" });
  });

  it("shows the Equip All button when there are events", async () => {
    renderPlan();
    await screen.findByText("Classic");
    expect(screen.getByRole("button", { name: /equip all/i })).toBeInTheDocument();
  });

  it("disables the Equip All button while an equip is in progress", async () => {
    // onApplyPlan never resolves so the button stays disabled
    const hangingApplyPlan = vi.fn(() => new Promise<void>(() => {}));
    renderPlan({ onApplyPlan: hangingApplyPlan });
    await screen.findByText(/equip all/i);
    const btn = screen.getByRole("button", { name: /equip all/i });
    await userEvent.click(btn);
    expect(btn).toBeDisabled();
  });

  it("shows total cost across all event slots", async () => {
    renderPlan();
    await screen.findByText("Classic");
    // 150 (Iron Helm) + 200 (Iron Chestplate) = 350
    expect(screen.getByText("350")).toBeInTheDocument();
  });

  // ── summary text ──────────────────────────────────────────────────────────

  it("shows 'Fully equipped by …' summary when fullyEquipped and there are events", async () => {
    server.use(http.get("/api/characters/TESTCHAR/gear-plan", () => HttpResponse.json(fullyEquippedPlan)));
    renderPlan();
    // fullyEquippedPlan has fullyEquippedDate "2026-07-08" and 1 event
    await waitFor(() =>
      expect(screen.getByText(/fully equipped by/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/1 event/i)).toBeInTheDocument();
  });

  it("shows 'Nothing left to plan' when fullyEquipped with no events", async () => {
    server.use(http.get("/api/characters/TESTCHAR/gear-plan", () => HttpResponse.json(alreadyFullPlan)));
    renderPlan();
    expect(await screen.findByText(/nothing left to plan/i)).toBeInTheDocument();
  });

  it("shows the 'Already fully equipped.' summary when fullyEquipped and no events", async () => {
    server.use(http.get("/api/characters/TESTCHAR/gear-plan", () => HttpResponse.json(alreadyFullPlan)));
    renderPlan();
    expect(await screen.findByText("Already fully equipped.")).toBeInTheDocument();
  });

  // ── unresolvable slots ─────────────────────────────────────────────────────

  it("shows an error line listing unresolvable slots with their display labels", async () => {
    server.use(http.get("/api/characters/TESTCHAR/gear-plan", () => HttpResponse.json(planWithUnresolvable)));
    renderPlan();
    await screen.findByText("Classic");
    // planWithUnresolvable has unresolvableSlots: ["OFF_HAND"]
    // SLOT_LABELS["OFF_HAND"] = "Off-Hand"
    expect(screen.getByText(/no upcoming event covers.*off-hand/i)).toBeInTheDocument();
  });

  it("does not show the unresolvable-slots line when all slots can be filled", async () => {
    renderPlan();
    await screen.findByText("Classic");
    expect(screen.queryByText(/no upcoming event covers/i)).not.toBeInTheDocument();
  });

  // ── two-event plan ────────────────────────────────────────────────────────

  it("renders multiple event cards when the plan has more than one event", async () => {
    server.use(http.get("/api/characters/TESTCHAR/gear-plan", () => HttpResponse.json(twoEventPlan)));
    renderPlan();
    await screen.findByText("Classic");
    expect(screen.getByText("Burning Crusade")).toBeInTheDocument();
    const cards = screen.getAllByText(/classic|burning crusade/i);
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });

  // ── cost display per slot ─────────────────────────────────────────────────

  it("shows the cost for each individual slot item", async () => {
    renderPlan();
    await screen.findByText("Iron Helm");
    // warriorGearPlan slot costs: 150 and 200
    // They appear inside the slot cards
    const costs = screen.getAllByText("150");
    expect(costs.length).toBeGreaterThan(0);
  });

  // ── refreshKey triggers refetch ───────────────────────────────────────────

  it("refetches the plan when refreshKey changes", async () => {
    let fetchCount = 0;
    server.use(
      http.get("/api/characters/TESTCHAR/gear-plan", () => {
        fetchCount++;
        return HttpResponse.json(warriorGearPlan);
      }),
    );
    const { rerender } = renderPlan({ refreshKey: 0 });
    await screen.findByText("Classic");
    expect(fetchCount).toBe(1);
    rerender(
      <GearPlan characterName="TESTCHAR" refreshKey={1} onEquipSlot={vi.fn()} onApplyPlan={vi.fn()} />,
    );
    await waitFor(() => expect(fetchCount).toBe(2));
  });

  // ── within each event card ────────────────────────────────────────────────

  it("renders each event card with its own expansion name and slot items", async () => {
    server.use(http.get("/api/characters/TESTCHAR/gear-plan", () => HttpResponse.json(twoEventPlan)));
    renderPlan();
    // Both expansion names and both slot items must be present
    await screen.findByText("Classic");
    expect(screen.getByText("Iron Helm")).toBeInTheDocument();
    expect(screen.getByText("Burning Crusade")).toBeInTheDocument();
    expect(screen.getByText("BC Leggings")).toBeInTheDocument();
  });
});
