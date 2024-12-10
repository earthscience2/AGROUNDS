import React from 'react';
import Login_title from '../../../../components/Login_title';
import Circle_common_btn from '../../../../components/Circle_common_btn';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';


const Complete = () => {
  const navigate = useNavigate();

  return (
    <CompleteStyle>
      <Gap/>
      <Login_title title='서비스 탈퇴' explain='서비스 탈퇴가 완료되었습니다' />
      <Gap2 />
      <Circle_common_btn title='돌아가기' onClick={()=>navigate('/mypage')}/>
    </CompleteStyle>
  );
};

export default Complete;

const CompleteStyle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Gap = styled.div`
  margin-top: 15vh;
`

const Gap2 = styled.div`
  margin-top: 60vh;
`