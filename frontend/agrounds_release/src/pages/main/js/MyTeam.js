import React, { useEffect, useState } from 'react';
import '../css/MyTeam.scss';
import logo from '../../../assets/logo_sample.png';
import Main_Subject from '../../../components/Main_Subject';
import righbtn from '../../../assets/right.png';
import Image_Comp from '../../../components/Image_Comp';
import { MatchPlan, RecentMatchS } from '../../../function/SubjectContents';
import { useNavigate } from 'react-router-dom';
import left from '../../../assets/left.png';
import cog from '../../../assets/cog.png';
import dots from '../../../assets/dots.png';
import MemberPrev from '../../../components/MemberPrev';
import { getTeamInfoApi, TeamMemberApi } from '../../../function/TeamApi';
import { PositionDotColor } from '../../../function/PositionColor';

const MyTeam = () => {
  const navigate = useNavigate();
  const [isManager, setIsManager] = useState(true);
  const [member, setMember] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    setMember(TeamMemberApi() || []);
    setTeam(getTeamInfoApi() || []);
    
    sessionStorage.getItem('userId') === team.team_host
    ? setIsManager(true)
    : setIsManager(false);
    
  }, [])

  return (
    <div className='myteam'>
      {isManager ? (
        <div className='teamnav'>
        <img src={left} className='leftbtn' onClick={() => navigate(-1)}/>
        <img src={cog} className='cogbtn' onClick={() => navigate('/teamsetting')}/>
      </div>
        ): (
        <div className='teamnav'>
          <img src={left} className='leftbtn' onClick={() => navigate(-1)}/>
          <img src={dots} className='cogbtn' onClick={() => navigate('/')}/>
        </div>
        )
      }
      
      <div className='logo'>
        <Image_Comp img={team.team_logo} width='8vh' />
      </div>
      <div className='fc'>{team.team_name}</div>
      <div className='subjectbox'>
        <Main_Subject title='최근 경기' BG='#FFFFFF' color='#262626' arrowC='black' arrow={true} children={<RecentMatchS logo1={logo} logo2={logo} />}/>
        <Main_Subject title='경기 일정' BG='#1C3E71' color='#FFFFFF' arrowC='white' arrow={true}children={MatchPlan()}/>
      </div>
      <div className='teambox'>
        <div className='teamtitle' >
          <p>팀원</p>
          {isManager ? <div className='managerbtn' onClick={() => navigate('/managemember')}>관리하기</div> : <img src={righbtn} onClick={() => navigate('/teamlist')}/>}
        </div>
        <div className='detail'>
          <p className='t1'>총</p>
          <p className='t2'>{member.length}명</p>
        </div>
        <div className='list'>
          {member.map((player) => (
            <MemberPrev key={player.user_code} img={team.team_logo} isManager={isManager} player={player.user_nickname} age={player.user_age} color={PositionDotColor(player.user_position)} position={player.user_position} onClick={() => navigate('/userinfo', {state: { userCode: player.user_code}})}/>
          ))}
        </div>
        
      </div>
    
    </div>
  );
};

export default MyTeam;