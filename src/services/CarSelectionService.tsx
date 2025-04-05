import { createContext, useContext, useState } from "react";

type CarSelectionContextType = {
  attributeArray: number[];
  setAttributeArray: React.Dispatch<React.SetStateAction<number[]>>;
  updateAttributeAtIndex: (index: number, value: number) => void;
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
      console.log("Updated selection array: ", sanitizedArray);
      return sanitizedArray;
    });
  };

  return (
    <CarSelectionContext.Provider
      value={{ attributeArray, updateAttributeAtIndex, setAttributeArray }}
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
