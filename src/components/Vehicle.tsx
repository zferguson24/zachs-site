import React from "react";
import { VehicleProps } from "../types/VehicleTypes";
import styled from "styled-components";

type CustomProps = {
  mobilebreakpoint: string;
};

const Vehicle: React.FC<VehicleProps> = ({
  make,
  model,
  zeroToSixty,
  topSpeed,
  fuelEconomy,
  powertrain,
  bodyStyle,
  sizeClass,
  driveType,
  imageSrc,
}) => {
  return (
    <VehicleWrapper mobilebreakpoint="992px">
      <div className="vehicle-container">
        <div className="image-container">
          <img className="vehicle-image" src={imageSrc} alt={`${make} ${model}`} />
        </div>
        <div className="text-container">
          <h2 className="vehicle-title">{`${make} ${model}`}</h2>
          <div className="vehicle-details">
            <p>
              <strong>0-60 mph:</strong> {zeroToSixty}
            </p>
            <p>
              <strong>Top Speed:</strong> {topSpeed}
            </p>
            <p>
              <strong>Fuel Economy:</strong> City: {fuelEconomy.city} mpg |
              Highway: {fuelEconomy.highway} mpg | Combined:{" "}
              {fuelEconomy.combined} mpg
            </p>
            <p>
              <strong>Powertrain:</strong>{" "}
              {powertrain
                ? `${powertrain.horsepower} hp, ${powertrain.torque} lb-ft torque`
                : "N/A"}
            </p>
            <p>
              <strong>Body Style:</strong> {bodyStyle}
            </p>
            <p>
              <strong>Size Class:</strong> {sizeClass}
            </p>
            <p>
              <strong>Drive Type:</strong> {driveType}
            </p>
          </div>
        </div>
      </div>
    </VehicleWrapper>
  );
};

const VehicleWrapper = styled.div<CustomProps>`
  .vehicle-container {
    display: flex;
    align-items: center;
    gap: 16px;

    @media (max-width: ${(props) => props.mobilebreakpoint}) {
      flex-direction: column;
      align-items: center;
    }
  }

  .image-container {
    flex-shrink: 0;
  }

  .vehicle-image {
    width: 500px;
    height: 500px;
    object-fit: cover;
    border-radius: 8px;

    @media (max-width: ${(props) => props.mobilebreakpoint}) {
      width: 100%;
      height: auto;
    }
  }

  .vehicle-title {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .text-container {
    flex-grow: 1;
    color: black;
  }

  .vehicle-details {
    font-size: 18px;
    line-height: 1.6;
  }
`;

export default Vehicle;
