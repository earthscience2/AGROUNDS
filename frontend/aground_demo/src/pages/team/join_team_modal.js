import React from 'react';
import './join_team_modal.scss';
import Search from "../../assets/search-icon.svg"
const JoinTeamModal = ({onClose}) => {
    return (
        <div className='join-team-modal-bg'>
            <div className='join-team-modal-mainbg'>
                <div className='join-team-modal-close'><div>팀 가입하기 </div><div className='modal-close'onClick={onClose}>X</div></div>
                <div className='join-team-modal-input'>
                    <input className='join-team-modal-inputtext'type='text'/>
                    <div ><img className='join-team-modal-searchicon'src={Search}/></div>
                </div>
            </div>
        </div>
    );
};

export default JoinTeamModal;