import React from 'react';
import './Prefer_posi.scss';

const Prefer_posi = ({ backgroundColor, children, onClick, isDimmed, isSelected }) => {
  return (
    <div
      className={`preferPosi ${isDimmed ? 'dimmed' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{backgroundColor, width: '100px',height: '100px', borderRadius: '50%', display:'flex', justifyContent:'center',alignItems:'center', fontWeight:'700'}}

    >
      {children}
    </div>
  );
};

export default Prefer_posi;
