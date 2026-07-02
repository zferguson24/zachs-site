import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse, delay } from "msw";
import { server } from "../../test/mocks/server";
import { emptySearchResults, searchResults } from "../../test/mocks/fixtures";
import GearSearch from "./GearSearch";
import type { GearResult } from "../../types/timewalking";

// ─── helpers ─────────────────────────────────────────────────────────────────

function renderSearch(onEquip = vi.fn()) {
  return { onEquip, ...render(<GearSearch onEquip={onEquip} />) };
}

// ─── tests ───────────────────────────────────────────────────────────────────

describe("GearSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── initial state ──────────────────────────────────────────────────────────

  it("renders the search input", () => {
    renderSearch();
    expect(screen.getByRole("textbox", { name: /search gear/i })).toBeInTheDocument();
  });

  it("shows no results and no spinner on initial empty query", () => {
    renderSearch();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByText(/no gear found/i)).not.toBeInTheDocument();
  });

  // ── debounce / minimum length ──────────────────────────────────────────────

  it("does not fire a fetch for queries shorter than 3 characters", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "sw");
    vi.advanceTimersByTime(600);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("shows a spinner while the debounced fetch is in flight", async () => {
    renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
  });

  it("shows 'no gear found' when the API returns empty results", async () => {
    server.use(http.get("/api/gear/search", () => HttpResponse.json(emptySearchResults)));
    renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "xyz");
    vi.advanceTimersByTime(510);
    await waitFor(() => expect(screen.getByText(/no gear found/i)).toBeInTheDocument());
  });

  it("clears results and empty state when query drops below 3 chars", async () => {
    renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => screen.getByText("Iron Helm"));
    await userEvent.clear(input);
    await userEvent.type(input, "sw");
    vi.advanceTimersByTime(600);
    expect(screen.queryByText("Iron Helm")).not.toBeInTheDocument();
    expect(screen.queryByText(/no gear found/i)).not.toBeInTheDocument();
  });

  // ── result rendering ───────────────────────────────────────────────────────

  it("renders armor and weapon results after a successful search", async () => {
    renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => expect(screen.getByText("Iron Helm")).toBeInTheDocument());
    expect(screen.getByText("Broad Sword")).toBeInTheDocument();
    expect(screen.getByText("Gold Ring")).toBeInTheDocument();
  });

  it("shows 'Armor' badge for armor results and 'Weapon' badge for weapon results", async () => {
    renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => screen.getByText("Iron Helm"));
    expect(screen.getAllByText("Armor").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Weapon").length).toBeGreaterThan(0);
  });

  // ── clickable cards (auto-derive slot) ────────────────────────────────────

  it("calls onEquip with item only when a regular armor card is clicked", async () => {
    const { onEquip } = renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => screen.getByText("Iron Helm"));
    await userEvent.click(screen.getByText("Iron Helm").closest("button")!);
    expect(onEquip).toHaveBeenCalledOnce();
    const [calledItem, calledSlot] = onEquip.mock.calls[0] as [GearResult, string | undefined];
    expect(calledItem.name).toBe("Iron Helm");
    expect(calledSlot).toBeUndefined();
  });

  it("calls onEquip with item only when a 2H weapon card is clicked", async () => {
    const { onEquip } = renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => screen.getByText("Great Axe"));
    await userEvent.click(screen.getByText("Great Axe").closest("button")!);
    expect(onEquip).toHaveBeenCalledOnce();
    const [, calledSlot] = onEquip.mock.calls[0] as [GearResult, string | undefined];
    expect(calledSlot).toBeUndefined();
  });

  it("calls onEquip with item only when an Off-Hand weapon card is clicked", async () => {
    const { onEquip } = renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => screen.getByText("Iron Shield"));
    await userEvent.click(screen.getByText("Iron Shield").closest("button")!);
    expect(onEquip).toHaveBeenCalledOnce();
    const [, calledSlot] = onEquip.mock.calls[0] as [GearResult, string | undefined];
    expect(calledSlot).toBeUndefined();
  });

  it("calls onEquip with item only when a Ranged weapon card is clicked", async () => {
    const { onEquip } = renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => screen.getByText("Hunter's Bow"));
    await userEvent.click(screen.getByText("Hunter's Bow").closest("button")!);
    expect(onEquip).toHaveBeenCalledOnce();
    const [, calledSlot] = onEquip.mock.calls[0] as [GearResult, string | undefined];
    expect(calledSlot).toBeUndefined();
  });

  // ── slot buttons: 1H weapon ────────────────────────────────────────────────

  it("shows Main-Hand and Off-Hand buttons for a 1H weapon (not a clickable card)", async () => {
    renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => screen.getByText("Broad Sword"));
    expect(screen.getByRole("button", { name: "Main-Hand" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Off-Hand" })).toBeInTheDocument();
  });

  it("calls onEquip with MAIN_HAND when the Main-Hand slot button is clicked", async () => {
    const { onEquip } = renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => screen.getByText("Broad Sword"));
    await userEvent.click(screen.getByRole("button", { name: "Main-Hand" }));
    expect(onEquip).toHaveBeenCalledOnce();
    const [item, slot] = onEquip.mock.calls[0] as [GearResult, string];
    expect(item.name).toBe("Broad Sword");
    expect(slot).toBe("MAIN_HAND");
  });

  it("calls onEquip with OFF_HAND when the Off-Hand slot button is clicked", async () => {
    const { onEquip } = renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => screen.getByText("Broad Sword"));
    await userEvent.click(screen.getByRole("button", { name: "Off-Hand" }));
    expect(onEquip).toHaveBeenCalledOnce();
    const [item, slot] = onEquip.mock.calls[0] as [GearResult, string];
    expect(item.name).toBe("Broad Sword");
    expect(slot).toBe("OFF_HAND");
  });

  // ── slot buttons: Finger armor ─────────────────────────────────────────────

  it("shows Finger 1 and Finger 2 buttons for a ring, not a clickable card", async () => {
    renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => screen.getByText("Gold Ring"));
    expect(screen.getByRole("button", { name: "Finger 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Finger 2" })).toBeInTheDocument();
  });

  it("calls onEquip with FINGER_1 when Finger 1 button is clicked", async () => {
    const { onEquip } = renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => screen.getByText("Gold Ring"));
    await userEvent.click(screen.getByRole("button", { name: "Finger 1" }));
    expect(onEquip).toHaveBeenCalledOnce();
    const [item, slot] = onEquip.mock.calls[0] as [GearResult, string];
    expect(item.name).toBe("Gold Ring");
    expect(slot).toBe("FINGER_1");
  });

  it("calls onEquip with FINGER_2 when Finger 2 button is clicked", async () => {
    const { onEquip } = renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => screen.getByText("Gold Ring"));
    await userEvent.click(screen.getByRole("button", { name: "Finger 2" }));
    const [item, slot] = onEquip.mock.calls[0] as [GearResult, string];
    expect(item.name).toBe("Gold Ring");
    expect(slot).toBe("FINGER_2");
  });

  // ── slot buttons: Trinket armor ────────────────────────────────────────────

  it("shows Trinket 1 and Trinket 2 buttons for a trinket", async () => {
    renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => screen.getByText("Ancient Trinket"));
    expect(screen.getByRole("button", { name: "Trinket 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Trinket 2" })).toBeInTheDocument();
  });

  it("calls onEquip with TRINKET_1 when Trinket 1 button is clicked", async () => {
    const { onEquip } = renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => screen.getByText("Ancient Trinket"));
    await userEvent.click(screen.getByRole("button", { name: "Trinket 1" }));
    const [item, slot] = onEquip.mock.calls[0] as [GearResult, string];
    expect(item.name).toBe("Ancient Trinket");
    expect(slot).toBe("TRINKET_1");
  });

  it("calls onEquip with TRINKET_2 when Trinket 2 button is clicked", async () => {
    const { onEquip } = renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => screen.getByText("Ancient Trinket"));
    await userEvent.click(screen.getByRole("button", { name: "Trinket 2" }));
    const [item, slot] = onEquip.mock.calls[0] as [GearResult, string];
    expect(item.name).toBe("Ancient Trinket");
    expect(slot).toBe("TRINKET_2");
  });

  // ── icon rendering ─────────────────────────────────────────────────────────

  it("renders the item icon image when a result has a non-null iconUrl", async () => {
    server.use(
      http.get("/api/gear/search", () =>
        HttpResponse.json({
          armorPieces: [
            {
              armorType: "Plate",
              slot: "Head",
              name: "Glowy Helm",
              expansion: "Classic",
              primaryStat: "Strength",
              secondaryStat: "Stamina",
              cost: 150,
              notes: "",
              wowheadUrl: "",
              iconUrl: "https://wow.zamimg.com/images/wow/icons/large/inv_helm_01.jpg",
            },
          ],
          weapons: [],
        }),
      ),
    );
    renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "glo");
    vi.advanceTimersByTime(510);
    await waitFor(() => screen.getByText("Glowy Helm"));
    expect(screen.getByAltText("Glowy Helm")).toBeInTheDocument();
  });

  // ── error handling ─────────────────────────────────────────────────────────

  it("shows an error message when the API returns a non-OK response", async () => {
    server.use(http.get("/api/gear/search", () => new HttpResponse(null, { status: 500 })));
    renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/search failed/i));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByText("Iron Helm")).not.toBeInTheDocument();
  });

  it("shows an error message and stops the spinner when the fetch throws (network error)", async () => {
    server.use(http.get("/api/gear/search", () => HttpResponse.error()));
    renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510);
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/search failed/i));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("ignores a stale response when a newer query supersedes an in-flight request", async () => {
    // First query ("swo") is slow and returns results; refined query ("sword")
    // returns empty immediately. The slow response must not clobber the new one.
    server.use(
      http.get("/api/gear/search", async ({ request }) => {
        const q = new URL(request.url).searchParams.get("q");
        if (q === "swo") {
          await delay(2000);
          return HttpResponse.json(searchResults);
        }
        return HttpResponse.json(emptySearchResults);
      }),
    );
    renderSearch();
    const input = screen.getByRole("textbox", { name: /search gear/i });
    await userEvent.type(input, "swo");
    vi.advanceTimersByTime(510); // fire request A (slow)
    await userEvent.type(input, "rd"); // query becomes "sword" — aborts A
    vi.advanceTimersByTime(510); // fire request B (fast, empty)
    await waitFor(() => expect(screen.getByText(/no gear found/i)).toBeInTheDocument());
    vi.advanceTimersByTime(2000); // A's delayed response would land now if not aborted
    await waitFor(() => expect(screen.queryByText("Iron Helm")).not.toBeInTheDocument());
    expect(screen.getByText(/no gear found/i)).toBeInTheDocument();
  });
});
