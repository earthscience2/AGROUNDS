import React from 'react';
import Nav from '../../components/display/Nav';
import F1 from '../../assets/display/firstPage/F1.png';
import styled from 'styled-components';
import RightBtn from '../../components/display/RightBtn';
import F2 from '../../assets/display/firstPage/F2.png';
import F3 from '../../assets/display/firstPage/F3.png';
import F4 from '../../assets/display/firstPage/F4.png';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <MainpageStyle>
      <Nav />
      <img src={F1} className='f1'/>
      <div className='btnC'>
        <RightBtn children='제품소개' onClick={() => navigate('/display/product')}/>
      </div>
      <img src={F2} className='f2' />
      <div className='f2Btn'>
        <RightBtn children='확인하기' bgColor="#333333"/>
      </div>
      <div className='F3Div'>
        <img src={F3} className='f3' />
        <div className='f3Btn'>
          <RightBtn children='회사소개' bgColor="#055540" onClick={() => navigate('/display/aboutus')}/>
        </div>
      </div>
      <div className='F4Div'>
        <img src={F4} className='f4' />
        <div className='f4Btn'>
          <RightBtn children='팀원소개' bgColor="#A97F7F" onClick={() => navigate('/display/product')}/>
        </div>
      </div>
    </MainpageStyle>
  );
};

export default MainPage;

const MainpageStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  .f1{
    margin-top: 5vh;
  }
  .btnC{
    display: flex;
    justify-content: center;
    align-items:center;
    height: 10vh;
  }
  .f2Btn{
    display: flex;
    justify-content: center;
    align-items:center;
    position: relative;
    bottom: 5vh;
  }
  .F3Div{
    height: 10vh;
    padding: 3vh 3vh;
    display: flex;
    justify-content: center;
    align-items: end;
    border-bottom: .15vh solid #055540;
    margin: 0;
    .f3{
      height: 9vh;
    }
  }
  .F4Div{
    height: 10vh;
    padding: 3vh 3vh;
    display: flex;
    justify-content: center;
    align-items: end;
    border-bottom: .15vh solid #A97F7F;
    margin: 0;
    .f4{
      height: 9vh;
    }
  }
`