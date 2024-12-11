import React from 'react';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import '../css/MemberManage.scss';
import Member_Tab from '../../../components/Member_Tab';
import Member from '../../../components/Member';
import logo from '../../../assets/logo_sample.png';
import { useNavigate } from 'react-router-dom';

const MemberManage = () => {
  const navigate = useNavigate();
  return (
    <div className='membermanage'>
      <Back_btn />
      <Login_title title='팀원 관리하기' explain='기존의 팀원을 관리하고 새로운 팀원을 받아보세요' />
      <Member_Tab />
      <div className='managecontents'>
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

export default MemberManage;