import React from 'react';
import './Login_input.scss';
import eye from '../assets/eye-off.png';

const Login_input = ({ placeholder, type, borderRadius='15px' }) => {
  return (
    <div className='inputBG' style={{ borderRadius }}>
      <input className='login_input' style={{ borderRadius }} placeholder={placeholder} type={type} />
      {type ==='password' ? <img className='eyestyle' src={eye} />: ''}
    </div>
  );
};

export default Login_input;