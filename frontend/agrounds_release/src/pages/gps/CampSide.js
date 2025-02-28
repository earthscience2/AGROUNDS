import React from 'react';
import BackTitle_Btn from '../../components/BackTitle_Btn';
import Login_title from '../../components/Login_title';
import ground from '../../assets/illust_ground.png';
import styled from 'styled-components';
import Circle_common_btn from '../../components/Circle_common_btn';

const CampSide = () => {
  return (
    <CampSideStyle>
      <BackTitle_Btn navTitle='1쿼터'/>
      <Login_title title='홈 진영 선택하기' explain='왼쪽 혹은 오른쪽을 선택해주세요.'/>
      <img src={ground} />
      <div className='rest'>휴식공간</div>
      <div className='btn'>
        <Circle_common_btn title='완료' />
      </div>
    </CampSideStyle>
  );
};

export default CampSide;

const CampSideStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  & > img {
    width: 90%;
  }
  .rest{
    width: 90%;
    height: 5vh;
    text-align: center;
    background-color: #F2F4F8;
    border-radius: 1.5vh;
    margin-top: 2vh;
    line-height: 2.4;
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 2vh;
    color: #878D96;
  }
  .btn{
    width: 100%;
    position: fixed;
    bottom: 5vh;
  }
`