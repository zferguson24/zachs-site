import React from "react";
import { VehicleProps } from "../types/VehicleTypes";
import styled from "styled-components";

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
    <VehicleWrapper>
      <div className="vehicle-container">
        <div className="image-container">
          <img
            className="vehicle-image"
            src={imageSrc}
            alt={`${make} ${model}`}
          />
        </div>
        <div className="text-container">
          <h2 className="vehicle-title">{`${make} ${model}`}</h2>
          <div className="vehicle-details">
            <p>
              <strong>0-60 mph: </strong>
              {zeroToSixty}
            </p>
            <p>
              <strong>Top Speed: </strong>
              {topSpeed}
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

const VehicleWrapper = styled.div`
  .vehicle-container {
    display: flex;
    align-items: center;
    gap: 16px;

    @media (max-width: 992px) {
      flex-direction: column;
      align-items: center;
    }
  }

  .image-container {
    flex-shrink: 0;
  }

  .vehicle-image {
    width: 450px;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
    margin: 16px;

    @media (max-width: 992px) {
      width: 100%;
      height: 250px;
      margin: 0px;
    }
  }

  .vehicle-title {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 8px;

    @media (max-width: 992px) {
      margin-top: 0px;
    }
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
