import React from 'react';
import Back_btn from '../../../../components/Back_btn';
import service1 from '../../../../assets/term/marketing-term.png';
import styled from 'styled-components';

const GpsTerms = () => {
  return (
    <GpsTermsStyle>
      <Back_btn />
      <div className='content'>
        <img src={service1} className='img'/>
      </div>
    </GpsTermsStyle>
  );
};

export default GpsTerms;

const GpsTermsStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  .content{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: -5vh;
    .img{
      width: 95%;
    }
  }
`