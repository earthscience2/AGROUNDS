import React from 'react';
import styled from 'styled-components';

const Anal_Detail = ({title, detail}) => {
  return (
    <AnalDetailStyle>
      <p className='title'>{title}</p>
      {detail}
    </AnalDetailStyle>
  );
};

export default Anal_Detail;

const AnalDetailStyle = styled.div`
  width: 90%;
  min-height: 25vh;
  background-color: rgb(242,244,248);
  border-radius: 1.5vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5vh;
  .title{
    font-size: 1.7vh;
    font-weight: 700;
    width: 85%;
    margin: 3vh 0 1vh 0;
  }
`