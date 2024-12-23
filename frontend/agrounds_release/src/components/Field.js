import React from "react";
import styled from "styled-components";
import { PositionCoordinates } from "../function/PositionColor";


const Field = ({ selectedPosition }) => {
  return (
    <FieldContainer>
      {Object.entries(PositionCoordinates).map(([position, coords]) => (
        <Dot
          key={position}
          style={{ top: coords.top, left: coords.left }}
          active={selectedPosition === position}
        />
      ))}
    </FieldContainer>
  );
};

export default Field;

const FieldContainer = styled.div`
  position: relative;
  width: 80%;
  height: 50%;
 
`;

const Dot = styled.div`
  position: absolute;
  width: 7px;
  height: 7px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: background 0.3s ease, width 0.3s ease, height 0.3s ease;

  /* 하얀 점 활성화 스타일 */
  ${({ active }) =>
    active &&
    `
      background: #ffffff;
      width: 8px;
      height: 8px;
  `}
`;