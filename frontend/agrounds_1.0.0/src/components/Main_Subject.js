import React from 'react';
import blackarrow from '../assets/common/left.png';
import whitearrow from '../assets/common/left-white.png';
import styled from 'styled-components';

const Main_Subject = ({title, BG, color, children, arrow, arrowC, onClick}) => {
  return (
    <MainSubjectStyle className='subject' style={{backgroundColor: BG, color:color}} onClick={onClick}>
      {arrow===true ? 
        <div className='titlebox'>
          <p className='title'>{title}</p>
          { arrowC==='black' ? <img className='rightarrow' src={blackarrow} />  : <img className='rightarrow' src={whitearrow} /> }
        </div> : 
        null
      }
      {children}
    </MainSubjectStyle>
  );
};

export default Main_Subject;

const MainSubjectStyle = styled.div`
  width: 90%;
  height: 26vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 2vh;
  font-family: var(--font-text);
  .titlebox{
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .title{
      font-size: 1.9vh;
      font-weight: 700;
      margin: 2vh 0 0vh 0;
    }
    .rightarrow{
      height: 2vh;
      rotate: 180deg;
      margin: 2vh 0 0vh 0;
    }
  }

`