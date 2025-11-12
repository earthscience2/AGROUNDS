import React from 'react';
import './Circle_common_btn.css';

const Circle_common_btn = ({
  title,
  onClick,
  backgroundColor = '#262626',
  color = 'white',
  style = {},
  height = '60px',
  radius = '4vh',
  width = '90%',
  fontSize = '1rem',
  fontWeight = '600',
  ariaLabel,
  disabled = false,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', ...style }}>
      <button
        className="circle-common-btn"
        style={{
          backgroundColor: backgroundColor,
          width: width,
          height: height,
          color: color,
          borderRadius: radius,
          fontWeight: fontWeight,
          fontSize: fontSize,
        }}
        onClick={onClick}
        aria-label={ariaLabel || title}
        disabled={disabled}
        type="button"
      >
        {title}
      </button>
    </div>
  );
};

export default Circle_common_btn;

