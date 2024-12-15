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
import { getTeamInfoApi, getTeamPlayerListApi, TeamMemberApi, withdrawTeamApi } from '../../../function/TeamApi';
import { PositionDotColor } from '../../../function/PositionColor';
import Modal from '../../../components/Modal';
import Small_Common_Btn from '../../../components/Small_Common_Btn';

const MyTeam = () => {
  const navigate = useNavigate();
  const [isManager, setIsManager] = useState(true);
  const [member, setMember] = useState([]);
  const [team, setTeam] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBoxOpen, setIsBoxOpen] = useState(false);

  const openCloseBox = () => {
    setIsBoxOpen((prev)=> !prev)
  }

  const openModal = ({team}) => {
    setIsModalOpen(true);
  }
  const closeModal = () => {
    setIsModalOpen(false);
  }

  useEffect(() => {
    getTeamPlayerListApi({'team_code': sessionStorage.getItem('teamCode')})
    .then((response) => {
      setMember(response.data.result);
      console.log(response.data);
    })
    .catch(error => console.log(error));
    
    getTeamInfoApi({'team_code': sessionStorage.getItem('teamCode') })
    .then((response) => {
      setTeam(response.data)
      
      if (sessionStorage.getItem('userCode') === response.data.team_host) {
        setIsManager(true);
      } else {
        setIsManager(false);
      }
    })
    .catch(error => console.log(error));
    
    console.log(team)
    console.log(member)
    if (sessionStorage.getItem('userCode') === team.team_host) {
      setIsManager(true);
    } else {
      setIsManager(false);
    }
    console.log(team.team_host)
  }, [])

  const exitTeam = () => {
    withdrawTeamApi()
    .then((response) => {
      alert('팀 탈퇴에 성공했습니다.');
      navigate('/main');
    })
    .catch((error) => {
      console.log(error)
    })
    
  }
  const exit = () => {
    openCloseBox();
    openModal()
  }
  const declair = () => {
    alert('성공적으로 팀을 신고했습니다.');
    openCloseBox();
  }


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
          <img src={dots} className='cogbtn' onClick={openCloseBox}/>
          {isBoxOpen && (
            <div className='myteam-noneadvisor'>
              <div className='exitteam' onClick={exit}> 팀 탈퇴하기</div>
              <div className='declair' onClick={declair}>신고하기</div>
            </div>
          )}
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

        {member.length > 0 ? (
          <div className='list'>
            {member.map((player) => (
              <MemberPrev userCode={player.user_code} img={team.team_logo} isManager={isManager} player={player.user_nickname} age={player.user_age} color={PositionDotColor(player.user_position)} position={player.user_position} onClick={() => navigate('/userinfo', {state: { userCode: player.user_code}})}/>
            ))}
          </div>
        ) : (
          <div className="empty-message">
            팀원을 모집하고 추가해보세요.
          </div>

        )}
        
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="myteamMment">
            팀에서 탈퇴하시겠습니까?
          </div>
          <div className="myteam-buttonbox">
            <Small_Common_Btn
              onClick={closeModal}
              title="취소"
              backgroundColor="#F2F4F8"
              color="black"
            />
            <Small_Common_Btn
              onClick={exitTeam}
              title="확인"
              backgroundColor="#262626"
              color="white"
            />
          </div>
        </Modal>
        )}
    </div>
  );
};

export default MyTeam;