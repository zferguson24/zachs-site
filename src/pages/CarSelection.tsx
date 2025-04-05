import { useEffect } from "react";
import Card from "../components/Card";
import Heading from "../components/Heading";
import NumberLine from "../components/NumerLine";
import { CONSTANTS } from "../assets/AppConstants";
import { useCarSelectionService } from "../services/CarSelectionService";

const CarSelection: React.FC = () => {
  const { updateAttributeAtIndex, setAttributeArray } =
    useCarSelectionService();
  const { sliderHeading, sliderLabels } = CONSTANTS.carSelection;
  const sliders = Object.entries(sliderLabels);

  useEffect(() => {
    // Initialize attribute selection array based on number of sliders from constants.
    setAttributeArray(new Array(sliders.length).fill(0));
  }, []);

  return (
    <Card>
      <Heading title={sliderHeading}></Heading>
      {sliders.map(([key, [left, right]], index) => (
        <NumberLine
          key={key}
          index={index}
          divisions={6}
          leftLabel={left}
          rightLabel={right}
          setAttribute={updateAttributeAtIndex}
        />
      ))}
    </Card>
  );
};

export default CarSelection;
