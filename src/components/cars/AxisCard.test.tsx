import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import AxisCard from "./AxisCard";

describe("AxisCard", () => {
  it("shows an explicit No preference state at importance 0", () => {
    render(<AxisCard label="Performance" importance={0} onImportanceChange={vi.fn()} />);

    expect(screen.getByText("No preference")).toBeInTheDocument();
  });

  it("shows the importance value once set", () => {
    render(<AxisCard label="Performance" importance={7} onImportanceChange={vi.fn()} />);

    expect(screen.getByText("importance 7")).toBeInTheDocument();
  });

  it("reports slider changes", () => {
    const onChange = vi.fn();
    render(<AxisCard label="Efficiency" importance={0} onImportanceChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Efficiency importance"), { target: { value: "6" } });

    expect(onChange).toHaveBeenCalledWith(6);
  });

  it("disables the target slider while importance is 0", () => {
    render(
      <AxisCard
        label="Size"
        importance={0}
        onImportanceChange={vi.fn()}
        target={5}
        onTargetChange={vi.fn()}
        targetLabels={["Small", "Large"]}
      />,
    );

    expect(screen.getByLabelText("Size target")).toBeDisabled();
    expect(screen.getByText("Small")).toBeInTheDocument();
    expect(screen.getByText("Large")).toBeInTheDocument();
  });

  it("enables the target slider once the axis has importance", () => {
    const onTarget = vi.fn();
    render(
      <AxisCard
        label="Size"
        importance={4}
        onImportanceChange={vi.fn()}
        target={5}
        onTargetChange={onTarget}
        targetLabels={["Small", "Large"]}
      />,
    );

    const target = screen.getByLabelText("Size target");
    expect(target).toBeEnabled();
    fireEvent.change(target, { target: { value: "8" } });
    expect(onTarget).toHaveBeenCalledWith(8);
  });

  it("renders no target row for monotonic axes", () => {
    render(<AxisCard label="Performance" importance={3} onImportanceChange={vi.fn()} />);

    expect(screen.queryByLabelText("Performance target")).not.toBeInTheDocument();
  });
});
