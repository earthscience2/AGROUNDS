import React, { useEffect, useState } from 'react';
import './first_signup.scss';
import GeneralBtn from '../../components/button/generalBtn';
import Soccer from "../../assets/soccer.svg"
import CreateTeamModal from './create_team_modal';
import JoinTeamModal from './join_team_modal';
import { useNavigate } from 'react-router-dom';
import client from '../../clients';

const FirstSignup = () => {
    const [teamCreateModal, setTeamCreateModal] = useState(false);
    const [teamJoinModal, setTeamJoinModal] = useState(false);
    const navigate = useNavigate();
    const userCode = {
        'user_code' : sessionStorage.getItem('usercode')
    }
    const TeamCreateModalOpen = () => {
        setTeamCreateModal(!teamCreateModal);
    }

    const TeamJoinModalOpen = () => {
        setTeamJoinModal(!teamJoinModal);
    }
    const MovePersonalPage = () => {
        console.log(userCode)

            client.post('/api/V2team/join-personal/',userCode)
            .then(function(response){
                alert('개인 가입에 성공했습니다.')
            })
            .catch(function(err){
                console.log(err)
            })
            navigate('/MainPage');
        }
    

    
    return (
        <div className='first-signup-bg'>
            {teamCreateModal ? <CreateTeamModal onClose={TeamCreateModalOpen}/> : ''}
            {teamJoinModal ? <JoinTeamModal onClose={TeamJoinModalOpen}/> : ''}
            <div className='first-signup-logo'>AGROUNDS</div>
            <img className='first-signup-soccer'src={Soccer}/>
            <div className='first-signup-text'>지금 AGROUNDS에서 Team을 <br/>생성해보세요 !</div>
            <div className='first-signup-text2'>역량 분석부터 전술분석까지</div>
            <div className='first-signup-startpersonal'><GeneralBtn color='white' onClick={MovePersonalPage}>개인으로 시작하기</GeneralBtn></div>
            <div className='first-signup-maketeam'><GeneralBtn color='black' onClick={TeamCreateModalOpen}>팀 생성하기</GeneralBtn></div>
            <div className='first-signup-attendteam'><GeneralBtn color='black' onClick={TeamJoinModalOpen}>팀 가입하기</GeneralBtn></div>
        </div>
    );
};

export default FirstSignup;