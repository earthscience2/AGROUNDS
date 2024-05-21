import React from 'react';
import './first_signup.scss';
import GeneralBtn from '../../components/button/generalBtn';
import Soccer from "../../assets/soccer.svg"
import { useNavigate } from 'react-router-dom';
const FirstSignup = () => {
    const navigate = useNavigate();

    return (
        <div className='first-signup-bg'>
            <div className='first-signup-logo'>AGROUNDS</div>
            <img className='first-signup-soccer'src={Soccer}/>
            <div className='first-signup-text'>지금 AGROUNDS에서 Team을 <br/>생성해보세요 !</div>
            <div className='first-signup-text2'>역량 분석부터 전술분석까지</div>
            <div className='first-signup-maketeam'><GeneralBtn color='black' onClick={() => navigate('/CreateTeam')}>팀 생성하기</GeneralBtn></div>
            <div className='first-signup-attendteam'><GeneralBtn color='black'>팀 가입하기</GeneralBtn></div>
        </div>
    );
};

export default FirstSignup;