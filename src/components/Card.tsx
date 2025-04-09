import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

type CardProps = {
  children: React.ReactNode;
  disableInitialScroll?: boolean;
};

const Card: React.FC<CardProps> = ({ children, disableInitialScroll }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current && !!!disableInitialScroll) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [disableInitialScroll]);

  return (
    <CardContainer>
      <MotionCard
        ref={cardRef}
        initial={{ opacity: 0 }}
        whileInView={{
          x: ["100vw", "0vw"],
          opacity: [0, 1],
        }}
        transition={{
          x: { duration: 1, ease: "easeInOut" },
          opacity: { duration: 1.5, ease: "easeInOut" },
        }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {children}
      </MotionCard>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  overflow-x: hidden;
`;

const MotionCard = styled(motion.div)`
  background-color: #f0f0f0;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin: 16px;
`;

export default Card;
