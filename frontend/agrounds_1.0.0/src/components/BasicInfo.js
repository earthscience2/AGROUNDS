import React from 'react';
import AgeConversion from '../function/AgeConversion';
import { useNavigate } from 'react-router-dom';

const BasicInfo = ({ userInfo }) => {
  const navigate = useNavigate();

  const getGenderText = () => {
    const gender = userInfo?.gender || sessionStorage.getItem('userGender');
    return gender === 'male' ? '남자' : gender === 'female' ? '여자' : '미입력';
  };

  const getAge = () => {
    const birth = userInfo?.birth || sessionStorage.getItem('userBirth');
    return birth ? AgeConversion(birth) : '미입력';
  };

  const getHeight = () => {
    const height = userInfo?.height || sessionStorage.getItem('userHeight');
    return height ? `${height}cm` : '미입력';
  };

  const getWeight = () => {
    const weight = userInfo?.weight || sessionStorage.getItem('userWeight');
    return weight ? `${weight}kg` : '미입력';
  };

  const getPosition = () => {
    return userInfo?.preferred_position || sessionStorage.getItem('userPosition') || '미입력';
  };

  const getActivityArea = () => {
    return userInfo?.activity_area || '미입력';
  };

  const getAiType = () => {
    const aiType = userInfo?.ai_type;
    if (!aiType) return '미입력';
    
    // AI 타입 한글 매핑
    const aiTypeMap = {
      'strict_leader': '엄격한 리더',
      'emotional_support_girl': '여자친구',
      'emotional_support_boy': '남자친구',
      'mentor': '멘토',
      'data_analyst': '데이터 분석가',
      'cheerleader': '응원단장',
      'casual_friend': '친근한 친구'
    };
    
    return aiTypeMap[aiType] || aiType;
  };

  return (
    <div className='basicinfo'>
      <div className='titlebox'>
        <h3 className='basicinfotitle'>기본정보</h3>
        <button className='basicfix' onClick={() => navigate('/app/infofix')}>수정하기</button>
      </div>
      
      <div className='info-grid'>
        <div className='info-item'>
          <span className='info-label'>성별</span>
          <span className='info-value'>{getGenderText()}</span>
        </div>
        
        <div className='info-item'>
          <span className='info-label'>나이</span>
          <span className='info-value'>{getAge()}</span>
        </div>
        
        <div className='info-item'>
          <span className='info-label'>키</span>
          <span className='info-value'>{getHeight()}</span>
        </div>
        
        <div className='info-item'>
          <span className='info-label'>몸무게</span>
          <span className='info-value'>{getWeight()}</span>
        </div>
        
        <div className='info-item'>
          <span className='info-label'>선호포지션</span>
          <span className='info-value'>{getPosition()}</span>
        </div>
        
        <div className='info-item'>
          <span className='info-label'>활동지역</span>
          <span className='info-value'>{getActivityArea()}</span>
        </div>
        
        <div className='info-item'>
          <span className='info-label'>AI 성격</span>
          <span className='info-value'>{getAiType()}</span>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;