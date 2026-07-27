import {
  Btd6Difficulty,
  CUMULATIVE_CASH_BY_ROUND,
  DIFFICULTY_ROUND_BOUNDS,
  MORE_CASH_KNOWLEDGE_BONUS,
} from "../constants/btd6";

export interface Btd6CashOptions {
  moreCashKnowledge?: boolean;
  doubleCash?: boolean;
}

// Starting cash for this mode (Half Cash already bakes its own 0.5x into round 0 of the
// table, e.g. $325 instead of $650), plus the flat More Cash knowledge bonus, doubled by
// Double Cash if active.
function startingCash(difficulty: Btd6Difficulty, options: Btd6CashOptions): number {
  const base = CUMULATIVE_CASH_BY_ROUND[difficulty][0] + (options.moreCashKnowledge ? MORE_CASH_KNOWLEDGE_BONUS : 0);
  return options.doubleCash ? base * 2 : base;
}

// This round's total income (pops + the round-completion bonus), before any modifiers.
function baseRoundIncome(difficulty: Btd6Difficulty, round: number): number {
  const { start } = DIFFICULTY_ROUND_BOUNDS[difficulty];
  const table = CUMULATIVE_CASH_BY_ROUND[difficulty];
  const previous = round === start ? 0 : round - 1;
  return table[round] - table[previous];
}

// Double Cash doubles starting cash, per-pop income, and the round-completion bonus alike -
// cross-referencing the Half Cash article confirms this: Half Cash's own $0.5x applies
// uniformly to all three, and it's described as fully cancelling Double Cash when both are
// active, which only works if Double Cash is also uniform. See
// https://bloons.fandom.com/wiki/Half_Cash and https://bloons.fandom.com/wiki/Double_Cash.
function cumulativeThroughRound(difficulty: Btd6Difficulty, round: number, options: Btd6CashOptions): number {
  const { start } = DIFFICULTY_ROUND_BOUNDS[difficulty];
  const multiplier = options.doubleCash ? 2 : 1;
  let total = startingCash(difficulty, options);
  for (let r = start; r <= round; r++) {
    total += baseRoundIncome(difficulty, r) * multiplier;
  }
  return total;
}

// Cash on hand at the moment round `round` begins, i.e. everything earned finishing
// every prior round (skipped rounds on Hard/Impoppable contribute nothing).
export function cashAtStartOfRound(difficulty: Btd6Difficulty, round: number, options: Btd6CashOptions = {}): number {
  const { start } = DIFFICULTY_ROUND_BOUNDS[difficulty];
  return round <= start ? startingCash(difficulty, options) : cumulativeThroughRound(difficulty, round - 1, options);
}

// Cash still spendable (pops + round-completion bonuses, no farms) between the start of
// `round` and the end of the standard game for this difficulty. Excludes the reward for
// finishing the final round itself - that cash lands as the game already ends, so there's
// nothing left to spend it on. See finalRoundUnspendableIncome.
export function cashRemainingAfterRound(
  difficulty: Btd6Difficulty,
  round: number,
  options: Btd6CashOptions = {},
): number {
  const { end } = DIFFICULTY_ROUND_BOUNDS[difficulty];
  return cumulativeThroughRound(difficulty, end - 1, options) - cashAtStartOfRound(difficulty, round, options);
}

// Cash earned by finishing `round` itself - pops plus that round's completion bonus, with
// modifiers applied. This is what gets added to the total the moment the round ends.
export function incomeFromRound(difficulty: Btd6Difficulty, round: number, options: Btd6CashOptions = {}): number {
  const { start } = DIFFICULTY_ROUND_BOUNDS[difficulty];
  const clampedRound = Math.max(round, start);
  return (
    cumulativeThroughRound(difficulty, clampedRound, options) -
    cumulativeThroughRound(difficulty, clampedRound - 1, options)
  );
}

// The cash reward for finishing the difficulty's final round - earned the instant the game
// ends, so it's never actually spendable on a tower or upgrade.
export function finalRoundUnspendableIncome(difficulty: Btd6Difficulty, options: Btd6CashOptions = {}): number {
  const { end } = DIFFICULTY_ROUND_BOUNDS[difficulty];
  return incomeFromRound(difficulty, end, options);
}
