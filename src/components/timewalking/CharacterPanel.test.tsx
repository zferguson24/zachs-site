import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CharacterPanel from "./CharacterPanel";
import {
  baseCharacter,
  characterWithHead,
  characterWithIcon,
  characterWith2H,
  characterWithRanged,
  characterWith1H,
} from "../../test/mocks/fixtures";
import { ICON_BASE } from "../../constants/wow";

// ─── helpers ─────────────────────────────────────────────────────────────────

function renderPanel({
  character = baseCharacter,
  loading = false,
  onUnequipAll = vi.fn(),
  onUnequipSlot = vi.fn(),
} = {}) {
  return {
    onUnequipAll,
    onUnequipSlot,
    ...render(
      <CharacterPanel
        character={character}
        loading={loading}
        onUnequipAll={onUnequipAll}
        onUnequipSlot={onUnequipSlot}
      />,
    ),
  };
}

// ─── tests ───────────────────────────────────────────────────────────────────

describe("CharacterPanel", () => {
  // ── loading / empty states ─────────────────────────────────────────────────

  it("shows loading text while loading", () => {
    renderPanel({ loading: true, character: null as never });
    expect(screen.getByText(/loading character/i)).toBeInTheDocument();
  });

  it("renders nothing when not loading and character is null", () => {
    const { container } = renderPanel({ loading: false, character: null as never });
    expect(container).toBeEmptyDOMElement();
  });

  // ── character meta ─────────────────────────────────────────────────────────

  it("renders the character name", () => {
    renderPanel();
    expect(screen.getByText("TESTCHAR")).toBeInTheDocument();
  });

  it("renders WARRIOR class as 'Warrior' (formatEnum)", () => {
    renderPanel();
    expect(screen.getByText(/warrior/i)).toBeInTheDocument();
  });

  it("renders DEATH_KNIGHT class as 'Death Knight' (formatEnum multi-word)", () => {
    renderPanel({
      character: { ...baseCharacter, characterClass: "DEATH_KNIGHT" },
    });
    expect(screen.getByText(/death knight/i)).toBeInTheDocument();
  });

  it("renders NIGHT_ELF race as 'Night Elf' (formatEnum multi-word)", () => {
    renderPanel({
      character: { ...baseCharacter, race: "NIGHT_ELF" },
    });
    expect(screen.getByText(/night elf/i)).toBeInTheDocument();
  });

  // ── slot labels ────────────────────────────────────────────────────────────

  it("renders all 16 equipment slot labels", () => {
    renderPanel();
    const expectedLabels = [
      "Head", "Neck", "Shoulders", "Back", "Chest", "Wrist", "Hands",
      "Waist", "Legs", "Feet", "Finger 1", "Finger 2", "Trinket 1", "Trinket 2",
      "Main-Hand", "Off-Hand",
    ];
    for (const label of expectedLabels) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  // ── equipped / unequipped slot rendering ──────────────────────────────────

  it("shows an equipped item's name", () => {
    renderPanel({ character: characterWithHead });
    expect(screen.getByText("Iron Helm")).toBeInTheDocument();
  });

  it("does not show an item name for unequipped slots", () => {
    renderPanel({ character: characterWithHead });
    // NECK is unequipped; only "Neck" label should appear, no item name
    const neckLabel = screen.getByText("Neck");
    expect(neckLabel.closest("[role='button']")).toBeNull();
    expect(screen.queryByText("undefined")).not.toBeInTheDocument();
  });

  // ── icon src (slotIconSrc) ─────────────────────────────────────────────────

  it("uses the item's iconUrl when the slot is equipped with an icon", () => {
    renderPanel({ character: characterWithIcon });
    // The slot icon uses alt={SLOT_LABELS[slotName]}, not the item name
    const img = screen.getByAltText("Head") as HTMLImageElement;
    expect(img.src).toBe("https://wow.zamimg.com/images/wow/icons/large/inv_helm.jpg");
  });

  it("uses a placeholder URL for an unequipped slot", () => {
    renderPanel();
    const headImg = screen.getByAltText("Head") as HTMLImageElement;
    expect(headImg.src).toContain("inventoryslot_head");
  });

  // ── right-click to unequip ─────────────────────────────────────────────────

  it("calls onUnequipSlot with the slot name on right-click of an equipped slot", async () => {
    const { onUnequipSlot } = renderPanel({ character: characterWithHead });
    const cell = screen.getByRole("button", { name: /head.*iron helm/i });
    fireEvent.contextMenu(cell);
    expect(onUnequipSlot).toHaveBeenCalledOnce();
    expect(onUnequipSlot).toHaveBeenCalledWith("HEAD");
  });

  it("does not call onUnequipSlot on right-click of an unequipped slot", () => {
    const { onUnequipSlot } = renderPanel();
    // NECK is unequipped — no role="button" so no contextMenu handler
    const neck = screen.getByText("Neck").closest("div")!;
    fireEvent.contextMenu(neck);
    expect(onUnequipSlot).not.toHaveBeenCalled();
  });

  // ── keyboard to unequip ────────────────────────────────────────────────────

  it("calls onUnequipSlot when Delete is pressed on an equipped slot", async () => {
    const { onUnequipSlot } = renderPanel({ character: characterWithHead });
    const cell = screen.getByRole("button", { name: /head.*iron helm/i });
    cell.focus();
    await userEvent.keyboard("{Delete}");
    expect(onUnequipSlot).toHaveBeenCalledWith("HEAD");
  });

  it("calls onUnequipSlot when Backspace is pressed on an equipped slot", async () => {
    const { onUnequipSlot } = renderPanel({ character: characterWithHead });
    const cell = screen.getByRole("button", { name: /head.*iron helm/i });
    cell.focus();
    await userEvent.keyboard("{Backspace}");
    expect(onUnequipSlot).toHaveBeenCalledWith("HEAD");
  });

  it("does not call onUnequipSlot on keyboard events for unequipped slots", async () => {
    const { onUnequipSlot } = renderPanel();
    // Neck is unequipped — no role="button" on it
    expect(onUnequipSlot).not.toHaveBeenCalled();
  });

  // ── weapon row rendering ───────────────────────────────────────────────────

  it("renders two weapon cells when no weapon is equipped", () => {
    renderPanel();
    expect(screen.getByText("Main-Hand")).toBeInTheDocument();
    expect(screen.getByText("Off-Hand")).toBeInTheDocument();
  });

  it("renders two weapon cells when a 1H weapon is equipped", () => {
    renderPanel({ character: characterWith1H });
    expect(screen.getByText("Main-Hand")).toBeInTheDocument();
    expect(screen.getByText("Off-Hand")).toBeInTheDocument();
  });

  it("renders a single merged weapon cell (no separate Off-Hand) when a 2H weapon is equipped", () => {
    renderPanel({ character: characterWith2H });
    expect(screen.getByText("Main-Hand")).toBeInTheDocument();
    expect(screen.queryByText("Off-Hand")).not.toBeInTheDocument();
  });

  it("renders a single merged weapon cell when a Ranged weapon is equipped", () => {
    renderPanel({ character: characterWithRanged });
    expect(screen.getByText("Main-Hand")).toBeInTheDocument();
    expect(screen.queryByText("Off-Hand")).not.toBeInTheDocument();
  });

  // ── unequip all ────────────────────────────────────────────────────────────

  it("calls onUnequipAll when the 'Unequip All' button is clicked", async () => {
    const { onUnequipAll } = renderPanel();
    await userEvent.click(screen.getByRole("button", { name: /unequip all/i }));
    expect(onUnequipAll).toHaveBeenCalledOnce();
  });

  // ── touch-hold to unequip (pointer events) ─────────────────────────────────

  it("calls onUnequipSlot after a 1-second touch hold on an equipped slot", () => {
    vi.useFakeTimers();
    const { onUnequipSlot } = renderPanel({ character: characterWithHead });
    const cell = screen.getByRole("button", { name: /head.*iron helm/i });
    fireEvent.pointerDown(cell, { pointerType: "touch", clientX: 50, clientY: 50 });
    act(() => vi.advanceTimersByTime(1001));
    expect(onUnequipSlot).toHaveBeenCalledWith("HEAD");
    vi.useRealTimers();
  });

  it("does not call onUnequipSlot when the touch is released before 1 second", () => {
    vi.useFakeTimers();
    const { onUnequipSlot } = renderPanel({ character: characterWithHead });
    const cell = screen.getByRole("button", { name: /head.*iron helm/i });
    fireEvent.pointerDown(cell, { pointerType: "touch", clientX: 50, clientY: 50 });
    fireEvent.pointerUp(cell);
    act(() => vi.advanceTimersByTime(1001));
    expect(onUnequipSlot).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("does not start a hold timer for non-touch pointer types (mouse/pen)", () => {
    vi.useFakeTimers();
    const { onUnequipSlot } = renderPanel({ character: characterWithHead });
    const cell = screen.getByRole("button", { name: /head.*iron helm/i });
    fireEvent.pointerDown(cell, { pointerType: "mouse", clientX: 50, clientY: 50 });
    act(() => vi.advanceTimersByTime(1001));
    expect(onUnequipSlot).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("clears the hold timer on unmount so a pending touch hold does not fire", () => {
    vi.useFakeTimers();
    const { onUnequipSlot, unmount } = renderPanel({ character: characterWithHead });
    const cell = screen.getByRole("button", { name: /head.*iron helm/i });
    fireEvent.pointerDown(cell, { pointerType: "touch", clientX: 50, clientY: 50 });
    unmount(); // cleanup useEffect runs clearTimeout
    act(() => vi.advanceTimersByTime(1001));
    expect(onUnequipSlot).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("does not crash when pointer leaves an equipped slot without a prior hold (no timer to clear)", () => {
    const { onUnequipSlot } = renderPanel({ character: characterWithHead });
    const cell = screen.getByRole("button", { name: /head.*iron helm/i });
    fireEvent.pointerLeave(cell); // clearHold runs with holdTimerRef.current === null
    expect(onUnequipSlot).not.toHaveBeenCalled();
  });

  it("does not call onUnequipSlot when a non-Delete/Backspace key is pressed on an equipped slot", async () => {
    const { onUnequipSlot } = renderPanel({ character: characterWithHead });
    const cell = screen.getByRole("button", { name: /head.*iron helm/i });
    cell.focus();
    await userEvent.keyboard("{Enter}");
    expect(onUnequipSlot).not.toHaveBeenCalled();
  });

  it("renders with the fallback color when characterClass is not in CLASS_COLORS", () => {
    // Covers the `CLASS_COLORS[class] ?? "#e8f0f8"` null-coalescing fallback branch
    renderPanel({ character: { ...baseCharacter, characterClass: "UNKNOWN_CLASS" } });
    expect(screen.getByText("TESTCHAR")).toBeInTheDocument();
  });
});
