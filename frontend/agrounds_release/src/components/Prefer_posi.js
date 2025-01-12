import React from 'react';
import styled from 'styled-components';

const Prefer_posi = ({ backgroundColor, children, onClick, isDimmed, isSelected }) => {
  return (
    <PreferPosiStyle
      className={`preferPosi ${isDimmed ? 'dimmed' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{backgroundColor, width: '100px',height: '100px', borderRadius: '50%', display:'flex', justifyContent:'center',alignItems:'center', fontWeight:'700'}}

    >
      {children}
    </PreferPosiStyle>
  );
};

export default Prefer_posi;


const PreferPosiStyle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &.dimmed {
    opacity: 0.3; 
  }

  &.selected {
    border: 0px solid #00B268; 
    opacity: 1
  }

`