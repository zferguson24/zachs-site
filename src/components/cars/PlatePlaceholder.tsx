import styled from "styled-components";
import { BodyStyle } from "../../types/cars";
import { BODY_STYLE_LABELS } from "../../constants/cars";
import { TEXT_DIM, TEXT_PRIMARY, TEXT_SECONDARY } from "../../styles/tokens";

interface PlatePlaceholderProps {
  bodyStyle: BodyStyle;
  compact?: boolean;
}

// Registration-plate placeholder shown when a vehicle has no curated photo.
// The body style is the plate text, so the fallback still identifies the car
// class on sight.
const PlatePlaceholder: React.FC<PlatePlaceholderProps> = ({ bodyStyle, compact = false }) => (
  <Plate $compact={compact} role="img" aria-label={`${BODY_STYLE_LABELS[bodyStyle]} — no photo on file`}>
    <Bolt style={{ top: 8, left: 12 }} />
    <Bolt style={{ top: 8, right: 12 }} />
    <Bolt style={{ bottom: 8, left: 12 }} />
    <Bolt style={{ bottom: 8, right: 12 }} />
    <PlateCaption $compact={compact}>MATCHBOX · NO PHOTO ON FILE</PlateCaption>
    <PlateText $compact={compact}>{BODY_STYLE_LABELS[bodyStyle].toUpperCase()}</PlateText>
  </Plate>
);

const Plate = styled.div<{ $compact: boolean }>`
  border: ${({ $compact }) => ($compact ? "2.5px" : "3px")} solid ${TEXT_PRIMARY};
  border-radius: 10px;
  padding: ${({ $compact }) => ($compact ? "10px 18px 12px" : "14px 30px 18px")};
  position: relative;
  text-align: center;
  min-width: ${({ $compact }) => ($compact ? "0" : "200px")};
  background: transparent;
`;

const Bolt = styled.span`
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${TEXT_DIM};
`;

const PlateCaption = styled.small<{ $compact: boolean }>`
  display: block;
  font-family: Consolas, "Cascadia Mono", ui-monospace, monospace;
  font-size: ${({ $compact }) => ($compact ? "7px" : "9px")};
  letter-spacing: 0.22em;
  color: ${TEXT_SECONDARY};
  margin-bottom: 2px;
  white-space: nowrap;
`;

const PlateText = styled.b<{ $compact: boolean }>`
  font-size: ${({ $compact }) => ($compact ? "20px" : "32px")};
  letter-spacing: 0.12em;
  font-weight: 700;
  color: ${TEXT_PRIMARY};
`;

export default PlatePlaceholder;
