import React from 'react';
import styled from 'styled-components';

const Circle_common_btn = ({title}) => {
  return (
    <div style={{display:'flex',justifyContent:'center', width: '100vw'}}>
      <div style={{backgroundColor:'#262626', display:'flex', alignItems: 'center' ,justifyContent: 'center', width: '90%', height: '60px', color: 'white', borderRadius:'4vh', fontWeight:'500'}}>
            {title}
      </div>
    </div>
  );
};

export default Circle_common_btn;

