import React from 'react';
import styled from 'styled-components';

const Input_error_tooltip = ({ text }) => {
  return (
    <InputErrorTooltipStyle>
        {text}
    </InputErrorTooltipStyle>
  );
};

export default Input_error_tooltip;


const InputErrorTooltipStyle = styled.div`
  position: absolute;
  margin-top: -22vh;
  color: red;
  font-size: 1.6vh;

`