import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { server } from "../test/mocks/server";
import { baseCharacter, characterWithFinger1, characterWithTrinket1 } from "../test/mocks/fixtures";
import TimewalkingGearSelection from "./TimewalkingGearSelection";
import type { GearResult } from "../types/timewalking";

// ─── child component mocks ────────────────────────────────────────────────────
// These expose test buttons so we can trigger the callbacks that
// TimewalkingGearSelection passes down, without exercising the full child UIs.

const armorBase = {
  armorType: "Plate",
  expansion: "Classic",
  primaryStat: "Strength",
  secondaryStat: "Stamina",
  cost: 150,
  notes: "",
  wowheadUrl: "",
  iconUrl: null,
};

const weaponBase = {
  weaponStat: "Strength",
  weaponType: "Sword",
  expansion: "Classic",
  primaryStat: "Strength",
  secondaryStat: "Stamina",
  cost: 200,
  notes: "",
  wowheadUrl: "",
  iconUrl: null,
};

vi.mock("../components/timewalking/GearSearch", () => ({
  default: ({ onEquip }: { onEquip: (item: GearResult, slot?: string) => void }) => (
    <div data-testid="gear-search">
      <button
        data-testid="equip-head"
        onClick={() => onEquip({ kind: "armor", slot: "Head", name: "Iron Helm", ...armorBase })}
      >
        Equip Head
      </button>
      <button
        data-testid="equip-chest"
        onClick={() => onEquip({ kind: "armor", slot: "Chest", name: "Iron Chest", ...armorBase })}
      >
        Equip Chest
      </button>
      <button
        data-testid="equip-finger"
        onClick={() => onEquip({ kind: "armor", slot: "Finger", name: "Gold Ring", ...armorBase })}
      >
        Equip Finger
      </button>
      <button
        data-testid="equip-trinket"
        onClick={() => onEquip({ kind: "armor", slot: "Trinket", name: "Ancient Trinket", ...armorBase })}
      >
        Equip Trinket
      </button>
      <button
        data-testid="equip-1h-main"
        onClick={() => onEquip({ kind: "weapon", weaponSlot: "1H", name: "Broad Sword", ...weaponBase }, "MAIN_HAND")}
      >
        Equip 1H Main
      </button>
      <button
        data-testid="equip-1h-off"
        onClick={() => onEquip({ kind: "weapon", weaponSlot: "1H", name: "Broad Sword", ...weaponBase }, "OFF_HAND")}
      >
        Equip 1H Off
      </button>
      <button
        data-testid="equip-2h"
        onClick={() => onEquip({ kind: "weapon", weaponSlot: "2H", name: "Great Axe", ...weaponBase })}
      >
        Equip 2H
      </button>
      <button
        data-testid="equip-offhand"
        onClick={() => onEquip({ kind: "weapon", weaponSlot: "Off-Hand", name: "Iron Shield", ...weaponBase })}
      >
        Equip Off-Hand
      </button>
      <button
        data-testid="equip-ranged"
        onClick={() => onEquip({ kind: "weapon", weaponSlot: "Ranged", name: "Hunters Bow", ...weaponBase })}
      >
        Equip Ranged
      </button>
      <button
        data-testid="equip-unknown-slot"
        onClick={() => onEquip({ kind: "armor", slot: "NOT_A_REAL_SLOT", name: "Mystery Piece", ...armorBase })}
      >
        Equip Unknown
      </button>
      <button
        data-testid="equip-unknown-weapon-slot"
        onClick={() => onEquip({ kind: "weapon", weaponSlot: "NOT_A_REAL_WEAPON_SLOT", name: "Mystery Weapon", ...weaponBase })}
      >
        Equip Unknown Weapon
      </button>
    </div>
  ),
}));

vi.mock("../components/timewalking/CharacterPanel", () => ({
  default: ({ character, onUnequipAll, onUnequipSlot }: {
    character: typeof baseCharacter | null;
    loading: boolean;
    onUnequipAll: () => void;
    onUnequipSlot: (slot: string) => void;
  }) => (
    <div data-testid="character-panel">
      {character && <span data-testid="char-name">{character.name}</span>}
      <button data-testid="unequip-all" onClick={onUnequipAll}>
        Unequip All
      </button>
      <button data-testid="unequip-head" onClick={() => onUnequipSlot("HEAD")}>
        Unequip Head
      </button>
    </div>
  ),
}));

vi.mock("../components/timewalking/GearPlan", () => ({
  default: ({
    refreshKey,
    onEquipSlot,
    onApplyPlan,
  }: {
    characterName: string;
    refreshKey: number;
    onEquipSlot: (slot: string, itemName: string) => void;
    onApplyPlan: (slots: Array<{ slot: string; itemName: string }>) => void;
  }) => (
    <div data-testid="gear-plan" data-refresh-key={refreshKey}>
      <button
        data-testid="equip-slot-item"
        onClick={() => onEquipSlot("HEAD", "Iron Helm")}
      >
        Equip Slot Item
      </button>
      <button
        data-testid="apply-plan"
        onClick={() => onApplyPlan([{ slot: "HEAD", itemName: "Iron Helm" }])}
      >
        Apply Plan
      </button>
    </div>
  ),
}));

vi.mock("../components/Toast", () => ({
  default: ({ message, onDismiss }: { message: string; onDismiss: () => void }) => (
    <div data-testid="toast" role="alert">
      {message}
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  ),
}));

// ─── render helper ────────────────────────────────────────────────────────────

function renderWithRouter(characterName?: string) {
  const state = characterName ? { characterName } : undefined;
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/timewalking/gear", state }]}>
      <Routes>
        <Route path="/timewalking/gear" element={<TimewalkingGearSelection />} />
        <Route path="/timewalking/characters" element={<div data-testid="characters-page">Characters</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

// ─── test helpers ─────────────────────────────────────────────────────────────

async function waitForCharacterLoaded() {
  await waitFor(() => expect(screen.queryByTestId("char-name")).toBeInTheDocument());
}

function getPatchBody(): Promise<{ slots: Array<{ slot: string; itemName: string }> }> {
  return new Promise((resolve) => {
    server.use(
      http.patch("/api/characters/TESTCHAR/gear", async ({ request }) => {
        const body = await request.json() as { slots: Array<{ slot: string; itemName: string }> };
        resolve(body);
        return HttpResponse.json(baseCharacter);
      }),
    );
  });
}

function getDeleteBody(): Promise<{ slots: string[] }> {
  return new Promise((resolve) => {
    server.use(
      http.delete("/api/characters/TESTCHAR/gear", async ({ request }) => {
        const body = await request.json() as { slots: string[] };
        resolve(body);
        return HttpResponse.json(baseCharacter);
      }),
    );
  });
}

// ─── tests ───────────────────────────────────────────────────────────────────

describe("TimewalkingGearSelection", () => {
  // ── redirect ───────────────────────────────────────────────────────────────

  it("redirects to the character list when no characterName is in location state", () => {
    renderWithRouter(undefined);
    expect(screen.getByTestId("characters-page")).toBeInTheDocument();
  });

  // ── character loading ──────────────────────────────────────────────────────

  it("loads and displays the character on mount", async () => {
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    expect(screen.getByTestId("char-name")).toHaveTextContent("TESTCHAR");
  });

  it("shows a toast when the character fetch fails", async () => {
    server.use(http.get("/api/characters/TESTCHAR", () => new HttpResponse(null, { status: 404 })));
    renderWithRouter("TESTCHAR");
    expect(await screen.findByTestId("toast")).toHaveTextContent(/could not load character/i);
  });

  // ── slot derivation via handleEquip ──────────────────────────────────────

  it("sends PATCH with HEAD slot when equipping a Head armor piece", async () => {
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    const bodyPromise = getPatchBody();
    await userEvent.click(screen.getByTestId("equip-head"));
    const body = await bodyPromise;
    expect(body.slots).toEqual([{ slot: "HEAD", itemName: "Iron Helm" }]);
  });

  it("sends PATCH with CHEST slot when equipping a Chest armor piece", async () => {
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    const bodyPromise = getPatchBody();
    await userEvent.click(screen.getByTestId("equip-chest"));
    const body = await bodyPromise;
    expect(body.slots).toEqual([{ slot: "CHEST", itemName: "Iron Chest" }]);
  });

  it("sends PATCH with FINGER_1 when equipping a ring and FINGER_1 is empty", async () => {
    // baseCharacter has all slots empty, so FINGER_1 is free
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    const bodyPromise = getPatchBody();
    await userEvent.click(screen.getByTestId("equip-finger"));
    const body = await bodyPromise;
    expect(body.slots).toEqual([{ slot: "FINGER_1", itemName: "Gold Ring" }]);
  });

  it("sends PATCH with FINGER_2 when equipping a ring and FINGER_1 is already occupied", async () => {
    server.use(http.get("/api/characters/TESTCHAR", () => HttpResponse.json(characterWithFinger1)));
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    const bodyPromise = getPatchBody();
    await userEvent.click(screen.getByTestId("equip-finger"));
    const body = await bodyPromise;
    expect(body.slots).toEqual([{ slot: "FINGER_2", itemName: "Gold Ring" }]);
  });

  it("sends PATCH with TRINKET_1 when equipping a trinket and TRINKET_1 is empty", async () => {
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    const bodyPromise = getPatchBody();
    await userEvent.click(screen.getByTestId("equip-trinket"));
    const body = await bodyPromise;
    expect(body.slots).toEqual([{ slot: "TRINKET_1", itemName: "Ancient Trinket" }]);
  });

  it("sends PATCH with TRINKET_2 when equipping a trinket and TRINKET_1 is already occupied", async () => {
    server.use(http.get("/api/characters/TESTCHAR", () => HttpResponse.json(characterWithTrinket1)));
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    const bodyPromise = getPatchBody();
    await userEvent.click(screen.getByTestId("equip-trinket"));
    const body = await bodyPromise;
    expect(body.slots).toEqual([{ slot: "TRINKET_2", itemName: "Ancient Trinket" }]);
  });

  it("sends PATCH with MAIN_HAND for a 2H weapon (auto-derived)", async () => {
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    const bodyPromise = getPatchBody();
    await userEvent.click(screen.getByTestId("equip-2h"));
    const body = await bodyPromise;
    expect(body.slots).toEqual([{ slot: "MAIN_HAND", itemName: "Great Axe" }]);
  });

  it("sends PATCH with OFF_HAND for an Off-Hand weapon (auto-derived)", async () => {
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    const bodyPromise = getPatchBody();
    await userEvent.click(screen.getByTestId("equip-offhand"));
    const body = await bodyPromise;
    expect(body.slots).toEqual([{ slot: "OFF_HAND", itemName: "Iron Shield" }]);
  });

  it("sends PATCH with MAIN_HAND for a Ranged weapon (auto-derived)", async () => {
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    const bodyPromise = getPatchBody();
    await userEvent.click(screen.getByTestId("equip-ranged"));
    const body = await bodyPromise;
    expect(body.slots).toEqual([{ slot: "MAIN_HAND", itemName: "Hunters Bow" }]);
  });

  it("uses the explicit slot from GearSearch instead of deriving when one is provided", async () => {
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    const bodyPromise = getPatchBody();
    // equip-1h-main passes explicit "MAIN_HAND"
    await userEvent.click(screen.getByTestId("equip-1h-main"));
    const body = await bodyPromise;
    expect(body.slots).toEqual([{ slot: "MAIN_HAND", itemName: "Broad Sword" }]);
  });

  it("uses OFF_HAND when Off-Hand explicit slot is provided for a 1H weapon", async () => {
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    const bodyPromise = getPatchBody();
    await userEvent.click(screen.getByTestId("equip-1h-off"));
    const body = await bodyPromise;
    expect(body.slots).toEqual([{ slot: "OFF_HAND", itemName: "Broad Sword" }]);
  });

  it("shows a toast when the derived slot is null (unknown armor slot)", async () => {
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    await userEvent.click(screen.getByTestId("equip-unknown-slot"));
    expect(await screen.findByTestId("toast")).toHaveTextContent(/cannot determine equip slot/i);
  });

  // ── PATCH response handling ───────────────────────────────────────────────

  it("updates the character state after a successful PATCH", async () => {
    const updatedCharacter = { ...baseCharacter, name: "UPDATED" };
    server.use(http.patch("/api/characters/TESTCHAR/gear", () => HttpResponse.json(updatedCharacter)));
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    await userEvent.click(screen.getByTestId("equip-head"));
    await waitFor(() => expect(screen.getByTestId("char-name")).toHaveTextContent("UPDATED"));
  });

  it("increments the GearPlan refreshKey after a successful PATCH", async () => {
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    const planBefore = screen.getByTestId("gear-plan");
    expect(planBefore).toHaveAttribute("data-refresh-key", "0");
    await userEvent.click(screen.getByTestId("equip-head"));
    await waitFor(() =>
      expect(screen.getByTestId("gear-plan")).toHaveAttribute("data-refresh-key", "1"),
    );
  });

  it("shows the first rejected reason from a 400 response", async () => {
    server.use(
      http.patch("/api/characters/TESTCHAR/gear", () =>
        HttpResponse.json(
          { message: "Validation failed", rejected: [{ slot: "HEAD", reason: "Wrong armor type" }] },
          { status: 400 },
        ),
      ),
    );
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    await userEvent.click(screen.getByTestId("equip-head"));
    expect(await screen.findByTestId("toast")).toHaveTextContent("Wrong armor type");
  });

  it("falls back to message when 400 response has no rejected array", async () => {
    server.use(
      http.patch("/api/characters/TESTCHAR/gear", () =>
        HttpResponse.json({ message: "Item not found", rejected: [] }, { status: 400 }),
      ),
    );
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    await userEvent.click(screen.getByTestId("equip-head"));
    expect(await screen.findByTestId("toast")).toHaveTextContent("Item not found");
  });

  it("shows a generic error toast for non-400 server errors on PATCH", async () => {
    server.use(http.patch("/api/characters/TESTCHAR/gear", () => new HttpResponse(null, { status: 500 })));
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    await userEvent.click(screen.getByTestId("equip-head"));
    expect(await screen.findByTestId("toast")).toHaveTextContent(/failed to equip/i);
  });

  it("shows a network error toast when the PATCH fetch throws", async () => {
    server.use(http.patch("/api/characters/TESTCHAR/gear", () => HttpResponse.error()));
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    await userEvent.click(screen.getByTestId("equip-head"));
    expect(await screen.findByTestId("toast")).toHaveTextContent(/network error/i);
  });

  // ── DELETE (unequip) ──────────────────────────────────────────────────────

  it("sends DELETE with the specific slot when a single slot is unequipped", async () => {
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    const bodyPromise = getDeleteBody();
    await userEvent.click(screen.getByTestId("unequip-head"));
    const body = await bodyPromise;
    expect(body.slots).toContain("HEAD");
    expect(body.slots).toHaveLength(1);
  });

  it("sends DELETE with all 16 slots when 'Unequip All' is clicked", async () => {
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    const bodyPromise = getDeleteBody();
    await userEvent.click(screen.getByTestId("unequip-all"));
    const body = await bodyPromise;
    expect(body.slots).toHaveLength(16);
    expect(body.slots).toContain("HEAD");
    expect(body.slots).toContain("OFF_HAND");
    expect(body.slots).toContain("FINGER_1");
    expect(body.slots).toContain("TRINKET_2");
  });

  it("shows an error toast when DELETE fails", async () => {
    server.use(http.delete("/api/characters/TESTCHAR/gear", () => new HttpResponse(null, { status: 500 })));
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    await userEvent.click(screen.getByTestId("unequip-head"));
    expect(await screen.findByTestId("toast")).toHaveTextContent(/failed to unequip/i);
  });

  it("shows a network error toast when the DELETE fetch throws", async () => {
    server.use(http.delete("/api/characters/TESTCHAR/gear", () => HttpResponse.error()));
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    await userEvent.click(screen.getByTestId("unequip-head"));
    expect(await screen.findByTestId("toast")).toHaveTextContent(/network error/i);
  });

  // ── apply plan ────────────────────────────────────────────────────────────

  it("sends PATCH with the plan slots when the gear plan's Apply callback is triggered", async () => {
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    const bodyPromise = getPatchBody();
    await userEvent.click(screen.getByTestId("apply-plan"));
    const body = await bodyPromise;
    expect(body.slots).toEqual([{ slot: "HEAD", itemName: "Iron Helm" }]);
  });

  // ── toast dismiss ─────────────────────────────────────────────────────────

  it("dismisses the toast when the dismiss button is clicked", async () => {
    server.use(http.get("/api/characters/TESTCHAR", () => new HttpResponse(null, { status: 404 })));
    renderWithRouter("TESTCHAR");
    const toast = await screen.findByTestId("toast");
    await userEvent.click(within(toast).getByRole("button", { name: /dismiss/i }));
    await waitFor(() => expect(screen.queryByTestId("toast")).not.toBeInTheDocument());
  });

  // ── handleEquip guard ─────────────────────────────────────────────────────

  it("does nothing if equip is triggered before the character has loaded", async () => {
    // Keep character fetch hanging so character stays null throughout the test
    server.use(http.get("/api/characters/TESTCHAR", async () => new Promise<never>(() => {})));
    let patchFired = false;
    server.use(
      http.patch("/api/characters/TESTCHAR/gear", () => {
        patchFired = true;
        return HttpResponse.json(baseCharacter);
      }),
    );
    renderWithRouter("TESTCHAR");
    await userEvent.click(screen.getByTestId("equip-head"));
    expect(patchFired).toBe(false);
  });

  // ── handleEquipSlotItem (onEquipSlot from GearPlan) ───────────────────────

  it("sends PATCH with a single slot when onEquipSlot is called from GearPlan", async () => {
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    const bodyPromise = getPatchBody();
    await userEvent.click(screen.getByTestId("equip-slot-item"));
    const body = await bodyPromise;
    expect(body.slots).toEqual([{ slot: "HEAD", itemName: "Iron Helm" }]);
  });

  // ── back navigation ───────────────────────────────────────────────────────

  it("navigates back to the character list when the back button is clicked", async () => {
    renderWithRouter("TESTCHAR");
    await userEvent.click(screen.getByText(/back to characters/i));
    expect(screen.getByTestId("characters-page")).toBeInTheDocument();
  });

  // ── remaining edge-case branches ──────────────────────────────────────────

  it("shows a toast when deriveTargetSlot returns null for an unknown weapon slot", async () => {
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    await userEvent.click(screen.getByTestId("equip-unknown-weapon-slot"));
    expect(await screen.findByTestId("toast")).toHaveTextContent(/cannot determine equip slot/i);
  });

  it("shows 'Validation failed.' when a 400 response has no rejected reason or message", async () => {
    server.use(http.patch("/api/characters/TESTCHAR/gear", () => HttpResponse.json({}, { status: 400 })));
    renderWithRouter("TESTCHAR");
    await waitForCharacterLoaded();
    await userEvent.click(screen.getByTestId("equip-head"));
    expect(await screen.findByTestId("toast")).toHaveTextContent("Validation failed.");
  });
});
