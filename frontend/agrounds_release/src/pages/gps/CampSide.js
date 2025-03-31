import React, { useState } from 'react';
import BackTitle_Btn from '../../components/BackTitle_Btn';
import Login_title from '../../components/Login_title';
import ground from '../../assets/illust_ground.png';
import styled from 'styled-components';
import Circle_common_btn from '../../components/Circle_common_btn';
import greyCheck from '../../assets/grey-check.png';
import greenCheck from '../../assets/green-check.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFieldContext } from '../../function/Context';

const CampSide = () => {
  const [checkSide, setCheckSide] = useState('');

  const checkLeftBtn = () => setCheckSide('left');
  const checkRightBtn = () => setCheckSide('right');

  const { updateFieldData, fieldData } = useFieldContext();
  const location = useLocation();
  const navigate = useNavigate();

  const quarter = location.state?.quarter;

  const handleComplete = () => {
    const quarterIndex = quarter - 1;
    if (isNaN(quarterIndex)) {
      console.error('쿼터 인덱스가 잘못됨:', quarter);
      return;
    }
    const updated = [...fieldData.quarter_info];
    updated[quarterIndex] = {
      ...updated[quarterIndex],
      home: checkSide,
    };
    updateFieldData({ quarter_info: updated });
    navigate('/app/set-quarter-side');

  };
  console.log(checkSide);
  return (
    <CampSideStyle>
      <BackTitle_Btn navTitle={`${quarter}쿼터`} />
      <Login_title title='홈 진영 선택하기' explain='왼쪽 혹은 오른쪽을 선택해주세요.' />
      <div className='selectbox'>
        <img src={ground} />
        {checkSide === 'left' ? (
          <div className='leftbox' onClick={checkLeftBtn}>
            <div className='checkbox'>
              <img className='checkicon' src={greenCheck} />
            </div>
            <p className='checktext'>왼쪽</p>
          </div>
        ) : (
          <div className='leftbox' onClick={checkLeftBtn} style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className='checkbox' style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
              <img className='checkicon' src={greyCheck} />
            </div>
            <p className='checktext'>왼쪽</p>
          </div>
        )}
        {checkSide === 'right' ? (
          <div className='leftbox' onClick={checkRightBtn}>
            <div className='checkbox'>
              <img className='checkicon' src={greenCheck} />
            </div>
            <p className='checktext'>오른쪽</p>
          </div>
        ) : (
          <div className='leftbox' onClick={checkRightBtn} style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className='checkbox' style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
              <img className='checkicon' src={greyCheck} />
            </div>
            <p className='checktext' style={{ color: 'white', opacity: '0.7' }}>오른쪽</p>
          </div>
        )}
      </div>
      <div className='rest'>휴식공간</div>
      <div className='btn'>
        {checkSide ? (
          <Circle_common_btn title='완료' onClick={handleComplete} />
        ) : (
          <Circle_common_btn title='완료' backgroundColor='#F4F4F4' color='#A8A8A8' />
        )}
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

  .rest {
    width: 90%;
    height: 5vh;
    text-align: center;
    background-color: #f2f4f8;
    border-radius: 1.5vh;
    margin-top: 2vh;
    line-height: 2.4;
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 2vh;
    color: #878d96;
  }

  .btn {
    width: 100%;
    position: fixed;
    bottom: 10vh;
  }

  .selectbox {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 5vh;

    & > img {
      width: 90%;
      height: 28vh;
      position: absolute;
    }

    .leftbox {
      position: relative;
      width: 45%;
      height: 28vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .checkbox {
        background-color: white;
        width: 5vh;
        height: 5vh;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 200;
        border-radius: 50%;
        margin-top: 3vh;

        .checkicon {
          height: 2.7vh;
          position: absolute;
          z-index: 1999;
        }
      }

      .checktext {
        color: white;
        font-family: 'pretendard';
        font-weight: 600;
        font-size: 2vh;
      }
    }
  }
`;
