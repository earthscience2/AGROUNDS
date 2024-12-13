import React from 'react';
import './Input_error_tooltip.scss';

const Input_error_tooltip = ({ text }) => {
  return (
    <div className='tooltipBody'>
        {text}
    </div>
  );
};

export default Input_error_tooltip;
