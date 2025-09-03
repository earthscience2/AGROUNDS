import React from 'react';
import styled from 'styled-components';

const Input_error_tooltip = ({ text, style }) => {
  return (
    <InputErrorTooltipStyle style={style}>
        {text}
    </InputErrorTooltipStyle>
  );
};

export default Input_error_tooltip;


const InputErrorTooltipStyle = styled.div`
  color: red;
  font-size: 1.6vh;
`