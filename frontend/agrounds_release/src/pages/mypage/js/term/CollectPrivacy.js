import React from 'react';
import Back_btn from '../../../../components/Back_btn';
import service1 from '../../../../assets/term/privacy-term1.png';
import service2 from '../../../../assets/term/privacy-term2.png';
import service3 from '../../../../assets/term/privacy-term3.png';
import service4 from '../../../../assets/term/privacy-term4.png';
import service5 from '../../../../assets/term/privacy-term5.png';
import styled from 'styled-components';

const CollectPrivacy = () => {
  return (
    <CollectPrivacyStyle>
      <Back_btn />
      <div className='content'>
        <img src={service1} className='img'/>
        <img src={service2} className='img'/>
        <img src={service3} className='img'/>
        <img src={service4} className='img'/>
        <img src={service5} className='img'/>
      </div>
    </CollectPrivacyStyle>
  );
};

export default CollectPrivacy;

const CollectPrivacyStyle = styled.div`
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