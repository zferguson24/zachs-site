import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BloonsCashTracker from "./BloonsCashTracker";

describe("BloonsCashTracker", () => {
  it("defaults to Easy, round 1, with More Cash knowledge already checked", () => {
    render(<BloonsCashTracker />);

    expect(screen.getByRole("button", { name: "Easy" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("Round")).toHaveValue(1);
    expect(screen.getByLabelText(/More Cash knowledge/)).toBeChecked();
    expect(screen.getByLabelText("Double Cash mode")).not.toBeChecked();
    expect(screen.getByText("Earned by start of Round 1")).toBeInTheDocument();
    expect(screen.getByText("$850")).toBeInTheDocument(); // $650 base + the $200 knowledge bonus
    expect(screen.getByText("Left to spend, Rounds 1-40")).toBeInTheDocument();
    expect(screen.getByText("$16,335")).toBeInTheDocument(); // unaffected - a flat bonus cancels out of "how much more"
    expect(screen.getByText("+ $521 more earned finishing Round 40.")).toBeInTheDocument();
  });

  it("switches difficulty, resetting the round to that mode's starting round", async () => {
    const user = userEvent.setup();
    render(<BloonsCashTracker />);

    await user.click(screen.getByRole("button", { name: "Hard" }));

    expect(screen.getByRole("button", { name: "Hard" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Easy" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByLabelText("Round")).toHaveValue(3); // Hard skips rounds 1-2
    expect(screen.getByText("Rounds 3-80 on Hard")).toBeInTheDocument();
  });

  it("recalculates results when the round number changes", () => {
    render(<BloonsCashTracker />);

    fireEvent.change(screen.getByLabelText("Round"), { target: { value: "10" } });

    expect(screen.getByText("Earned by start of Round 10")).toBeInTheDocument();
    expect(screen.getByText("$2,329")).toBeInTheDocument(); // cumulative cash through round 9 on Easy, +$200 knowledge
  });

  it("clamps a round number typed above the difficulty's final round", () => {
    render(<BloonsCashTracker />);

    fireEvent.change(screen.getByLabelText("Round"), { target: { value: "999" } });

    expect(screen.getByLabelText("Round")).toHaveValue(40);
  });

  it("removes the flat $200 bonus when More Cash knowledge is unchecked", async () => {
    const user = userEvent.setup();
    render(<BloonsCashTracker />);

    await user.click(screen.getByLabelText(/More Cash knowledge/));

    expect(screen.getByLabelText(/More Cash knowledge/)).not.toBeChecked();
    expect(screen.getByText("$650")).toBeInTheDocument();
  });

  it("doubles starting cash (including the already-checked knowledge bonus) under Double Cash", async () => {
    const user = userEvent.setup();
    render(<BloonsCashTracker />);

    await user.click(screen.getByLabelText("Double Cash mode"));

    expect(screen.getByText("$1,700")).toBeInTheDocument(); // (650 + 200 knowledge) x 2
  });

  it("disables and unchecks both cash modifiers when CHIMPS is selected", async () => {
    const user = userEvent.setup();
    render(<BloonsCashTracker />);

    // More Cash knowledge is already checked by default here - CHIMPS should force it off too.
    await user.click(screen.getByLabelText("Double Cash mode"));
    await user.click(screen.getByRole("button", { name: "CHIMPS" }));

    const moreCash = screen.getByLabelText(/More Cash knowledge/);
    const doubleCash = screen.getByLabelText("Double Cash mode");
    expect(moreCash).toBeDisabled();
    expect(doubleCash).toBeDisabled();
    expect(moreCash).not.toBeChecked();
    expect(doubleCash).not.toBeChecked();
    expect(screen.getByText("CHIMPS disables Monkey Knowledge and Double Cash.")).toBeInTheDocument();
  });

  it("re-checks More Cash knowledge on leaving CHIMPS, but leaves Double Cash off", async () => {
    const user = userEvent.setup();
    render(<BloonsCashTracker />);

    await user.click(screen.getByRole("button", { name: "CHIMPS" }));
    await user.click(screen.getByRole("button", { name: "Hard" }));

    const moreCash = screen.getByLabelText(/More Cash knowledge/);
    const doubleCash = screen.getByLabelText("Double Cash mode");
    expect(moreCash).toBeEnabled();
    expect(moreCash).toBeChecked();
    expect(doubleCash).toBeEnabled();
    expect(doubleCash).not.toBeChecked();
  });

  it("groups the difficulty buttons under an accessible 'Difficulty' label", () => {
    render(<BloonsCashTracker />);

    expect(screen.getByRole("group", { name: "Difficulty" })).toBeInTheDocument();
  });
});
