import React from 'react';
import GoBack from '../../assets/go-back-icon.png'
import { useNavigate } from 'react-router-dom';
import './my_page.scss'
import GeneralBtn from '../../components/button/generalBtn';
import { useState, useEffect } from 'react';
import client from '../../clients';
import Nav from '../../components/general/nav';
const MyPage = () => {
    const navigate = useNavigate();
    const TeamCode = {
        "v2_team_code" : sessionStorage.getItem('teamcode')
    }
    const userCode = sessionStorage.getItem('usercode');
    const team = sessionStorage.getItem('teamname');
    const [userName, setUserName] = useState('');
    const [userNickname, setUserNickname] = useState('');
    const [userHeight, setUserHeight] = useState('');
    const [userWeight, setUserWeight] = useState('');
    const [userPosition, setUserPosition] = useState('');
    const [userGender, setUserGender] = useState('');

    const findInfo = (teamList) => {
        const user = teamList.find(user => user.user_code === userCode);
        setUserName(user.user_name);
        setUserNickname(user.user_nickname);
        setUserHeight(user.user_height);
        setUserWeight(user.user_weight);
        setUserPosition(user.user_position);
        setUserGender(user.user_gender);
    }

    useEffect(() => {
        client.post('/api/V2team/searchbycode/', TeamCode)
        .then(function(response){
            findInfo(response.data.v2_team_players_detail)
        })
        .catch(function(error){
            console.log(error)
        })
    }, [userCode])
    
    return (
        <div className='mypage_background'>
            <Nav />
            <div className='mypage_titlename'>{userName}님의 프로필</div>
            <div className='mypage_contentbox'>
            <div className='mypage_contents'><div className='mypage_content1'>닉네임</div><div className='mypage_content2'>{userNickname}</div></div>
                <div className='mypage_contents'><div className='mypage_content1'>몸무게</div><div className='mypage_content2'>{userWeight}</div></div>
                <div className='mypage_contents'><div className='mypage_content1'>키</div><div className='mypage_content2'>{userHeight}</div></div>
                <div className='mypage_contents'><div className='mypage_content1'>성별</div><div className='mypage_content2'>{userGender}</div></div>
                <div className='mypage_contents'><div className='mypage_content1'>선호 포지션</div><div className='mypage_content2'>{userPosition}</div></div>
                <div className='mypage_contents'><div className='mypage_content1'>클럽가입 유무</div><div className='mypage_content2'>{team ? <span>유</span> : <span>무</span>}</div></div>
                <div className='mypage_contents'><div className='mypage_content1'>소속 팀</div><div className='mypage_content2'>{team ? <span>{team}</span> : <span>없음</span>}</div></div>
            </div>
            
        </div>
    );
};

export default MyPage;