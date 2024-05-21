import React, { useState } from 'react';
import './create_team.scss';
import Profile from "../../assets/user-icon.svg";

const CreateTeam = ({show, onClose}) => {


    return (
        <div className='create-team-modal-bg'>
            <div className='create-team-modal-mainbg'>
                <div className='create-team-modal-close'><div>팀 생성하기 </div><div className='modal-close'onClick={onClose}>X</div></div>
                <div className='create-team-modal-upload'>
                    <div className='create-team-modal-circle'>
                        <img className='create-team-modal-profile'src={Profile}/>
                    </div>
                    <div className='create-team-modal-text'>팀 로고 업로드</div>
                    <div className='create-team-modal-description'>.jpg 형식/ 1MB 이하로 업로드 해주세요.</div>
                </div>
                <div className='create-team-modal-team'>
                    <div className='create-team-modal-team-text'>팀 이름</div>
                    <div className='create-team-modal-input'><input className='create-team-modal-inputtext'type='text'/></div>
                </div>
                <div className='create-team-modal-button'>생성</div>
            </div>
        </div>
    );
};

export default CreateTeam;