import { useEffect, useState } from "react";
import Card from "../components/Card";
import Heading from "../components/Heading";
import NumberLine from "../components/NumerLine";
import { CONSTANTS } from "../assets/AppConstants";
import { useCarSelectionService } from "../services/CarSelectionService";
import Vehicle from "../components/Vehicle";
import Button from "../components/Button";
import { VehicleProps } from "../types/VehicleTypes";

const CarSelection: React.FC = () => {
  const [chosenVehicle, setChosenVehicle] = useState<VehicleProps>();

  const {
    updateAttributeAtIndex,
    setAttributeArray,
    findClosestVehicleByAttributeArray,
  } = useCarSelectionService();
  const { sliderHeading, sliderLabels } = CONSTANTS.carSelection;
  const sliders = Object.entries(sliderLabels);

  const updateChosenVehicle = (): void => {
    setChosenVehicle(findClosestVehicleByAttributeArray());
  };

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
        <Button onClick={updateChosenVehicle} label="Submit"></Button>
      </Card>
      {!!chosenVehicle ? (
        <Card>
          <Vehicle {...chosenVehicle} />
        </Card>
      ) : null}
    </>
  );
};

export default CarSelection;
