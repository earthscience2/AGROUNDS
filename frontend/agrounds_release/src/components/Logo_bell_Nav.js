import React from 'react';
import Logo from '../assets/Agrounds_logo.png';
import bell from '../assets/bell.png';
import './LogoBellNav.scss';

const LogoBellNav = ({logo}) => {
  return (
    <div className='logobell'>
      {logo ? <><img src={Logo} className='logo'/><img src={bell} className='bell'/></>
      :
      <>
      <div></div>
      <img src={bell} className='bell'/>
      </>
      }
    </div>
  );
};

export default LogoBellNav;