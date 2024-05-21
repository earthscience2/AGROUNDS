import React, { useState } from 'react';
import './first_signup.scss';
import GeneralBtn from '../../components/button/generalBtn';
import Soccer from "../../assets/soccer.svg"
import CreateTeamModal from './create_team_modal';
import JoinTeamModal from './join_team_modal';
const FirstSignup = () => {
    const [teamCreateModal, setTeamCreateModal] = useState(false);
    const [teamJoinModal, setTeamJoinModal] = useState(false);

    const TeamCreateModalOpen = () => {
        setTeamCreateModal(!teamCreateModal);
    }

    const TeamJoinModalOpen = () => {
        setTeamJoinModal(!teamJoinModal);
    }
    return (
        <div className='first-signup-bg'>
            {teamCreateModal ? <CreateTeamModal onClose={TeamCreateModalOpen}/> : ''}
            {teamJoinModal ? <JoinTeamModal onClose={TeamJoinModalOpen}/> : ''}
            <div className='first-signup-logo'>AGROUNDS</div>
            <img className='first-signup-soccer'src={Soccer}/>
            <div className='first-signup-text'>지금 AGROUNDS에서 Team을 <br/>생성해보세요 !</div>
            <div className='first-signup-text2'>역량 분석부터 전술분석까지</div>
            <div className='first-signup-maketeam'><GeneralBtn color='black' onClick={TeamCreateModalOpen}>팀 생성하기</GeneralBtn></div>
            <div className='first-signup-attendteam'><GeneralBtn color='black' onClick={TeamJoinModalOpen}>팀 가입하기</GeneralBtn></div>
        </div>
    );
};

export default FirstSignup;