import { describe, it, expect } from "vitest";
import { cashAtStartOfRound, cashRemainingAfterRound, finalRoundUnspendableIncome, incomeFromRound } from "./btd6Cash";
import { CUMULATIVE_CASH_BY_ROUND } from "../constants/btd6";

describe("cashAtStartOfRound", () => {
  it("returns base starting cash before or at a difficulty's first round", () => {
    expect(cashAtStartOfRound("Easy", 1)).toBe(650);
    expect(cashAtStartOfRound("Hard", 3)).toBe(650); // Hard starts at round 3, skipping 1-2
    expect(cashAtStartOfRound("Impoppable", 6)).toBe(650); // Impoppable starts at round 6
  });

  it("matches the scraped cumulative table for later rounds", () => {
    // cashAtStartOfRound(d, r) is everything earned finishing round r-1
    expect(cashAtStartOfRound("Easy", 2)).toBe(CUMULATIVE_CASH_BY_ROUND.Easy[1]);
    expect(cashAtStartOfRound("Easy", 40)).toBe(CUMULATIVE_CASH_BY_ROUND.Easy[39]);
    expect(cashAtStartOfRound("Hard", 4)).toBe(CUMULATIVE_CASH_BY_ROUND.Hard[3]);
  });

  it("adds the flat More Cash knowledge bonus to starting cash only", () => {
    expect(cashAtStartOfRound("Easy", 1, { moreCashKnowledge: true })).toBe(850);
  });

  it("doubles starting cash (including the knowledge bonus) under Double Cash", () => {
    expect(cashAtStartOfRound("Easy", 1, { doubleCash: true })).toBe(1300);
    expect(cashAtStartOfRound("Easy", 1, { moreCashKnowledge: true, doubleCash: true })).toBe(1700);
  });

  it("uses Half Cash's own halved baseline rather than the standard $650", () => {
    expect(cashAtStartOfRound("Half Cash", 3)).toBe(325);
  });

  it("mirrors Impoppable exactly for CHIMPS (verified identical bloon spawns/scaling)", () => {
    expect(cashAtStartOfRound("CHIMPS", 6)).toBe(cashAtStartOfRound("Impoppable", 6));
    expect(cashAtStartOfRound("CHIMPS", 50)).toBe(cashAtStartOfRound("Impoppable", 50));
    expect(cashAtStartOfRound("CHIMPS", 100)).toBe(cashAtStartOfRound("Impoppable", 100));
  });
});

describe("cashRemainingAfterRound", () => {
  it("is zero once the final round has started - its reward is never spendable", () => {
    expect(cashRemainingAfterRound("Easy", 40)).toBe(0);
    expect(cashRemainingAfterRound("Impoppable", 100)).toBe(0);
  });

  it("equals the total spendable income for the rest of the game from round 1", () => {
    const { Easy } = CUMULATIVE_CASH_BY_ROUND;
    expect(cashRemainingAfterRound("Easy", 1)).toBe(Easy[39] - Easy[0]);
  });

  it("shrinks as the selected round advances", () => {
    const early = cashRemainingAfterRound("Medium", 1);
    const later = cashRemainingAfterRound("Medium", 30);
    expect(later).toBeLessThan(early);
  });
});

describe("incomeFromRound", () => {
  it("matches the per-round delta in the scraped table", () => {
    const { Easy } = CUMULATIVE_CASH_BY_ROUND;
    expect(incomeFromRound("Easy", 1)).toBe(Easy[1] - Easy[0]);
    expect(incomeFromRound("Easy", 10)).toBe(Easy[10] - Easy[9]);
  });

  it("is unaffected by the flat More Cash knowledge bonus", () => {
    expect(incomeFromRound("Easy", 1)).toBe(incomeFromRound("Easy", 1, { moreCashKnowledge: true }));
  });

  it("is doubled by Double Cash", () => {
    expect(incomeFromRound("Easy", 1, { doubleCash: true })).toBe(incomeFromRound("Easy", 1) * 2);
  });

  it("equals finalRoundUnspendableIncome at the difficulty's last round", () => {
    expect(incomeFromRound("Easy", 40)).toBe(finalRoundUnspendableIncome("Easy"));
  });
});

describe("finalRoundUnspendableIncome", () => {
  it("matches the gap between the last two rows of the scraped table", () => {
    const { Easy, Impoppable } = CUMULATIVE_CASH_BY_ROUND;
    expect(finalRoundUnspendableIncome("Easy")).toBe(Easy[40] - Easy[39]);
    expect(finalRoundUnspendableIncome("Impoppable")).toBe(Impoppable[100] - Impoppable[99]);
  });
});

describe("Half Cash + Double Cash cancellation", () => {
  // Both are uniform multipliers (x0.5 and x2) over the same modeled income, so stacking them
  // should land within a dollar of plain Hard - the only slack is independent rounding between
  // the two separately-scraped tables.
  it("nets back out to roughly Hard's numbers", () => {
    const hardEarned = cashAtStartOfRound("Hard", 40);
    const halfDoubleEarned = cashAtStartOfRound("Half Cash", 40, { doubleCash: true });
    expect(Math.abs(halfDoubleEarned - hardEarned)).toBeLessThanOrEqual(2);

    const hardRemaining = cashRemainingAfterRound("Hard", 40);
    const halfDoubleRemaining = cashRemainingAfterRound("Half Cash", 40, { doubleCash: true });
    expect(Math.abs(halfDoubleRemaining - hardRemaining)).toBeLessThanOrEqual(2);
  });
});
