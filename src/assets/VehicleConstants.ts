import { DriveType, VehicleProps } from "../types/VehicleTypes";
import civic from "../assets/VehicleImages/civic.png";

export const vehicles: VehicleProps[] = [
  {
    make: "Honda",
    model: "Civic",
    zeroToSixty: "9.5 seconds",
    topSpeed: "130 mph",
    fuelEconomy: {
      city: "32",
      highway: "42",
      combined: "36",
    },
    powertrain: {
      horsepower: "158",
      torque: "138",
      displacement: "2.0L",
      gearing: "Continuously Variable",
      type: "Automatic",
    },
    bodyStyle: "Sedan",
    sizeClass: "Compact",
    driveType: DriveType.fwd,
    imageSrc: civic,
  },
];
