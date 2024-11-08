import React from 'react';
import X from '../assets/x.png';

const Exit_btn = () => {
  return (
    <div style={{backgroundColor:'rgba(1,1,1,0.2)', width: '50px', height: '50px', border: '1px solid #6F6F6F', borderRadius: '50%', display: 'flex', justifyContent:'center', alignItems:'center'}}>
      <img src={X} style={{width: '25px'}}/>
    </div>
  );
};

export default Exit_btn;