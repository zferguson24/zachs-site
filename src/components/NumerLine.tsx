import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

interface NumberLineProps {
  divisions: number;
  index: number;
  leftLabel: string;
  rightLabel: string;
  setAttribute: (index: number, value: number) => void;
}

const NumberLine: React.FC<NumberLineProps> = ({
  divisions,
  index,
  leftLabel,
  rightLabel,
  setAttribute,
}) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [direction, setDirection] = useState<"right" | "left">("right");
  const numberLineRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const markers = Array.from({ length: divisions }, (_, i) => i);

  const handleMouseMove = (e: MouseEvent) => {
    setHasInteracted(true);

    if (numberLineRef.current) {
      const rect: DOMRect = numberLineRef.current.getBoundingClientRect();
      const x: number = e.clientX - rect.left;
      const markerWidth: number = rect.width / (divisions - 1);
      const closestMarker: number = Math.round(x / markerWidth);
      setSliderPosition(Math.max(0, Math.min(divisions - 1, closestMarker)));
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = () => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    setHasInteracted(true);

    if (e.key === "Enter") {
      if (direction === "right") {
        if (sliderPosition < divisions - 1) {
          setSliderPosition(sliderPosition + 1);
        } else {
          setDirection("left");
          setSliderPosition(sliderPosition - 1);
        }
      } else {
        if (sliderPosition > 0) {
          setSliderPosition(sliderPosition - 1);
        } else {
          setDirection("right");
          setSliderPosition(sliderPosition + 1);
        }
      }
    } else if (e.key === "ArrowRight") {
      if (sliderPosition < divisions - 1) {
        setSliderPosition(sliderPosition + 1);
      }
    } else if (e.key === "ArrowLeft") {
      if (sliderPosition > 0) {
        setSliderPosition(sliderPosition - 1);
      }
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (hasInteracted) {
      // Update shared attribute list only when slider is moved to new position.
      setAttribute(index, sliderPosition);
    }
  }, [sliderPosition, hasInteracted]);

  return (
    <StyledNumberLineWrapper>
      <div className="number-line-container">
        <div className="arrow left-arrow"></div>
        <div className="number-line" ref={numberLineRef}>
          {markers.map((_, index) => (
            <div key={index} className="marker"></div>
          ))}
          <div
            className="slider"
            style={{ left: `${(sliderPosition / (divisions - 1)) * 100}%` }}
            onMouseDown={handleMouseDown}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            ref={sliderRef}
          ></div>
        </div>
        <div className="arrow right-arrow"></div>
      </div>
      <div className="line-label">
        <div>{leftLabel}</div>
        <div>{rightLabel}</div>
      </div>
    </StyledNumberLineWrapper>
  );
};

const StyledNumberLineWrapper = styled.div`
  .number-line-container {
    padding-top: 64px;
    display: flex;
    align-items: center;
    width: 100%;
  }

  .arrow {
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
  }

  .left-arrow {
    display: flex;
    border-right: 20px solid black;
    margin-bottom: 2px;
    margin-right: -2px;
  }

  .right-arrow {
    display: flex;
    border-left: 20px solid black;
    margin-bottom: 2px;
    margin-left: -2px;
  }

  .number-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
    border-top: 2px solid black;
    position: relative;
    margin-top: 2px;
  }

  .marker {
    width: 2px;
    height: 10px;
    background-color: black;
    margin-top: -6px;
  }

  .slider {
    width: 11px;
    height: 22px;
    background-color: gray;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -60%);
    cursor: pointer;
    outline: none;
    display: flex;
  }

  .slider:focus {
    box-shadow: 0 0 0 3px rgba(125, 225, 255, 0.5);
  }

  .line-label {
    display: flex;
    justify-content: space-between;
    padding-top: 8px;
    color: black;
    user-select: none;
  }
`;

export default NumberLine;
