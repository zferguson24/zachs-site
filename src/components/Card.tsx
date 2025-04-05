import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

type CardProps = {
  children: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <CardContainer>
      <motion.div
        initial={{ x: "100vw", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          x: { duration: 1.5, ease: "easeOut" },
          opacity: { delay: 0.5, duration: 0.5, ease: "easeIn" },
        }}
        className="inner-card"
      >
        {children}
      </motion.div>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  .inner-card {
    background-color: #f0f0f0;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 16px;
    margin: 16px;
  }
`;

export default Card;
