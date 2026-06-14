import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Page = styled.div`
  min-height: 100vh;
  background-color: #1e2a38;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #e8f0f8;
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
`;

const NavButton = styled.button`
  width: 33vw;
  padding: 18px 28px;
  font-size: 18px;
  font-family: inherit;
  color: #c8ddf0;
  background: rgba(15, 30, 55, 0.75);
  border: 1.5px solid #3a6ca0;
  border-radius: 10px;
  cursor: pointer;
  letter-spacing: 0.5px;
  text-align: left;
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgba(30, 65, 115, 0.85);
    border-color: #6aaef5;
    box-shadow: 0 0 18px rgba(80, 140, 230, 0.3);
    color: #ffffff;
  }

  @media (max-width: 992px) {
    width: 80vw;
    font-size: 16px;
  }
`;

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <ButtonSection>
        <NavButton onClick={() => navigate("/car-selection")}>
          Car Selection ⟶
        </NavButton>
        <NavButton onClick={() => navigate("/timewalking")}>
          Timewalking Gear Selection ⟶
        </NavButton>
      </ButtonSection>
    </Page>
  );
};

export default Landing;
