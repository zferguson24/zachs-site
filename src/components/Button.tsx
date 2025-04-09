import React from "react";
import styled from "styled-components";

interface ButtonProps {
  onClick: () => void;
  label: string;
}

const StyledButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  margin-top: 20px;
  font-size: 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const Button: React.FC<ButtonProps> = ({ onClick, label }) => {
  return <StyledButton onClick={onClick}>{label}</StyledButton>;
};

export default Button;
