import React from 'react';
import man from '../assets/man.png';
import woman from '../assets/woman.png';
import check from '../assets/check.png';
import './Gender.scss';

const Gender = ({ gender, isSelected, onClick }) => {

  const genderSelect = () => {
    if (gender==='male') {
      return (
        <div className='genderBG'>
          <img className='gendericon' src={man}/>
          <p className='gendertext'>남자</p>
          <div className='circle'><img className='gendercheck' src={check}/></div>
        </div>
      )
    } else {
      return (
        <div className='genderBG'>
          <img className='gendericon' src={woman}/>
          <p className='gendertext'>여자</p>
          <div className='circle'><img className='gendercheck' src={check}/></div>
        </div>
      )
    }
  }
  return (
    <div className='genderBG' onClick={onClick} style={{ cursor: 'pointer' }}>
    <img className='gendericon' src={gender === 'male' ? man : woman} alt={gender} />
    <p className='gendertext'>{gender === 'male' ? '남자' : '여자'}</p>
    <div className='circle' style={{ backgroundColor: isSelected ? '#00B268' : 'rgba(229,233,236)' }}>
      <img className='gendercheck' src={check} alt='check' />
    </div>
  </div>
  );
};

export default Gender;