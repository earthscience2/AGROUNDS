import React from 'react';
import { useNavigate } from 'react-router-dom';
import kakao from '../assets/kakao.png';

const Rec_common_btn = ({ backgroundColor='#262626', title="시작하기" ,color='white', onClick }) => {
  const navigate = useNavigate();

  return (
    <div style={{display:'flex',justifyContent:'center', width: '100%'}}>
      <div style={{backgroundColor: backgroundColor, display:'flex', alignItems: 'center' ,justifyContent: 'center', width: '100%', height: '50px', color: color, borderRadius:'1.5vh', fontWeight:'600'}} onClick={onClick}>
            <img style={{width: '2vh', marginRight: '2vh'}}src={kakao} />
            {title}
      </div>
  </div>
  );
};

export default Rec_common_btn;