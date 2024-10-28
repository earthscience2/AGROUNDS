import React from 'react';
import styled from 'styled-components';

const Circle_common_btn = ({title, onClick, backgroundColor = '#262626', color = 'white'}) => {
  return (
    <div style={{display:'flex',justifyContent:'center', width: '100vw'}}>
      <div style={{backgroundColor: backgroundColor, display:'flex', alignItems: 'center' ,justifyContent: 'center', width: '90%', height: '60px', color: color, borderRadius:'4vh', fontWeight:'500'}} onClick={onClick}>
            {title}
      </div>
    </div>
  );
};

export default Circle_common_btn;

