import React from 'react';
import './Main_Subject.scss';
import blackarrow from '../assets/left.png';
import whitearrow from '../assets/left-white.png';

const Main_Subject = ({title, BG, color, children}) => {
  return (
    <div className='subject' style={{backgroundColor: BG, color:color}}>
      {title='' ? null : 
        <div className='titlebox'>
          <p className='title'>{title}</p>
          { color='#FFFFFF' ? 
          <img className='rightarrow' src={whitearrow} /> : 
          <img className='rightarrow' src={blackarrow} /> }
        </div>
      }
      {children}
    </div>
  );
};

export default Main_Subject;