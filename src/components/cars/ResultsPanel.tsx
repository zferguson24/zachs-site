import styled, { createGlobalStyle } from "styled-components";
import { CarMatchResponse, CarVehicle, MatchResult } from "../../types/cars";
import {
  AXIS_LABELS,
  BODY_STYLE_LABELS,
  DRIVETRAIN_LABELS,
  IMAGE_BY_KEY,
  POWERTRAIN_LABELS,
  formatPrice,
} from "../../constants/cars";
import PlatePlaceholder from "./PlatePlaceholder";
import {
  BG_ACCENT,
  BG_ELEVATED,
  BG_SLOT,
  BORDER,
  BORDER_DIVIDER,
  BORDER_HOVER,
  FONT_XS,
  FONT_XXS,
  GOLD,
  GOLD_BRIGHT,
  RADIUS_MD,
  RADIUS_SM,
  TEXT_ACCENT,
  TEXT_BRIGHT,
  TEXT_DIM,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "../../styles/tokens";
import { EmptyMessage } from "../../styles/shared";

interface ResultsPanelProps {
  response: CarMatchResponse;
}

const VehicleImage: React.FC<{ vehicle: CarVehicle; compact?: boolean }> = ({ vehicle, compact }) => {
  const src = vehicle.imageKey ? IMAGE_BY_KEY[vehicle.imageKey] : undefined;
  if (src) {
    return <CarImg src={src} alt={`${vehicle.make} ${vehicle.model}`} />;
  }
  return <PlatePlaceholder bodyStyle={vehicle.bodyStyle} compact={compact} />;
};

const VehicleChips: React.FC<{ vehicle: CarVehicle }> = ({ vehicle }) => (
  <ChipRow>
    <InfoChip>{POWERTRAIN_LABELS[vehicle.powertrain]}</InfoChip>
    {vehicle.drivetrain && <InfoChip>{DRIVETRAIN_LABELS[vehicle.drivetrain]}</InfoChip>}
    <InfoChip>{BODY_STYLE_LABELS[vehicle.bodyStyle]}</InfoChip>
  </ChipRow>
);

const efficiencyLabel = (vehicle: CarVehicle): string =>
  vehicle.powertrain === "ELECTRIC" || vehicle.powertrain === "PLUGIN_HYBRID"
    ? `${vehicle.combinedMpge} MPGe`
    : `${vehicle.combinedMpge} MPG`;

// Ranked match results: the winner gets the crowned card with the sweeping
// gold glow; ranks 2–3 get compact cards below it.
const ResultsPanel: React.FC<ResultsPanelProps> = ({ response }) => {
  if (response.results.length === 0) {
    return <EmptyMessage>No cars match your filters. Loosen a constraint and try again.</EmptyMessage>;
  }

  const [winner, ...runnersUp] = response.results;

  return (
    <Results aria-label="Match results">
      <GlowStyles />
      <WinnerGlow>
        <WinnerCard>
          <WinnerPad>
            <VehicleImage vehicle={winner.vehicle} />
          </WinnerPad>
          <WinnerInfo>
            <CrownRow>
              <CrownBadge>★ Winner</CrownBadge>
              <RankNote>
                RANK 1 OF {response.results.length} · POOL {response.poolSize}
              </RankNote>
            </CrownRow>
            <CarName>
              {winner.vehicle.make} {winner.vehicle.model}
            </CarName>
            <VehicleChips vehicle={winner.vehicle} />
            <ScoreRow>
              <ScoreBig>{winner.matchScore.toFixed(1)}</ScoreBig>
              <ScoreCaption>match score</ScoreCaption>
            </ScoreRow>
            <Axes>
              {winner.axes.map((axis) => (
                <AxisRow key={axis.axis}>
                  <AxisName>
                    {AXIS_LABELS[axis.axis]} <em>×{axis.importance}</em>
                  </AxisName>
                  <Bar>
                    <BarFill style={{ width: `${axis.axisValue}%` }} />
                  </Bar>
                  <AxisValue>{axis.axisValue.toFixed(1)}</AxisValue>
                </AxisRow>
              ))}
            </Axes>
            <Specs>
              <Spec>
                <small>MSRP</small>
                <b>
                  {formatPrice(winner.vehicle.msrp)}
                  {winner.vehicle.msrpIsEstimate && <Estimate> est.</Estimate>}
                </b>
              </Spec>
              {winner.vehicle.horsepower !== null && (
                <Spec>
                  <small>Power</small>
                  <b>{winner.vehicle.horsepower} hp</b>
                </Spec>
              )}
              <Spec>
                <small>Combined</small>
                <b>{efficiencyLabel(winner.vehicle)}</b>
              </Spec>
              {winner.vehicle.evRangeMi !== null && (
                <Spec>
                  <small>Range</small>
                  <b>{winner.vehicle.evRangeMi} mi</b>
                </Spec>
              )}
            </Specs>
            {winner.vehicle.flavorText && <FlavorText>{winner.vehicle.flavorText}</FlavorText>}
          </WinnerInfo>
        </WinnerCard>
      </WinnerGlow>

      {runnersUp.length > 0 && (
        <Runners>
          {runnersUp.map((result: MatchResult) => (
            <RunnerCard key={result.vehicle.id}>
              <RunnerPad>
                <VehicleImage vehicle={result.vehicle} compact />
              </RunnerPad>
              <RunnerInfo>
                <RankNote>RANK {result.rank}</RankNote>
                <RunnerName>
                  {result.vehicle.make} {result.vehicle.model}
                </RunnerName>
                <RunnerScore>{result.matchScore.toFixed(1)}</RunnerScore>
                <RunnerMeta>
                  {POWERTRAIN_LABELS[result.vehicle.powertrain]} · {formatPrice(result.vehicle.msrp)}
                  {result.vehicle.msrpIsEstimate ? " est." : ""} · {efficiencyLabel(result.vehicle)}
                </RunnerMeta>
              </RunnerInfo>
            </RunnerCard>
          ))}
        </Runners>
      )}
    </Results>
  );
};

// The sweep angle is an animated registered custom property — @property and
// @keyframes must live at the stylesheet top level, hence the global style.
// Browsers without @property simply keep the static gold border.
const GlowStyles = createGlobalStyle`
  @property --mb-sweep {
    syntax: "<angle>";
    inherits: false;
    initial-value: 0deg;
  }

  @keyframes mb-sweep {
    to { --mb-sweep: 360deg; }
  }
`;

const Results = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const WinnerGlow = styled.div`
  position: relative;
  border-radius: 8px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: 9px;
    padding: 2px;
    background: conic-gradient(
      from var(--mb-sweep),
      transparent 0deg,
      transparent 292deg,
      ${GOLD} 322deg,
      ${GOLD_BRIGHT} 340deg,
      ${GOLD} 358deg,
      transparent 360deg
    );
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    mask-composite: exclude;
    animation: mb-sweep 8s linear infinite;
    pointer-events: none;
  }

  &::after {
    filter: blur(6px);
    opacity: 0.65;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      animation: none;
    }
  }
`;

const WinnerCard = styled.article`
  background: ${BG_ELEVATED};
  border: 1px solid ${GOLD};
  border-radius: ${RADIUS_MD};
  display: grid;
  grid-template-columns: minmax(240px, 5fr) 4fr;
  overflow: hidden;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const WinnerPad = styled.div`
  background: ${BG_SLOT};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px 20px;
  border-right: 1px solid ${BORDER_DIVIDER};

  @media (max-width: 720px) {
    border-right: none;
    border-bottom: 1px solid ${BORDER_DIVIDER};
  }
`;

const WinnerInfo = styled.div`
  padding: 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CarImg = styled.img`
  max-width: 100%;
  max-height: 220px;
  object-fit: contain;
  border-radius: ${RADIUS_SM};
`;

const CrownRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const CrownBadge = styled.span`
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
  color: ${GOLD};
  border: 1px solid ${GOLD};
  border-radius: ${RADIUS_SM};
  padding: 3px 8px;
`;

const RankNote = styled.span`
  font-size: ${FONT_XXS};
  color: ${TEXT_DIM};
  letter-spacing: 0.1em;
`;

const CarName = styled.h2`
  font-size: 24px;
  font-weight: 650;
  margin: 0;
  line-height: 1.15;
  color: ${TEXT_PRIMARY};
`;

const ChipRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const InfoChip = styled.span`
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${TEXT_ACCENT};
  background: ${BG_ACCENT};
  border: 1px solid ${BORDER};
  border-radius: ${RADIUS_SM};
  padding: 2px 8px;
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const ScoreBig = styled.span`
  font-size: 44px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: ${TEXT_PRIMARY};
`;

const ScoreCaption = styled.span`
  font-size: ${FONT_XXS};
  color: ${TEXT_SECONDARY};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Axes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AxisRow = styled.div`
  display: grid;
  grid-template-columns: 110px 1fr 44px;
  gap: 10px;
  align-items: center;
`;

const AxisName = styled.span`
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${TEXT_SECONDARY};

  em {
    font-style: normal;
    color: ${TEXT_DIM};
  }
`;

const Bar = styled.div`
  height: 8px;
  background: ${BG_SLOT};
  border-radius: 99px;
  overflow: hidden;
  border: 1px solid ${BORDER_DIVIDER};
`;

const BarFill = styled.i`
  display: block;
  height: 100%;
  background: ${BORDER_HOVER};
  border-radius: 99px;
`;

const AxisValue = styled.span`
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  text-align: right;
  color: ${TEXT_BRIGHT};
`;

const Specs = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, max-content));
  gap: 4px 22px;
  border-top: 1px solid ${BORDER_DIVIDER};
  padding-top: 12px;
`;

const Spec = styled.div`
  small {
    display: block;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${TEXT_DIM};
  }

  b {
    font-size: ${FONT_XS};
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: ${TEXT_PRIMARY};
  }
`;

const Estimate = styled.span`
  color: ${TEXT_SECONDARY};
  font-weight: 400;
  font-size: 11px;
`;

const FlavorText = styled.p`
  font-size: ${FONT_XS};
  color: ${TEXT_BRIGHT};
  font-style: italic;
  margin: 0;
`;

const Runners = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const RunnerCard = styled.article`
  background: ${BG_ELEVATED};
  border: 1px solid ${BORDER};
  border-radius: ${RADIUS_MD};
  overflow: hidden;
  display: grid;
  grid-template-columns: 170px 1fr;
  align-items: center;
`;

const RunnerPad = styled.div`
  background: ${BG_SLOT};
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-right: 1px solid ${BORDER_DIVIDER};
`;

const RunnerInfo = styled.div`
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RunnerName = styled.h3`
  font-size: ${FONT_XS};
  font-weight: 650;
  margin: 0;
  color: ${TEXT_PRIMARY};
`;

const RunnerScore = styled.span`
  font-size: 22px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${TEXT_BRIGHT};
`;

const RunnerMeta = styled.span`
  font-size: ${FONT_XXS};
  color: ${TEXT_SECONDARY};
`;

export default ResultsPanel;
