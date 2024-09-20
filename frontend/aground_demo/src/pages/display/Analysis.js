import React from 'react';
import styled from 'styled-components';
import Nav from '../../components/display/Nav';
import Analimg from '../../assets/display/analysis/analysis.png';
import LeftBtn from '../../components/display/LeftBtn';
import { useNavigate } from 'react-router-dom';

const Analysis = () => {
  const navigate = useNavigate();
  return (
    <AnalysisStyle>
      <Nav arrow='true' />
      <div className='backimg'>
        <img src={Analimg} className='img'/>
        <div className='back'><LeftBtn children='뒤로' onClick={() => navigate(-1)}/></div>
      </div>
      
    </AnalysisStyle>
  );
};

export default Analysis;

const AnalysisStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 768px) {
    .backimg{
      display: flex;
      flex-direction: column;
      align-items: center;
      .img{
        width: 100vw;
        position: relative;
        top: -10vh;
      }
      .back{
        position: relative;
        top: -15vh;
      }
    }
  }
  @media (min-width: 769px) and (max-width: 1280px) {
    .backimg{
      display: flex;
      flex-direction: column;
      align-items: center;
      .img{
        width: 80vw;
        position: relative;
        top: -20vh;
      }
      .back{
        position: relative;
        top: -15vh;
      }
    }
  }
  @media screen and (min-width: 1281px){
    .backimg{
      display: flex;
      flex-direction: column;
      align-items: center;
      .img{
        width: 50vw;
        position: relative;
        top: -10vh;
      }
      .back{
        position: relative;
        top: -15vh;
      }
    }
  }
  
`