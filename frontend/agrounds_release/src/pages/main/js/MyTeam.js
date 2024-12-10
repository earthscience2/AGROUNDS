import React from 'react';
import '../css/MyTeam.scss';
import BackBtn from '../../../components/Back_btn';
import logo from '../../../assets/logo_sample.png';
import Main_Subject from '../../../components/Main_Subject';
import righbtn from '../../../assets/right.png';
import Member from '../../../components/Member';
import Image_Comp from '../../../components/Image_Comp';
import { MatchPlan, RecentMatchS } from '../../../function/SubjectContents';
import { useNavigate } from 'react-router-dom';
import left from '../../../assets/left.png';
import cog from '../../../assets/cog.png';

const MyTeam = () => {
  const navigate = useNavigate();
  return (
    <div className='myteam'>
      <div className='teamnav'>
        <img src={left} className='leftbtn' onClick={() => navigate(-1)}/>
        <img src={cog} className='cogbtn' onClick={() => navigate('/')}/>
      </div>
      <div className='logo'>
        <Image_Comp img={logo} width='8vh' />
      </div>
      <div className='fc'>FC Bayern Munchen</div>
      <div className='subjectbox'>
        <Main_Subject title='최근 경기' BG='#FFFFFF' color='#262626' arrowC='black' arrow={true} children={<RecentMatchS logo1={logo} logo2={logo} />}/>
        <Main_Subject title='경기 일정' BG='#1C3E71' color='#FFFFFF' arrowC='white' arrow={true}children={MatchPlan()}/>
      </div>
      <div className='teambox'>
        <div className='teamtitle' onClick={() => navigate('/teamlist')}>
          <p>팀원</p>
          <img src={righbtn} />
        </div>
        <div className='detail'>
          <p className='t1'>총</p>
          <p className='t2'>6명</p>
        </div>
        <div className='list'>
          <Member img={logo} player='조규성' age='만 26세' color='red' position='ST' onClick={() => navigate('/userinfo')}/>
          <Member img={logo} player='조규성' age='만 26세' color='#FD7759' position='RWF' onClick={() => navigate('/userinfo')}/>
          <Member img={logo} player='조규성' age='만 26세' color='#FD7759' position='LWM' onClick={() => navigate('/userinfo')}/>
          
        </div>
        
      </div>
    
    </div>
  );
};

export default MyTeam;