import styled from "styled-components";
import {
  BG_ELEVATED,
  BG_SLOT,
  BORDER,
  BORDER_HOVER,
  FONT_XXS,
  RADIUS_MD,
  RADIUS_SM,
  TEXT_BRIGHT,
  TEXT_DIM,
  TEXT_SECONDARY,
} from "../../styles/tokens";

interface AxisCardProps {
  label: string;
  importance: number;
  onImportanceChange: (value: number) => void;
  // Present only on the Size axis: a small↔large target slider that becomes
  // meaningful once the axis has any importance.
  target?: number;
  onTargetChange?: (value: number) => void;
  targetLabels?: [string, string];
}

// One scored preference axis. Importance 0 is an explicit "No preference" —
// the axis is excluded from scoring entirely, never an implicit zero.
const AxisCard: React.FC<AxisCardProps> = ({
  label,
  importance,
  onImportanceChange,
  target,
  onTargetChange,
  targetLabels,
}) => {
  const hasTarget = onTargetChange !== undefined;

  return (
    <Card>
      <Header>
        <AxisName>{label}</AxisName>
        <Value $active={importance > 0}>{importance > 0 ? `importance ${importance}` : "No preference"}</Value>
      </Header>
      <Slider
        type="range"
        min={0}
        max={10}
        step={1}
        value={importance}
        aria-label={`${label} importance`}
        onChange={(e) => onImportanceChange(Number(e.target.value))}
      />
      {hasTarget && (
        <TargetRow $enabled={importance > 0}>
          <TargetLabel>{targetLabels?.[0]}</TargetLabel>
          <Slider
            type="range"
            min={0}
            max={10}
            step={1}
            value={target ?? 5}
            disabled={importance === 0}
            aria-label={`${label} target`}
            onChange={(e) => onTargetChange(Number(e.target.value))}
          />
          <TargetLabel>{targetLabels?.[1]}</TargetLabel>
        </TargetRow>
      )}
    </Card>
  );
};

const Card = styled.div`
  background: ${BG_ELEVATED};
  border: 1px solid ${BORDER};
  border-radius: ${RADIUS_MD};
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
`;

const AxisName = styled.span`
  font-size: ${FONT_XXS};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${TEXT_BRIGHT};
  font-weight: 600;
`;

const Value = styled.span<{ $active: boolean }>`
  font-size: ${FONT_XXS};
  color: ${({ $active }) => ($active ? TEXT_BRIGHT : TEXT_DIM)};
  font-variant-numeric: tabular-nums;
`;

const Slider = styled.input`
  width: 100%;
  accent-color: ${BORDER_HOVER};
  background: ${BG_SLOT};
  border-radius: ${RADIUS_SM};
  height: 6px;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.4;
  }
`;

const TargetRow = styled.div<{ $enabled: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  opacity: ${({ $enabled }) => ($enabled ? 1 : 0.45)};
`;

const TargetLabel = styled.span`
  font-size: ${FONT_XXS};
  color: ${TEXT_SECONDARY};
`;

export default AxisCard;
