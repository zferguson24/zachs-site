import { createContext, useContext, useState } from "react";
import { vehicles } from "../assets/VehicleConstants";
import { VehicleProps } from "../types/VehicleTypes";

type CarSelectionContextType = {
  attributeArray: number[];
  setAttributeArray: React.Dispatch<React.SetStateAction<number[]>>;
  updateAttributeAtIndex: (index: number, value: number) => void;
  findClosestVehicleByAttributeArray: () => VehicleProps;
};

const CarSelectionContext = createContext<CarSelectionContextType | undefined>(
  undefined
);

export const CarSelectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [attributeArray, setAttributeArray] = useState<number[]>([]);

  // Dynamically update the array at index with given value to account for any number of attribute selectors.
  const updateAttributeAtIndex = (index: number, value: number) => {
    setAttributeArray((prev) => {
      const newArray = [...prev];
      newArray[index] = value;
      // Initialize new values to 0.
      const sanitizedArray = newArray.map((val) =>
        val === undefined ? 0 : val
      );
      return sanitizedArray;
    });
  };

  // Returns the total difference of the absolute value of each element of two equally sized arrays.
  const totalDifference = (vehicleArray: number[]): number => {
    // Check length equality.
    if (attributeArray.length !== vehicleArray.length) {
      throw new Error("Arrays must be of equal length.");
    }

    let total = 0;

    for (let i = 0; i < attributeArray.length; i++) {
      total += Math.abs(attributeArray[i] - vehicleArray[i]);
    }

    return total;
  };

  // Returns the vehicle element with the closest AttributeArray to the array chosen by the user.
  const findClosestVehicleByAttributeArray = (): VehicleProps => {
    let minDifferenceIndex = 0;
    // Set baseline difference based on first index.
    let minDifference = totalDifference(
      vehicles[minDifferenceIndex].intrinsicAttributeArray
    );

    console.log(
      `Difference for vehicle ${vehicles[minDifferenceIndex].make} ${vehicles[minDifferenceIndex].model}: `,
      minDifference
    );

    for (let i = 1; i < vehicles.length; i++) {
      const difference = totalDifference(vehicles[i].intrinsicAttributeArray);

      console.log(
        `Difference for vehicle ${vehicles[i].make} ${vehicles[i].model}: `,
        difference
      );

      if (difference === 0) {
        minDifference = difference;
        break;
      }

      if (difference < minDifference) {
        minDifference = difference;
        minDifferenceIndex = i;
      }
    }

    console.log(vehicles[minDifferenceIndex]);

    return vehicles[minDifferenceIndex];
  };

  return (
    <CarSelectionContext.Provider
      value={{
        attributeArray,
        updateAttributeAtIndex,
        setAttributeArray,
        findClosestVehicleByAttributeArray,
      }}
    >
      {children}
    </CarSelectionContext.Provider>
  );
};

export const useCarSelectionService = () => {
  const context = useContext(CarSelectionContext);
  if (!context) {
    throw new Error(
      "useCarSelectionService must be used within a CarSelectionProvider"
    );
  }
  return context;
};
