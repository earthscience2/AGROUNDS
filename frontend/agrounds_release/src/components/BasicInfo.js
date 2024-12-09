import React from 'react';
import './BasicInfo.scss';

const BasicInfo = () => {
  return (
    <div className='basicinfo'>
      <div className='titlebox'>
        <p className='basicinfotitle'>기본정보</p>
        <p className='basicfix'>수정하기</p>
      </div>
      <div className='basiccontentsbox'>
        <p className='contenttitle'>성별</p>
        <p className='contentinfo'>남자</p>
      </div>
      <div className='basiccontentsbox'>
        <p className='contenttitle'>나이</p>
        <p className='contentinfo'>1992.08.08 (32세)</p>
      </div>
      <div className='basiccontentsbox'>
        <p className='contenttitle'>키</p>
        <p className='contentinfo'>183cm</p>
      </div>
      <div className='basiccontentsbox'>
        <p className='contenttitle'>몸무게</p>
        <p className='contentinfo'>78kg</p>
      </div>
      <div className='basiccontentsbox'>
        <p className='contenttitle'>선호포지션</p>
        <p className='contentinfo'>LWF</p>
      </div>
      
    </div>
  );
};

export default BasicInfo;