import React from 'react';
import styled from 'styled-components'
const ErrorPage = () => {
  return (
    <ErrorPageStyle>
      지원하지 않는 기능입니다.
    </ErrorPageStyle>
  );
};

export default ErrorPage;

const ErrorPageStyle = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  font-size: 2vh;
  font-weight: 700;


`