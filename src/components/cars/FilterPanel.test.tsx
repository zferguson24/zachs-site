import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import FilterPanel, { FilterState } from "./FilterPanel";
import { carFilters } from "../../test/mocks/carFixtures";

const emptyState: FilterState = {
  maxPrice: "",
  bodyStyles: [],
  powertrains: [],
  drivetrains: [],
  manualOnly: false,
};

describe("FilterPanel", () => {
  it("renders one chip per catalog option", () => {
    render(<FilterPanel options={carFilters} state={emptyState} onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Sports Car" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Diesel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "4WD" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/catalog \$21,500 – \$62,400/i)).toBeInTheDocument();
  });

  it("toggles a body style on and off", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<FilterPanel options={carFilters} state={emptyState} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "SUV" }));
    expect(onChange).toHaveBeenLastCalledWith({ ...emptyState, bodyStyles: ["SUV"] });

    rerender(<FilterPanel options={carFilters} state={{ ...emptyState, bodyStyles: ["SUV"] }} onChange={onChange} />);
    expect(screen.getByRole("button", { name: "SUV" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "SUV" }));
    expect(onChange).toHaveBeenLastCalledWith({ ...emptyState, bodyStyles: [] });
  });

  it("reports max price and manual-only changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FilterPanel options={carFilters} state={emptyState} onChange={onChange} />);

    await user.type(screen.getByLabelText("Max price"), "4");
    expect(onChange).toHaveBeenLastCalledWith({ ...emptyState, maxPrice: "4" });

    await user.click(screen.getByLabelText(/manual transmission/i));
    expect(onChange).toHaveBeenLastCalledWith({ ...emptyState, manualOnly: true });
  });
});
