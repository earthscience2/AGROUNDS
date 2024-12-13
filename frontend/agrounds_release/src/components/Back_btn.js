import React from 'react';
import left from '../assets/left.png';
import { useNavigate } from 'react-router-dom';

const Back_btn = () => {
  const navigate = useNavigate();

  return (
    <div style={{ width:'90vw', padding: '6vh 0vh'}}>
      <img src={left} style={{width: '25px'}} onClick={() => navigate(-1)}/>
    </div>
  );
};

export default Back_btn;