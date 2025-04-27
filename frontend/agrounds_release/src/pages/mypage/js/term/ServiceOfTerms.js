import React from 'react';
import styled from 'styled-components';
import Back_btn from '../../../../components/Back_btn';
import privacy1 from '../../../../assets/term/service-term1.png';
import privacy2 from '../../../../assets/term/service-term2.png';
import privacy3 from '../../../../assets/term/service-term3.png';
import privacy4 from '../../../../assets/term/service-term4.png';
import privacy5 from '../../../../assets/term/service-term5.png';
import privacy6 from '../../../../assets/term/service-term4.png';
import privacy7 from '../../../../assets/term/service-term5.png';

const ServiceOfTerms = () => {
  return (
    <ServiceOfTermsStyle>
      <Back_btn />
      <div className='content'>
        <img src={privacy1} className='img'/>
        <img src={privacy2} className='img'/>
        <img src={privacy3} className='img'/>
        <img src={privacy4} className='img'/>
        <img src={privacy5} className='img'/>
        <img src={privacy6} className='img'/>
        <img src={privacy7} className='img'/>
      </div>
    </ServiceOfTermsStyle>
  );
};

export default ServiceOfTerms;

const ServiceOfTermsStyle = styled.div`
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