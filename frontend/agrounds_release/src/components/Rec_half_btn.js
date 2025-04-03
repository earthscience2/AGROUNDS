import React from 'react';
import { useNavigate } from 'react-router-dom';
import kakao from '../assets/kakao.png';
import apple from '../assets/apple-logo.png'

const Rec_half_btn = ({ backgroundColor='#262626', title="" ,color='white', onClick, src=kakao}) => {
  return (
    <div style={{display:'flex',justifyContent:'center', width: '48%'}}>
      <div style={{backgroundColor: backgroundColor, display:'flex', alignItems: 'center' ,justifyContent: 'center', width: '100%', height: '50px', color: color, borderRadius:'3vh', fontSize: '1rem', fontWeight:'500',fontFamily: 'Pretendard'}} onClick={onClick}>
            <img style={{width: '2vh', marginBottom: src === apple ? '4px' : '0'}} src={src} />
            <div style={{marginLeft: '10px'}}>{title}</div>
      </div>
  </div>
  );
};

export default Rec_half_btn;