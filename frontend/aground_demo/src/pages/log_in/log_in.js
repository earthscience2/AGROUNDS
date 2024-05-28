import React, { useState } from 'react';
import './log_in.scss';
import GeneralBtn from '../../components/button/generalBtn';
import Textinput from '../../components/textintput/textinput';
import KakaoLogo from '../../assets/kakaoLogo.png';
import client from '../../clients';
import { useNavigate } from 'react-router-dom';

const LogIn=()=>{
    const [userid, setUserid] = useState('');
    const [userpw, setUserpw] = useState('');
    const [isLogin,setIsLogin] = useState('')
    const [token, setToken] = useState('');
    const [isid, setIsid] = useState('');
    const [isPassword,setIsPassword] = useState('');
    const navigate = useNavigate();

    const handleIdChange = (e) =>{
        setUserid(e.target.value);
        setIsid(e.target.value.toLowerCase().match(/([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/))
    }
    const handlePwChange = (e) => {
        setUserpw(e.target.value);
        setIsPassword(e.target.value.toLowerCase().match(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/))
 
    }
    const onKakaoClick = (e) => {
        window.location.replace(process.env.REACT_APP_BASE_URL+"/api/login/kakao");
    }
    const onAgrooundClick = (e) => {
        e.preventDefault();

        const loginData = {
            'user_id': userid,
            'password': userpw
        }
        client.post('/api/V2login/login/', loginData)
        .then(function(response){
            setToken(response.data.token)
            sessionStorage.setItem('nickname', response.data.user_nickname);
            sessionStorage.setItem('token', response.data.token)
            sessionStorage.setItem('usercode', response.data.user_code);
            sessionStorage.setItem('usertype', response.data.user_type);
            sessionStorage.setItem('teamcode', response.data.team_code);
            sessionStorage.setItem('teamname', response.data.team_name);
            sessionStorage.setItem('logintype', response.data.login_type);

            if (response.data.team_code === ""){
                navigate('/FirstSignup');
            }else{
                navigate('/MainPage');
            }
            
        })
        .catch(function(error){
            setIsLogin(false);
            alert(error.response.data.error)
        })
    }
// 유효성 검사 
    return (
        <form onSubmit={onAgrooundClick}>
            <div className='background'>
                <div className='logo'>AGROUNDS</div>
                <div className='input-div1'><Textinput onChange={handleIdChange} size='large' placeholder='이메일을 입력해주세요' type='email'/></div>
                <div className='input-div2'><Textinput onChange={handlePwChange} size='large' placeholder='비밀번호를 입력해주세요' type='password'/></div>
                {isid && isPassword ? <GeneralBtn children="로그인" color='black'onClick={onAgrooundClick}/>: <GeneralBtn color='white' children="로그인" />}
                <div className='etcbtn'>
                    <div className='createaccount'onClick={()=>navigate('/SignUp')}>계정 생성하기</div>
                    <div className='kakaobtn' onClick={onKakaoClick}><img src={KakaoLogo}/></div>
                </div>
            </div>
        </form>
    );
};

export default LogIn;