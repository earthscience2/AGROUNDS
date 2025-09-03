import React from 'react';

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
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', ...style }}>
      <div
        style={{
          fontFamily: 'Pretendard',
          backgroundColor: backgroundColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: width,
          height: height,
          color: color,
          borderRadius: radius,
          fontWeight: fontWeight,
          fontSize: fontSize,
        }}
        onClick={onClick}
      >
        {title}
      </div>
    </div>
  );
};

export default Circle_common_btn;

