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

function startingCash(options: Btd6CashOptions): number {
  const base = 650 + (options.moreCashKnowledge ? MORE_CASH_KNOWLEDGE_BONUS : 0);
  return options.doubleCash ? base * 2 : base;
}

// This round's total income (pops + the round-completion bonus), before any modifiers.
function baseRoundIncome(difficulty: Btd6Difficulty, round: number): number {
  const { start } = DIFFICULTY_ROUND_BOUNDS[difficulty];
  const table = CUMULATIVE_CASH_BY_ROUND[difficulty];
  const previous = round === start ? 0 : round - 1;
  return table[round] - table[previous];
}

// Double Cash doubles cash earned from popping bloons, but not the flat $(100+round)
// round-completion bonus - see the "BTD6" effects section of
// https://bloons.fandom.com/wiki/Double_Cash. Pop income for a round is backed out of the
// scraped total via that same completion-bonus formula.
function effectiveRoundIncome(difficulty: Btd6Difficulty, round: number, doubleCash: boolean): number {
  const income = baseRoundIncome(difficulty, round);
  if (!doubleCash) {return income;}

  const completionBonus = 100 + round;
  const popIncome = income - completionBonus;
  return popIncome * 2 + completionBonus;
}

function cumulativeThroughRound(difficulty: Btd6Difficulty, round: number, options: Btd6CashOptions): number {
  const { start } = DIFFICULTY_ROUND_BOUNDS[difficulty];
  let total = startingCash(options);
  for (let r = start; r <= round; r++) {
    total += effectiveRoundIncome(difficulty, r, options.doubleCash ?? false);
  }
  return total;
}

// Cash on hand at the moment round `round` begins, i.e. everything earned finishing
// every prior round (skipped rounds on Hard/Impoppable contribute nothing).
export function cashAtStartOfRound(difficulty: Btd6Difficulty, round: number, options: Btd6CashOptions = {}): number {
  const { start } = DIFFICULTY_ROUND_BOUNDS[difficulty];
  return round <= start ? startingCash(options) : cumulativeThroughRound(difficulty, round - 1, options);
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

// The cash reward for finishing the difficulty's final round - earned the instant the game
// ends, so it's never actually spendable on a tower or upgrade.
export function finalRoundUnspendableIncome(difficulty: Btd6Difficulty, options: Btd6CashOptions = {}): number {
  const { end } = DIFFICULTY_ROUND_BOUNDS[difficulty];
  return cumulativeThroughRound(difficulty, end, options) - cumulativeThroughRound(difficulty, end - 1, options);
}
