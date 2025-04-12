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
  const [chosenVehicle, setChosenVehicle] = useState<VehicleProps | null>(null);

  const {
    updateAttributeAtIndex,
    setAttributeArray,
    findClosestVehicleByAttributeArray,
  } = useCarSelectionService();
  const { sliderHeading, sliderLabels } = CONSTANTS.carSelection;
  const sliders = Object.entries(sliderLabels);

  const handleAttributeUpdate = (index: number, value: number): void => {
    // Reset chosen vehicle when sliders are interacted with again.
    if (!!chosenVehicle) {
      setChosenVehicle(null);
    }

    updateAttributeAtIndex(index, value);
  };

  // Render the vehicle from the result of the selection algorithm.
  const updateChosenVehicle = (): void => {
    setChosenVehicle(findClosestVehicleByAttributeArray());
  };

  useEffect(() => {
    // Initialize attribute selection array based on number of sliders from constants.
    setAttributeArray(new Array(sliders.length).fill(0));
  }, []);

  return (
    <>
      <Card disableInitialScroll={true}>
        <Heading title={sliderHeading}></Heading>
        {sliders.map(([key, [left, right]], index) => (
          <NumberLine
            key={key}
            index={index}
            ticks={10}
            leftLabel={left}
            rightLabel={right}
            setAttribute={handleAttributeUpdate}
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
