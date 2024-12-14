import React from 'react';
import './BasicInfo.scss';
import AgeConversion from '../function/AgeConversion';

const BasicInfo = () => {
  const gender = () => {
    return sessionStorage.getItem('userGender') === 'male' ? '남자' : '여자';
  }
  console.log(sessionStorage.getItem('userWeight'))
  return (
    <div className='basicinfo'>
      <div className='titlebox'>
        <p className='basicinfotitle'>기본정보</p>
        <p className='basicfix'>수정하기</p>
      </div>
      <div className='basiccontentsbox'>
        <p className='contenttitle'>성별</p>
        <p className='contentinfo'>{gender()}</p>
      </div>
      <div className='basiccontentsbox'>
        <p className='contenttitle'>나이</p>
        <p className='contentinfo'>{AgeConversion(sessionStorage.getItem('userBirth'))}</p>
      </div>
      <div className='basiccontentsbox'>
        <p className='contenttitle'>키</p>
        <p className='contentinfo'>{sessionStorage.getItem('userHeight')}</p>
      </div>
      <div className='basiccontentsbox'>
        <p className='contenttitle'>몸무게</p>
        <p className='contentinfo'>{sessionStorage.getItem('userWeight')}</p>
      </div>
      <div className='basiccontentsbox'>
        <p className='contenttitle'>선호포지션</p>
        <p className='contentinfo'>{sessionStorage.getItem('userPosition')}</p>
      </div>
      
    </div>
  );
};

export default BasicInfo;