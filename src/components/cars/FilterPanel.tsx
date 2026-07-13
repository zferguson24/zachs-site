import styled from "styled-components";
import { BodyStyle, CarFilters, Drivetrain, Powertrain } from "../../types/cars";
import { BODY_STYLE_LABELS, DRIVETRAIN_LABELS, POWERTRAIN_LABELS, formatPrice } from "../../constants/cars";
import {
  BG_ACCENT,
  BG_BASE,
  BG_ELEVATED,
  BG_HOVER,
  BORDER,
  BORDER_HOVER,
  FONT_XS,
  FONT_XXS,
  RADIUS_MD,
  RADIUS_SM,
  TEXT_ACCENT,
  TEXT_BRIGHT,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "../../styles/tokens";

export interface FilterState {
  maxPrice: string; // raw input value; empty = no cap
  bodyStyles: BodyStyle[];
  powertrains: Powertrain[];
  drivetrains: Drivetrain[];
  manualOnly: boolean;
}

interface FilterPanelProps {
  options: CarFilters;
  state: FilterState;
  onChange: (state: FilterState) => void;
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

// Hard filters: anything selected here excludes cars outright before scoring.
// Empty selections mean "no constraint". Options come from the live catalog.
const FilterPanel: React.FC<FilterPanelProps> = ({ options, state, onChange }) => (
  <Panel>
    <Group>
      <GroupLabel htmlFor="max-price">Max price</GroupLabel>
      <PriceInput
        id="max-price"
        type="number"
        inputMode="numeric"
        min={0}
        placeholder={`No cap (catalog ${formatPrice(options.priceRange.min)} – ${formatPrice(options.priceRange.max)})`}
        value={state.maxPrice}
        onChange={(e) => onChange({ ...state, maxPrice: e.target.value })}
      />
    </Group>

    <Group>
      <GroupLabel as="span">Body style</GroupLabel>
      <ChipRow>
        {options.bodyStyles.map((style) => (
          <Chip
            key={style}
            type="button"
            $selected={state.bodyStyles.includes(style)}
            aria-pressed={state.bodyStyles.includes(style)}
            onClick={() => onChange({ ...state, bodyStyles: toggle(state.bodyStyles, style) })}
          >
            {BODY_STYLE_LABELS[style]}
          </Chip>
        ))}
      </ChipRow>
    </Group>

    <Group>
      <GroupLabel as="span">Powertrain</GroupLabel>
      <ChipRow>
        {options.powertrains.map((powertrain) => (
          <Chip
            key={powertrain}
            type="button"
            $selected={state.powertrains.includes(powertrain)}
            aria-pressed={state.powertrains.includes(powertrain)}
            onClick={() => onChange({ ...state, powertrains: toggle(state.powertrains, powertrain) })}
          >
            {POWERTRAIN_LABELS[powertrain]}
          </Chip>
        ))}
      </ChipRow>
    </Group>

    <Group>
      <GroupLabel as="span">Drivetrain</GroupLabel>
      <ChipRow>
        {options.drivetrains.map((drivetrain) => (
          <Chip
            key={drivetrain}
            type="button"
            $selected={state.drivetrains.includes(drivetrain)}
            aria-pressed={state.drivetrains.includes(drivetrain)}
            onClick={() => onChange({ ...state, drivetrains: toggle(state.drivetrains, drivetrain) })}
          >
            {DRIVETRAIN_LABELS[drivetrain]}
          </Chip>
        ))}
      </ChipRow>
    </Group>

    <ManualToggle>
      <input
        type="checkbox"
        checked={state.manualOnly}
        onChange={(e) => onChange({ ...state, manualOnly: e.target.checked })}
      />
      Manual transmission available
    </ManualToggle>
  </Panel>
);

const Panel = styled.div`
  background: ${BG_ELEVATED};
  border: 1px solid ${BORDER};
  border-radius: ${RADIUS_MD};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const GroupLabel = styled.label`
  font-size: ${FONT_XXS};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${TEXT_BRIGHT};
  font-weight: 600;
`;

const PriceInput = styled.input`
  background: ${BG_BASE};
  border: 1px solid ${BORDER};
  border-radius: ${RADIUS_SM};
  color: ${TEXT_PRIMARY};
  font-size: ${FONT_XS};
  padding: 8px 10px;
  width: 100%;

  &::placeholder {
    color: ${TEXT_SECONDARY};
  }

  &:focus {
    outline: none;
    border-color: ${BORDER_HOVER};
  }
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button<{ $selected: boolean }>`
  font-size: ${FONT_XXS};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ $selected }) => ($selected ? TEXT_ACCENT : TEXT_PRIMARY)};
  background: ${({ $selected }) => ($selected ? BG_ACCENT : BG_ELEVATED)};
  border: 1px solid ${({ $selected }) => ($selected ? BORDER_HOVER : BORDER)};
  border-radius: ${RADIUS_SM};
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background: ${({ $selected }) => ($selected ? BG_ACCENT : BG_HOVER)};
  }

  &:focus-visible {
    outline: 2px solid ${BORDER_HOVER};
    outline-offset: 2px;
  }
`;

const ManualToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${FONT_XS};
  color: ${TEXT_PRIMARY};
  cursor: pointer;

  input {
    accent-color: ${BORDER_HOVER};
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
`;

export default FilterPanel;
