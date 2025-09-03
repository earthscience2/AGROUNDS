import React from 'react';
import eye from '../assets/common/eye-off.png';
import styled from 'styled-components';

const Login_input = ({ placeholder, type, borderRadius='15px', borderColor='#F2F4F8', value='', onChange}) => {
  
  const icon = () => {
    if (placeholder==='몸무게'){
      return <div style={{fontSize: '17px', fontWeight: '700', color:'#878D96'}}>kg</div>
    }else if(placeholder==='키'){
      return <div style={{fontSize: '17px', fontWeight: '700', color:'#878D96'}}>cm</div>
    }else if(placeholder==="비밀번호 입력" || placeholder==="비밀번호 재입력" || placeholder==="새로운 비밀번호" || placeholder==="새로운 비밀번호 재입력") {
      return <img className='eyestyle' src={eye} />
    } else {
      return ;
    }
  }

  return (
    <LoginInputStyle style={{ borderRadius, border:'solid 1px', borderColor}}>
      <input 
        className='login_input'
        style={{ borderRadius }} 
        placeholder={placeholder} 
        type={type}
        value={value}
        onChange={onChange}/>
      {icon()}
    </LoginInputStyle>
  );
};

export default Login_input;

const LoginInputStyle = styled.div`

  background-color: #F2F4F8;
  width: 90%;
  height: 55px;
  display: flex;
  align-items: center;
  .login_input{
    background-color: #F2F4F8;
    border: none;
    width: 80%;
    height: 55px;
    font-size: 16px;
    padding: 0 4vw 0 4vw;
    outline: none;
    
    &::placeholder{
      font-size: 17px;
      font-weight: 600;
      color: #C1C7CD;
    }
  }
  .eyestyle{
    height: 20px;
  }

`