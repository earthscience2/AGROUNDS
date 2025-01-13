import React from 'react';
import '../css/TeamSetting.scss';
import BackTitle_Btn from '../../../components/BackTitle_Btn';
import left from '../../../assets/left.png';
import { useNavigate } from 'react-router-dom';

const TeamSetting = () => {
  const navigate = useNavigate();
  return (
    <div className='teamsetting'>
      <BackTitle_Btn navTitle='팀 설정' />
      <div className='setbox' onClick={() => navigate('/app/changeteamname')}>
        <p className='settitle'>팀명 변경하기</p>
        <img src={left} className='arrow'/>
      </div>
      <div className='setbox' onClick={() => navigate('/app/changeteamlogo')}>
        <p className='settitle' >팀 로고 변경하기</p>
        <img src={left} className='arrow'/>
      </div>
      <div className='setbox' onClick={() => navigate('/app/managemember')}>
        <p className='settitle' >팀원 관리하기</p>
        <img src={left} className='arrow'/>
      </div>
      <div className='setbox' onClick={() => navigate('/app/teamvideo')}>
        <p className='settitle' >팀 경기 영상</p>
        <img src={left} className='arrow'/>
      </div>
      <div className='exitteam'>팀 해체하기</div>
    </div>
  );
};

export default TeamSetting;