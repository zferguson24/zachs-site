import { createContext, useContext, useState } from "react";
import { vehicles } from "../constants/VehicleConstants";
import { VehicleProps } from "../types/VehicleTypes";

type CarSelectionContextType = {
  attributeArray: number[];
  setAttributeArray: React.Dispatch<React.SetStateAction<number[]>>;
  updateAttributeAtIndex: (index: number, value: number) => void;
  findClosestVehicleByAttributeArray: () => VehicleProps;
};

const CarSelectionContext = createContext<CarSelectionContextType | undefined>(undefined);

export const CarSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [attributeArray, setAttributeArray] = useState<number[]>([]);

  // Dynamically update the array at index with given value to account for any number of attribute selectors.
  const updateAttributeAtIndex = (index: number, value: number) => {
    setAttributeArray((prev) => {
      const newArray = [...prev];
      newArray[index] = value;
      // Initialize new values to 0.
      const sanitizedArray = newArray.map((val) => (val === undefined ? 0 : val));
      return sanitizedArray;
    });
  };

  // Returns the total difference of the absolute value of each element of two equally sized arrays.
  const totalDifference = (vehicleArray: number[]): number => {
    if (attributeArray.length !== vehicleArray.length) {
      throw new Error("Arrays must be of equal length.");
    }

    let total = 0;

    for (let i = 0; i < attributeArray.length; i++) {
      total += Math.abs(attributeArray[i] - vehicleArray[i]);
    }

    return total;
  };

  // Returns a random index of provided array that matches target value.
  const getRandomMatchingIndex = (array: number[], target: number): number => {
    const matchingIndices: number[] = array.reduce((acc, val, idx) => {
      if (val === target) {
        acc.push(idx);
      }
      return acc;
    }, [] as number[]);

    // Skip randomization when only one element.
    if (matchingIndices.length === 1) {
      return matchingIndices[0];
    }

    const randomIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];

    return randomIndex;
  };

  // Returns the vehicle element with the closest AttributeArray to the array chosen by the user.
  const findClosestVehicleByAttributeArray = (): VehicleProps => {
    let minDifference: number = 0;
    const differenceScores: number[] = [];

    for (let i = 0; i < vehicles.length; i++) {
      const difference = totalDifference(vehicles[i].intrinsicAttributeArray);

      console.log(`Difference for vehicle ${vehicles[i].make} ${vehicles[i].model}: `, difference);

      differenceScores.push(difference);
    }

    minDifference = Math.min(...differenceScores);

    // In the case of multiple vehicles with the same overall difference, pick a random one to return.
    return vehicles[getRandomMatchingIndex(differenceScores, minDifference)];
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
    throw new Error("useCarSelectionService must be used within a CarSelectionProvider");
  }
  return context;
};
