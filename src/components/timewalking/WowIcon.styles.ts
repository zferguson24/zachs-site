import styled from "styled-components";

export const IconWrapper = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
`;

export const IconImg = styled.img`
  width: 56px;
  height: 56px;
  display: block;
`;

export const IconBorder = styled.img`
  position: absolute;
  top: -6px;
  left: -6px;
  width: 68px;
  height: 68px;
  pointer-events: none;
`;
