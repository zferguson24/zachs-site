import { BodyStyle, Drivetrain, MatchAxis, Powertrain } from "../types/cars";
import accord from "../assets/VehicleImages/accord.png";
import camry from "../assets/VehicleImages/camry.png";
import civic from "../assets/VehicleImages/civic.png";
import corolla from "../assets/VehicleImages/corolla.png";
import crosstrek from "../assets/VehicleImages/crosstrek.png";
import crv from "../assets/VehicleImages/crv.png";
import equinox from "../assets/VehicleImages/equinox.png";
import explorer from "../assets/VehicleImages/explorer.png";
import f150 from "../assets/VehicleImages/f150.png";
import forester from "../assets/VehicleImages/forester.png";
import highlander from "../assets/VehicleImages/highlander.png";
import jgc from "../assets/VehicleImages/jgc.png";
import my from "../assets/VehicleImages/my.png";
import outback from "../assets/VehicleImages/outback.png";
import ram from "../assets/VehicleImages/ram.png";
import rav4 from "../assets/VehicleImages/rav4.png";
import rogue from "../assets/VehicleImages/rogue.png";
import sierra from "../assets/VehicleImages/sierra.png";
import silverado from "../assets/VehicleImages/silverado.png";
import sportage from "../assets/VehicleImages/sportage.png";
import taco from "../assets/VehicleImages/taco.png";
import trax from "../assets/VehicleImages/trax.png";
import tucson from "../assets/VehicleImages/tucson.png";
import tundra from "../assets/VehicleImages/tundra.png";

// Curated vehicle images, keyed by the image_key column in the matchbox
// vehicles table (set via matchbox/data/vehicle_overrides.csv). Vehicles
// without a key render the PlatePlaceholder instead.
export const IMAGE_BY_KEY: Record<string, string> = {
  accord,
  camry,
  civic,
  corolla,
  crosstrek,
  crv,
  equinox,
  explorer,
  f150,
  forester,
  highlander,
  jgc,
  my,
  outback,
  ram,
  rav4,
  rogue,
  sierra,
  silverado,
  sportage,
  taco,
  trax,
  tucson,
  tundra,
};

export const BODY_STYLE_LABELS: Record<BodyStyle, string> = {
  SPORTS_CAR: "Sports Car",
  CAR: "Car",
  WAGON: "Wagon",
  SUV: "SUV",
  PICKUP: "Pickup",
  MINIVAN: "Minivan",
  VAN: "Van",
};

export const POWERTRAIN_LABELS: Record<Powertrain, string> = {
  GAS: "Gas",
  DIESEL: "Diesel",
  HYBRID: "Hybrid",
  PLUGIN_HYBRID: "Plug-in Hybrid",
  ELECTRIC: "Electric",
};

export const DRIVETRAIN_LABELS: Record<Drivetrain, string> = {
  FWD: "FWD",
  RWD: "RWD",
  AWD: "AWD",
  FOUR_WD: "4WD",
};

export const AXIS_LABELS: Record<MatchAxis, string> = {
  PERFORMANCE: "Performance",
  EFFICIENCY: "Efficiency",
  SIZE: "Size",
};

export const formatPrice = (msrp: number): string => `$${msrp.toLocaleString("en-US")}`;
