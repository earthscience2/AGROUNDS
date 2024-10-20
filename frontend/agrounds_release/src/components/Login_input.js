import React from 'react';
import './Login_input.scss';

const Login_input = ({ placeholder, type }) => {
  return (
    <div>
      <input className='login_input' placeholder={placeholder} type={type} />
    </div>
  );
};

export default Login_input;