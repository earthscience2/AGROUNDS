import React from 'react';
import X from '../assets/x.png';
import { useNavigate } from 'react-router-dom';

const Exit_btn = ({exit}) => {
  const navigate = useNavigate();
  return (
    <div style={{backgroundColor:'rgba(1,1,1,0.4)', width: '50px', height: '50px', border: '1px solid #6F6F6F', borderRadius: '50%', display: 'flex', justifyContent:'center', alignItems:'center'}} onClick={exit}>
      <img src={X} style={{width: '25px'}}/>
    </div>
  );
};

export default Exit_btn;