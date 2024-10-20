import React from 'react';
import './Login_title.scss';

const Login_title = ({ title, explain }) => {
  return (
    <div className='titlebox'>
      <p className='login_title'>{title}</p>
      <p className='login_explain'>{explain}</p>
    </div>
  );
};

export default Login_title;
