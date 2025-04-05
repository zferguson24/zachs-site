import { useEffect } from "react";
import Card from "../components/Card";
import Heading from "../components/Heading";
import NumberLine from "../components/NumerLine";
import { CONSTANTS } from "../assets/AppConstants";
import { useCarSelectionService } from "../services/CarSelectionService";
import Vehicle from "../components/Vehicle";
import { vehicles } from "../assets/VehicleConstants";

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
    <>
      <Card>
        <Heading title={sliderHeading}></Heading>
        {sliders.map(([key, [left, right]], index) => (
          <NumberLine
            key={key}
            index={index}
            ticks={6}
            leftLabel={left}
            rightLabel={right}
            setAttribute={updateAttributeAtIndex}
          />
        ))}
      </Card>
      <Card>
        {vehicles.map((vehicle, index) => (
          <Vehicle key={index} {...vehicle} />
        ))}
      </Card>
    </>
  );
};

export default CarSelection;
