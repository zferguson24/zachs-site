// DTO types for the Matchbox car-matching API (/api/cars/*).
// Mirrors the contract in docs/car-selection-design.md §6.

export type BodyStyle = "SPORTS_CAR" | "CAR" | "WAGON" | "SUV" | "PICKUP" | "MINIVAN" | "VAN";

export type Powertrain = "GAS" | "DIESEL" | "HYBRID" | "PLUGIN_HYBRID" | "ELECTRIC";

export type Drivetrain = "FWD" | "RWD" | "AWD" | "FOUR_WD";

export type MatchAxis = "PERFORMANCE" | "EFFICIENCY" | "SIZE";

export interface CarFilters {
  bodyStyles: BodyStyle[];
  powertrains: Powertrain[];
  drivetrains: Drivetrain[];
  priceRange: { min: number; max: number };
  catalogSize: number;
}

export interface CarMatchRequest {
  maxPrice?: number;
  bodyStyles?: BodyStyle[];
  powertrains?: Powertrain[];
  drivetrains?: Drivetrain[];
  manualOnly?: boolean;
  performanceImportance?: number;
  efficiencyImportance?: number;
  sizeImportance?: number;
  sizeTarget?: number;
}

export interface CarVehicle {
  id: number;
  make: string;
  model: string;
  modelYear: number;
  bodyStyle: BodyStyle;
  powertrain: Powertrain;
  drivetrain: Drivetrain | null;
  horsepower: number | null;
  combinedMpge: number;
  displacementL: number | null;
  cylinders: number | null;
  hasManual: boolean;
  evRangeMi: number | null;
  annualFuelCost: number | null;
  epaSizeClass: string;
  msrp: number;
  msrpIsEstimate: boolean;
  imageKey: string | null;
  flavorText: string | null;
}

export interface AxisScore {
  axis: MatchAxis;
  importance: number;
  vehicleScore: number;
  axisValue: number;
  target: number | null;
}

export interface MatchResult {
  rank: number;
  winner: boolean;
  matchScore: number;
  axes: AxisScore[];
  vehicle: CarVehicle;
}

export interface CarMatchResponse {
  requestId: number;
  poolSize: number;
  catalogSize: number;
  catalogVersion: string;
  results: MatchResult[];
}
