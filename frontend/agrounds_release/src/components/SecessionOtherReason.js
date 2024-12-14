import React, { useState } from 'react';
import styled from 'styled-components';
import BackTitle_Btn from './BackTitle_Btn';
import Circle_common_btn from './Circle_common_btn';

const SecessionOtherReason = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      console.log('Submitted Reason:', inputValue);
     
    } else {
      alert('내용을 입력해주세요.');
    }
  };

  return (
    <SecessionOtherReasonStyle>
      <BackTitle_Btn navTitle='서비스 탈퇴' />
      <div className='reasontitle'>탈퇴하시려는 이유를 <br/>자유롭게 작성해주세요</div>
      <div className='reasonwritebox'>
      <textarea
          placeholder='내용을 입력해주세요.'
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      <div className='btn'>
        {inputValue ? <Circle_common_btn title='다음' onClick={handleSubmit}/> : <Circle_common_btn title='다음' backgroundColor='#F4F4F4' color='#C6C6C6'/>}
      </div>
    </SecessionOtherReasonStyle>
  );
};

export default SecessionOtherReason;

const SecessionOtherReasonStyle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .reasontitle{
    font-size: 2.5vh;
    font-weight: 700;
    width: 90%;
    margin-top: 5vh;
  }
  .reasonwritebox{
    width: 90%;
    height: 25vh;
    margin-top: 5vh;
    background-color: #F2F4F8;
    border-radius: 2vh;
    display: flex;
    justify-content: center;
    align-items: center;
    & > textarea{
      width: 90%;
      height: 20vh;
      background-color: #F2F4F8;
      border: none;
      outline: none;
      display: flex;
      justify-content: start;
      align-items: start;
      font-size: 1.6vh;
      font-weight: 600;
      text-align: start;
      color: #333333;
      &:placeholder-shown{
        font-size: 1.6vh;
        font-weight: 600;
        color: #C1C7CD;
      }
    }
  }
  .btn{
    position: absolute;
    bottom: 6vh;
    width: 100%;
  }
`