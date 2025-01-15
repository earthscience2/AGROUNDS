import React from 'react';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import MainSummary from '../../../components/Main_Summary';
import '../css/Main.scss';
import Footer from '../../../components/Footer';
import Main_Subject from '../../../components/Main_Subject';
import { Device, MatchPlan, MatchVideo, MyOvr, MyTeam, NoTeam } from '../../../function/SubjectContents';
import RecentMatch from '../../../components/RecentMatch';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();
  const userType = sessionStorage.getItem('userType');

  return (
    <div className='main'>
      <LogoBellNav logo={true}/>
      <MainSummary/>
      <div className='subjectbox'>
        {userType === 'individual' ?
          (<Main_Subject title='나의 팀' BG='#FFFFFF' color='#262626' arrowC='black' arrow={true} children={NoTeam()} onClick={() => navigate('/app/jointeam')}/>):
          (<Main_Subject title='나의 팀' BG='#FFFFFF' color='#262626' arrowC='black' arrow={true} children={MyTeam()} onClick={() => navigate('/app/myteam')}/>)
        }
        <Main_Subject title='나의 OVR' BG='#343A3F' color='#FFFFFF' arrowC='white' arrow={true}children={MyOvr()} onClick={() => navigate('/app/myovr')}/>
        <Main_Subject title='경기 영상' BG='#DADFE5' color='#000000' arrowC='black' arrow={true}children={MatchVideo()} onClick={() => navigate('/app/video')}/>
        <Main_Subject title='GPS 기기' BG='#10CC7E' color='#FFFFFF'arrow={true} arrowC='white'children={Device()}/>
      </div>
      <div className='recentmatchbox'>
        <RecentMatch/>
      </div>
      <Footer />
    </div>
  );
};

export default Main;