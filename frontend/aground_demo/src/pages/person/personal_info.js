
import React from 'react';
import GoBack from '../../assets/go-back-icon.png'
import { useNavigate } from 'react-router-dom';
import './personal_info.scss';
import GeneralBtn from '../../components/button/generalBtn';
const PersonalInfo = () => {
    const navigate = useNavigate();
    const userName = sessionStorage.getItem('username');
    const team = sessionStorage.getItem('teamname');
    const userNickname = sessionStorage.getItem('nickname');
    const userHeight = sessionStorage.getItem('user_height');
    const userWeight = sessionStorage.getItem('user_weight')
    const userPosition = sessionStorage.getItem('user_position')
    return (
        <div className='mypage_background'>
            <img className='mypage_goback_icon' src={GoBack} onClick={() => navigate(-1)} />
            <div className='mypage_title'>AGROUNDS</div>
            <div className='mypage_titlename'>{userNickname}님의 프로필</div>
            <div className='mypage_contentbox'>
                <div className='mypage_contents'><div className='mypage_content1'>이름</div><div className='mypage_content2'>{userName}</div></div>
                <div className='mypage_contents'><div className='mypage_content1'>몸무게</div><div className='mypage_content2'>{userWeight}</div></div>
                <div className='mypage_contents'><div className='mypage_content1'>키</div><div className='mypage_content2'>{userHeight}</div></div>
                <div className='mypage_contents'><div className='mypage_content1'>선호 포지션</div><div className='mypage_content2'>{userPosition}</div></div>
                <div className='mypage_contents'><div className='mypage_content1'>클럽가입 유무</div><div className='mypage_content2'>{team ? <span>유</span> : <span>무</span>}</div></div>
                <div className='mypage_contents'><div className='mypage_content1'>소속 팀</div><div className='mypage_content2'>{team ? <span>{team}</span> : <span>없음</span>}</div></div>
            </div>
            
        </div>
    );
};

export default PersonalInfo;