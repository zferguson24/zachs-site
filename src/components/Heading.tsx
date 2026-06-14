import React from "react";
import styled from "styled-components";

type HeaderProps = {
  title: string;
};

const Heading: React.FC<HeaderProps> = ({ title }) => {
  return <Header>{title}</Header>;
};

const Header = styled.h2`
  text-align: left;
  font-size: 36px;
  margin: 0px;
  color: black;
`;

export default Heading;
