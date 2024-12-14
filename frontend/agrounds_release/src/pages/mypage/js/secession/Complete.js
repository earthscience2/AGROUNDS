import React from 'react';
import Login_title from '../../../../components/Login_title';
import Circle_common_btn from '../../../../components/Circle_common_btn';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import check from '../../../../assets/ico_check.png';


const Complete = () => {
  const navigate = useNavigate();

  const compSecession = () => {
    sessionStorage.clear();
    navigate('/');
  }

  return (
    <CompleteStyle>
      <Gap/>
      <Login_title title='서비스 탈퇴' explain='서비스 탈퇴가 완료되었습니다' />
      <Gap />
      <img src={check} />
      <div className='btn'><Circle_common_btn title='돌아가기' onClick={compSecession}/></div>
    </CompleteStyle>
  );
};

export default Complete;

const CompleteStyle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .btn{
    width: 100%;
    position: absolute;
    bottom: 8vh;
  }
  & > img{
    width: 12vh;
  }
`
const Gap = styled.div`
  margin-top: 15vh;
`
