import React from 'react';
import styled from 'styled-components'
import Back_btn from '../components/Back_btn';

const ErrorPage = () => {
  return (
      <ErrorPageStyle>
        <Back_btn />
        <p>지원하지 않는 기능입니다.</p>
        
      </ErrorPageStyle>
  );
};

export default ErrorPage;

const ErrorPageStyle = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  align-items: center;
  
  p {
    margin: auto;
    font-size: 2.2vh;
    font-weight: 700;
    font-family: 'Pretendard-Regular';
    margin-top: 25vh;
  }

`