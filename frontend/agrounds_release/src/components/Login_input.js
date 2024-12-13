import React from 'react';
import './Login_input.scss';
import eye from '../assets/eye-off.png';

const Login_input = ({ placeholder, type, borderRadius='15px' , value, onChange}) => {
  
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
    <div className='inputBG' style={{ borderRadius }}>
      <input className='login_input' style={{ borderRadius }} placeholder={placeholder} type={type} value={value}onChange={onChange}/>
      {icon()}
    </div>
  );
};

export default Login_input;