import type { CarFilters, CarMatchResponse, CarVehicle, MatchResult } from "../../types/cars";

export const carFilters: CarFilters = {
  bodyStyles: ["SPORTS_CAR", "CAR", "WAGON", "SUV", "PICKUP", "MINIVAN", "VAN"],
  powertrains: ["GAS", "DIESEL", "HYBRID", "PLUGIN_HYBRID", "ELECTRIC"],
  drivetrains: ["FWD", "RWD", "AWD", "FOUR_WD"],
  priceRange: { min: 21500, max: 62400 },
  catalogSize: 43,
};

export function makeVehicle(overrides: Partial<CarVehicle>): CarVehicle {
  return {
    id: 1,
    make: "Honda",
    model: "Civic",
    modelYear: 2026,
    bodyStyle: "CAR",
    powertrain: "GAS",
    drivetrain: "FWD",
    horsepower: 180,
    combinedMpge: 33,
    displacementL: 1.5,
    cylinders: 4,
    hasManual: false,
    evRangeMi: null,
    annualFuelCost: 1600,
    epaSizeClass: "Compact Cars",
    msrp: 25400,
    msrpIsEstimate: true,
    imageKey: null,
    flavorText: null,
    ...overrides,
  };
}

const winner: MatchResult = {
  rank: 1,
  winner: true,
  matchScore: 90.0,
  axes: [
    { axis: "EFFICIENCY", importance: 9, vehicleScore: 100.0, axisValue: 100.0, target: null },
    { axis: "SIZE", importance: 4, vehicleScore: 52.0, axisValue: 78.0, target: 3 },
    { axis: "PERFORMANCE", importance: 2, vehicleScore: 69.0, axisValue: 69.0, target: null },
  ],
  vehicle: makeVehicle({
    id: 101,
    make: "Chevrolet",
    model: "Equinox",
    bodyStyle: "SUV",
    powertrain: "ELECTRIC",
    drivetrain: "AWD",
    horsepower: 295,
    combinedMpge: 103,
    displacementL: null,
    cylinders: null,
    evRangeMi: 319,
    epaSizeClass: "Small Sport Utility Vehicle 2WD",
    msrp: 34995,
    imageKey: "equinox",
  }),
};

const runnerUpPrius: MatchResult = {
  rank: 2,
  winner: false,
  matchScore: 82.5,
  axes: winner.axes,
  vehicle: makeVehicle({ id: 102, make: "Toyota", model: "Prius", powertrain: "HYBRID", combinedMpge: 57, msrp: 29000 }),
};

const runnerUpCamry: MatchResult = {
  rank: 3,
  winner: false,
  matchScore: 79.7,
  axes: winner.axes,
  vehicle: makeVehicle({ id: 103, make: "Toyota", model: "Camry", powertrain: "HYBRID", combinedMpge: 46, msrp: 29500 }),
};

export const carMatchResponse: CarMatchResponse = {
  requestId: 42,
  poolSize: 26,
  catalogSize: 43,
  catalogVersion: "2026-07-12T19:30:39Z",
  results: [winner, runnerUpPrius, runnerUpCamry],
};

export const emptyMatchResponse: CarMatchResponse = {
  requestId: 43,
  poolSize: 0,
  catalogSize: 43,
  catalogVersion: "2026-07-12T19:30:39Z",
  results: [],
};
