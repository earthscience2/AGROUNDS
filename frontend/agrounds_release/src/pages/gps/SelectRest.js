import React, { useState } from 'react';
import styled from 'styled-components';
import Back_btn from '../../components/Back_btn';
import Login_title from '../../components/Login_title';
import ground from '../../assets/illust_ground.png';
import Circle_common_btn from '../../components/Circle_common_btn';

const SelectRest = () => {
  const [checkSide, setCheckSide] = useState('');

  const checkA = () => {
    setCheckSide('A');
  }
  const checkB = () => {
    setCheckSide('B');
  }

  return (
    <SelectRestStyle>
      <div style={{width:'100%'}}>
      <Back_btn />
      </div>
      <Login_title title='휴식공간 선택' explain={'경기장 기준점 설정을 위해 \n 휴식공간 지점을 선택하세요.'}/>
      {
        checkSide === 'A' 
        ? 
        <div className='rest' onClick={checkA} style={{backgroundColor: '#3DA5FF', color: 'white'}}>A</div> 
        : 
        <div className='rest' onClick={checkA}>A</div>
      }
      
      <img src={ground} /> 
      {
        checkSide === 'B'
        ?
        <div className='rest' onClick={checkB} style={{backgroundColor: '#3DA5FF', color: 'white'}}>B</div>
        :
        <div className='rest' onClick={checkB}>B</div>
      }
    
      <div className='btn'>
        {checkSide ? 
          <Circle_common_btn title='다음' onClick={() => console.log(checkSide)}/>
          :
          <Circle_common_btn title='다음' backgroundColor='#F4F4F4' color='#A8A8A8'/>
        }
      </div>
    </SelectRestStyle>
  );
};

export default SelectRest;

const SelectRestStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .btn{
    width: 100%;
    position: fixed;
    bottom: 5vh;
  }
  .rest{
    width: 90%;
    height: 5vh;
    text-align: center;
    background-color: #F2F4F8;
    border-radius: 1.5vh;
    line-height: 2.7;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 1.8vh;
    color: #343A3F;
  }
  img{
    width: 90%;
    margin: 2vh;
  }
`