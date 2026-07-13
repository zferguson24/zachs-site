import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import CarSelection from "./CarSelection";
import { server } from "../test/mocks/server";
import { emptyMatchResponse } from "../test/mocks/carFixtures";
import type { CarMatchRequest } from "../types/cars";

async function renderReady() {
  render(<CarSelection />);
  await screen.findByText("Hard filters");
}

describe("CarSelection", () => {
  it("loads filter options from the catalog on mount", async () => {
    await renderReady();

    expect(screen.getByRole("button", { name: "Pickup" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Plug-in Hybrid" })).toBeInTheDocument();
    expect(screen.getByText(/43 cars/)).toBeInTheDocument();
  });

  it("shows an error when the catalog cannot load", async () => {
    server.use(http.get("/api/cars/filters", () => new HttpResponse(null, { status: 500 })));

    render(<CarSelection />);

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not load/i);
  });

  it("keeps the match button disabled until a preference is set", async () => {
    await renderReady();

    const button = screen.getByRole("button", { name: "Find my match" });
    expect(button).toBeDisabled();
    expect(screen.getByText(/set at least one preference/i)).toBeInTheDocument();
  });

  it("sends only the fields the user actually set", async () => {
    let captured: CarMatchRequest | undefined;
    server.use(
      http.post("/api/cars/match", async ({ request }) => {
        captured = (await request.json()) as CarMatchRequest;
        return HttpResponse.json(emptyMatchResponse);
      }),
    );
    const user = userEvent.setup();
    await renderReady();

    await user.type(screen.getByLabelText("Max price"), "35000");
    await user.click(screen.getByRole("button", { name: "SUV" }));
    await user.click(screen.getByRole("button", { name: "Electric" }));

    fireEvent.change(screen.getByLabelText("Efficiency importance"), { target: { value: "9" } });

    await user.click(screen.getByRole("button", { name: "Find my match" }));

    await waitFor(() => expect(captured).toBeDefined());
    expect(captured).toEqual({
      maxPrice: 35000,
      bodyStyles: ["SUV"],
      powertrains: ["ELECTRIC"],
      efficiencyImportance: 9,
    });
    // Unset fields must be absent, not null/zero.
    expect(captured).not.toHaveProperty("drivetrains");
    expect(captured).not.toHaveProperty("performanceImportance");
    expect(captured).not.toHaveProperty("sizeTarget");
  });

  it("includes sizeTarget only when size importance is set", async () => {
    let captured: CarMatchRequest | undefined;
    server.use(
      http.post("/api/cars/match", async ({ request }) => {
        captured = (await request.json()) as CarMatchRequest;
        return HttpResponse.json(emptyMatchResponse);
      }),
    );
    const user = userEvent.setup();
    await renderReady();

    fireEvent.change(screen.getByLabelText("Size importance"), { target: { value: "5" } });
    fireEvent.change(screen.getByLabelText("Size target"), { target: { value: "8" } });

    await user.click(screen.getByRole("button", { name: "Find my match" }));

    await waitFor(() => expect(captured).toBeDefined());
    expect(captured).toEqual({ sizeImportance: 5, sizeTarget: 8 });
  });

  it("renders the winner with score breakdown and the runners-up", async () => {
    const user = userEvent.setup();
    await renderReady();

    fireEvent.change(screen.getByLabelText("Performance importance"), { target: { value: "1" } });
    await user.click(screen.getByRole("button", { name: "Find my match" }));

    expect(await screen.findByText("Chevrolet Equinox")).toBeInTheDocument();
    expect(screen.getByText("★ Winner")).toBeInTheDocument();
    expect(screen.getByText("90.0")).toBeInTheDocument();
    expect(screen.getByText(/POOL 26/)).toBeInTheDocument();
    // Winner has a curated image; runners-up fall back to plates.
    expect(screen.getByAltText("Chevrolet Equinox")).toBeInTheDocument();
    expect(screen.getAllByRole("img", { name: /no photo on file/i })).toHaveLength(2);
    expect(screen.getByText("Toyota Prius")).toBeInTheDocument();
    expect(screen.getByText("Toyota Camry")).toBeInTheDocument();
    // Estimated prices carry the marker.
    expect(screen.getAllByText(/est\./i).length).toBeGreaterThan(0);
  });

  it("shows the empty-pool message when nothing matches", async () => {
    server.use(http.post("/api/cars/match", () => HttpResponse.json(emptyMatchResponse)));
    const user = userEvent.setup();
    await renderReady();

    fireEvent.change(screen.getByLabelText("Performance importance"), { target: { value: "1" } });
    await user.click(screen.getByRole("button", { name: "Find my match" }));

    expect(await screen.findByText(/no cars match your filters/i)).toBeInTheDocument();
  });

  it("surfaces backend validation errors", async () => {
    server.use(
      http.post("/api/cars/match", () =>
        HttpResponse.json({ error: "At least one importance must be greater than 0" }, { status: 400 }),
      ),
    );
    const user = userEvent.setup();
    await renderReady();

    fireEvent.change(screen.getByLabelText("Performance importance"), { target: { value: "1" } });
    await user.click(screen.getByRole("button", { name: "Find my match" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/match request failed/i);
  });
});
