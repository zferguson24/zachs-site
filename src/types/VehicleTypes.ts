export type VehicleProps = {
  make: string;
  model: string;
  zeroToSixty: string;
  topSpeed: string;
  fuelEconomy: FuelEcnomoy;
  // ICE, Hybrid, Electric
  powertrain:
    | (Engine & Transmission)
    | (HybridSystem & Transmission)
    | ElectricSystem;
  bodyStyle: "Sedan" | "Hatchback" | "Coupe" | "Convertible" | "SUV" | "Truck";
  sizeClass: "Subcompact" | "Compact" | "Midsize" | "Full Size";
  driveType: DriveType;
  imageSrc: string;
};

export enum DriveType {
  fwd = "Front Wheel Drive",
  rwd = "Rear Wheel Drive",
  awd = "All Wheel Drive",
  twoByFour = "Two Wheel Drive",
  fourByFour = "Four Wheel Drive",
}

type Power = {
  horsepower: string;
  torque: string;
};

type Engine = Power & {
  displacement: string;
};

type Transmission = {
  gearing: string;
  type: string;
  isManual?: boolean;
};

type Battery = {
  capacity: string;
  range: string;
};

type HybridSystem = Engine & Battery;

type ElectricSystem = Power & Battery;

type FuelEcnomoy = {
  city: string;
  highway: string;
  combined: string;
};
