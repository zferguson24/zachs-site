import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  from { opacity: 0; transform: translate(-50%, 10px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
`;

const Container = styled.div`
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #2d1010;
  border: 1px solid #7a2020;
  color: #f0aaaa;
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 14px;
  max-width: 520px;
  width: max-content;
  text-align: center;
  z-index: 1000;
  cursor: pointer;
  animation: ${slideUp} 0.2s ease;
`;

interface ToastProps {
  message: string;
  onDismiss: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onDismiss, duration = 4000 }) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [message, onDismiss, duration]);

  return <Container onClick={onDismiss}>{message}</Container>;
};

export default Toast;
