import React, { useEffect, useState } from 'react';
import './personal_match_result.scss';
import GoBack from '../../assets/go-back-white-icon.png';
import { useNavigate } from 'react-router-dom';
import PersonalAnalysis from '../../components/analysis/PersonalAnalysis';

const PersonalMatchResult = () => {
    const navigate = useNavigate();
    const nickname = '김용민 기요미';
    const matchTime = '4/29 19:00 ~ 19:20, 19:25 ~ 19:45';
    const [matchSession, setMatchSession] = useState(0);
    const [position,setPosition] = useState([]);

    
    return (
        <div className='personal_match_result_background'>
            <img className='personal_match_result_goback_icon' src={GoBack} onClick={() => navigate(-1)} />
            <div className='personal_match_result-logo'>AGROUNDS</div>
            <div className='personal_match_result_nickname'>{nickname} 분석 결과</div>
            <div className='personal_match_result_matchTime'>{matchTime}</div>
            
            <div className='personal_match_result_match_division_button'>
                <div className='personal_match_result_match_division_fba_button' onClick={() => setMatchSession(0)}>풀경기</div>
                <div className='personal_match_result_match_division_fba_button' onClick={() => setMatchSession(1)}>전반전</div>
                <div className='personal_match_result_match_division_fba_button' onClick={() => setMatchSession(2)}>후반전</div>
            </div>
            <PersonalAnalysis />
        </div>
    );
};

export default PersonalMatchResult;