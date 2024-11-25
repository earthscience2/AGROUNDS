import React from 'react';
import styled, {keyframes} from 'styled-components';

const Loading = () => {
  return (
    <LoadingStyle>
      <Spinner></Spinner>
    </LoadingStyle>
  );
};

export default Loading;

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingStyle = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Spinner = styled.div`
  width: 5vh;
  height: 5vh;
  border: 5px solid black; 
  border-top: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%; 
  animation: ${spinAnimation} 1s linear infinite;
`;