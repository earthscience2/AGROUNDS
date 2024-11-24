import React from 'react';
import './Main_Subject.scss';
import blackarrow from '../assets/left.png';
import whitearrow from '../assets/left-white.png';

const Main_Subject = ({title, BG, color, children, arrow, arrowC, onClick}) => {
  return (
    <div className='subject' style={{backgroundColor: BG, color:color}} onClick={onClick}>
      {arrow===true ? 
        <div className='titlebox'>
          <p className='title'>{title}</p>
          { arrowC==='black' ? <img className='rightarrow' src={blackarrow} />  : <img className='rightarrow' src={whitearrow} /> }
        </div> : 
        null
      }
      {children}
    </div>
  );
};

export default Main_Subject;