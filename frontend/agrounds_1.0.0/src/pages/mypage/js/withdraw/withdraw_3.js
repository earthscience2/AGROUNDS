import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Login_title from '../../../../components/Login_title';
import Circle_common_btn from '../../../../components/Circle_common_btn';
import check from '../../../../assets/common/ico_check.png';

const Complete = () => {
  const navigate = useNavigate();

  const compSecession = () => {
    sessionStorage.clear();
    navigate('/app');
  };

  return (
    <CompleteStyle>
      <Gap />
      <Login_title title='서비스 탈퇴' explain='서비스 탈퇴가 완료되었습니다' />
      <Gap />
      <img src={check} alt='완료 아이콘' />
      <div className='btn'>
        <Circle_common_btn title='돌아가기' onClick={compSecession} />
      </div>
    </CompleteStyle>
  );
};

export default Complete;

const CompleteStyle = styled.div`
  width: 100%;
  max-width: 499px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .btn {
    width: 100%;
    position: absolute;
    bottom: 8vh;
  }
  
  & > img {
    width: 12vh;
  }
`;

const Gap = styled.div`
  margin-top: 15vh;
`;
