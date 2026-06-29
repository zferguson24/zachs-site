import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Page, ButtonSection, NavButton } from "./Landing.styles";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <ButtonSection>
        <NavButton onClick={() => navigate(ROUTES.CAR_SELECTION)}>Car Selection ⟶</NavButton>
        <NavButton onClick={() => navigate(ROUTES.TIMEWALKING)}>Timewalking Gear Selection ⟶</NavButton>
      </ButtonSection>
    </Page>
  );
};

export default Landing;
