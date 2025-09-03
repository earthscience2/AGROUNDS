import React from 'react';
import man from '../assets/common/man.png';
import woman from '../assets/common/woman.png';
import check from '../assets/common/check.png';
import styled from 'styled-components';

const Gender = ({ gender, isSelected, onClick }) => {
  return (
    <GenderStyle onClick={onClick} style={{ cursor: 'pointer' }}>
    <img className='gendericon' src={gender === 'male' ? man : woman} alt={gender} />
    <p className='gendertext'>{gender === 'male' ? '남자' : '여자'}</p>
    <div className='circle' style={{ backgroundColor: isSelected ? '#00B268' : 'rgba(229,233,236)' }}>
      <img className='gendercheck' src={check} alt='check' />
    </div>
  </GenderStyle>
  );
};

export default Gender;

const GenderStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #F7F8FA;
  width: 19vh;
  height: 19vh;
  border-radius: 12px;
  cursor: pointer;
  .gendericon{
    height: 34px;
  }
  .gendertext{
    color: #697077;
  }
  .circle{
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: rgba(229,233,236);
    display: flex;
    justify-content: center;
    align-items: center;
    .gendercheck{
      height: 15px;
    }
  }

`