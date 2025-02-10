import React from 'react';

const Circle_common_btn = ({title, onClick, backgroundColor = '#262626', color = 'white', style={}}) => {
  return (
    <div style={{display:'flex', justifyContent:'center', width: '100%', ...style}}>
      <div style={{fontFamily: 'Pretendard',backgroundColor:backgroundColor, display:'flex', alignItems: 'center' ,justifyContent: 'center', width: '90%', height: '60px', color: color, borderRadius:'4vh', fontWeight:'600'}} onClick={onClick}>
            {title}
      </div>
    </div>
  );
};

export default Circle_common_btn;

