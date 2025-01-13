import React from 'react';
import styled from 'styled-components';

const Footer = () => {
  return (
    <FooterStyle>
      <div className='text-box'>
        <div className='button-box'>
          <div>개인정보처리방침</div>
          <div>이용약관</div>
        </div>
        <div className='address'>주소 : 인천광역시 미추홀구 인하로 100, 김현태인하드림센터 203호 <br /> 문의 : slgh@hanmail.net</div>
  
        <div className='copyright'>© 에이그라운즈, All rights reserved</div>
      </div>
      
    </FooterStyle>
  );
};

export default Footer;

const FooterStyle = styled.div`
  width: 100vw;
  height: 30vh;
  border-top: 1px solid #F2F4F8;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  font-family: 'Pretendard-Regular';

  .text-box {
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
    height: 15vh;
    .button-box {
      display: flex;
      flex-wrap: wrap; 
      gap: 20px; 
      align-items: center;
      font-size: 1.8vh;
      font-weight: 700;
      color: #525252;
    }
    @media (max-width: 480px) {
      .button-box {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        font-size: 1.8vh;
        font-weight: 700;
        color: #525252;
      }
      .address {
        margin-top: 2vh;
        font-size: 1.6vh;
        font-weight: 400;
        color: #6F6F6F;
      }

      .copyright {
        margin: 2vh 0 10vh 0;
        font-size: 1.7vh;
        font-weight: 500;
        color: #6F6F6F;
      }
    }

    .address {
      font-size: 1.6vh;
      font-weight: 400;
      color: #6F6F6F;
    }

    .copyright {
      font-size: 1.7vh;
      font-weight: 500;
      color: #6F6F6F;
    }
  }

  @media (max-width: 768px) {
    .text-box {
      width: 90%; 
    }

    .button-box {
      justify-content: flex-start;
      gap: 10px; 
      font-size: 1.6vh; 
    }

    .address, .copyright {
      font-size: 1.5vh; 
    }
  }
  
`;
