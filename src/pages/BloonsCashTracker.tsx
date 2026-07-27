import React, { useState } from "react";
import doubleCashIcon from "../assets/Btd6Images/doubleCash.webp";
import easyIcon from "../assets/Btd6Images/easy.webp";
import hardIcon from "../assets/Btd6Images/hard.webp";
import impoppableIcon from "../assets/Btd6Images/impoppable.png";
import knowledgeIcon from "../assets/Btd6Images/knowledge.webp";
import mediumIcon from "../assets/Btd6Images/medium.webp";
import moneyIcon from "../assets/Btd6Images/money.webp";
import {
  Btd6Difficulty,
  BTD6_DIFFICULTIES,
  DIFFICULTY_ROUND_BOUNDS,
  MORE_CASH_KNOWLEDGE_BONUS,
} from "../constants/btd6";
import { cashAtStartOfRound, cashRemainingAfterRound, finalRoundUnspendableIncome } from "../utils/btd6Cash";
import { formatCurrency } from "../utils/format";
import {
  Page,
  PageTitle,
  PageSubtitle,
  ContentArea,
  Panel,
  FormRow,
  FormField,
  FormLabel,
  FormInput,
  RangeHint,
  DifficultyRow,
  DifficultyButton,
  DifficultyIcon,
  ToggleRow,
  ToggleLabel,
  ToggleInput,
  ToggleIcon,
  ResultsGrid,
  ResultCard,
  ResultLabel,
  ResultValue,
  ResultIcon,
  ResultFootnote,
  Note,
} from "./BloonsCashTracker.styles";

const DIFFICULTY_ICONS: Record<Btd6Difficulty, string> = {
  Easy: easyIcon,
  Medium: mediumIcon,
  Hard: hardIcon,
  Impoppable: impoppableIcon,
};

const BloonsCashTracker: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Btd6Difficulty>("Easy");
  const [round, setRound] = useState(DIFFICULTY_ROUND_BOUNDS.Easy.start);
  const [moreCashKnowledge, setMoreCashKnowledge] = useState(false);
  const [doubleCash, setDoubleCash] = useState(false);

  const { start, end } = DIFFICULTY_ROUND_BOUNDS[difficulty];

  const handleDifficultyChange = (value: Btd6Difficulty) => {
    setDifficulty(value);
    setRound(DIFFICULTY_ROUND_BOUNDS[value].start);
  };

  const handleRoundChange = (value: string) => {
    if (value === "") {
      return;
    }
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return;
    }
    setRound(Math.min(Math.max(parsed, start), end));
  };

  const options = { moreCashKnowledge, doubleCash };
  const earned = cashAtStartOfRound(difficulty, round, options);
  const remaining = cashRemainingAfterRound(difficulty, round, options);
  const finalRoundIncome = finalRoundUnspendableIncome(difficulty, options);

  return (
    <Page>
      <PageTitle>Bloons TD 6 Cash Tracker</PageTitle>
      <PageSubtitle>
        See how much cash you&apos;ve earned by the start of a round, and how much is left to earn for the rest of the
        game, without farming.
      </PageSubtitle>

      <ContentArea>
        <Panel>
          <FormField>
            <FormLabel>Difficulty</FormLabel>
            <DifficultyRow>
              {BTD6_DIFFICULTIES.map((d) => (
                <DifficultyButton
                  key={d}
                  type="button"
                  $active={d === difficulty}
                  onClick={() => handleDifficultyChange(d)}
                >
                  <DifficultyIcon src={DIFFICULTY_ICONS[d]} alt="" />
                  {d}
                </DifficultyButton>
              ))}
            </DifficultyRow>
          </FormField>

          <FormRow>
            <FormField>
              <FormLabel htmlFor="btd6-round">Round</FormLabel>
              <FormInput
                id="btd6-round"
                type="number"
                min={start}
                max={end}
                value={round}
                onChange={(e) => handleRoundChange(e.target.value)}
              />
              <RangeHint>
                Rounds {start}-{end} on {difficulty}
              </RangeHint>
            </FormField>
          </FormRow>

          <ToggleRow>
            <ToggleLabel htmlFor="btd6-more-cash">
              <ToggleInput
                id="btd6-more-cash"
                type="checkbox"
                checked={moreCashKnowledge}
                onChange={(e) => setMoreCashKnowledge(e.target.checked)}
              />
              <ToggleIcon src={knowledgeIcon} alt="" />
              More Cash knowledge (+${MORE_CASH_KNOWLEDGE_BONUS} starting cash)
            </ToggleLabel>
            <ToggleLabel htmlFor="btd6-double-cash">
              <ToggleInput
                id="btd6-double-cash"
                type="checkbox"
                checked={doubleCash}
                onChange={(e) => setDoubleCash(e.target.checked)}
              />
              <ToggleIcon src={doubleCashIcon} alt="" />
              Double Cash mode
            </ToggleLabel>
          </ToggleRow>
        </Panel>

        <ResultsGrid>
          <ResultCard>
            <ResultLabel>Earned by start of Round {round}</ResultLabel>
            <ResultValue>
              <ResultIcon src={moneyIcon} alt="" />
              {formatCurrency(earned)}
            </ResultValue>
          </ResultCard>
          <ResultCard>
            <ResultLabel>
              Left to spend, Rounds {round}-{end}
            </ResultLabel>
            <ResultValue>
              <ResultIcon src={moneyIcon} alt="" />
              {formatCurrency(remaining)}
            </ResultValue>
            <ResultFootnote>
              + {formatCurrency(finalRoundIncome)} more earned finishing Round {end}.
            </ResultFootnote>
          </ResultCard>
        </ResultsGrid>

        <Note>
          Assumes every bloon is popped with no leaks, farms, or bonus cash abilities. Sources:{" "}
          <a href="https://topper64.co.uk/nk/btd6/income" target="_blank" rel="noreferrer">
            topper64.co.uk
          </a>
          ,{" "}
          <a href="https://bloons.fandom.com/wiki/More_Cash" target="_blank" rel="noreferrer">
            More Cash
          </a>{" "}
          &{" "}
          <a href="https://bloons.fandom.com/wiki/Double_Cash" target="_blank" rel="noreferrer">
            Double Cash
          </a>{" "}
          (Bloons Wiki).
        </Note>
      </ContentArea>
    </Page>
  );
};

export default BloonsCashTracker;
