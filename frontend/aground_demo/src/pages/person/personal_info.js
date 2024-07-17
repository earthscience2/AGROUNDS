import React from 'react';
import { useNavigate } from 'react-router-dom';
import GoBack from '../../assets/go-back-icon.png';
import './personal_info.scss';

const data = [
    {name: '조상우', time: '23회'}, 
    {name: '선동범', time: '23회'}
]
const PersonalInfo = () => {
    const navigate = useNavigate();
    return (
        <div className='personal_info_background'>
            <img className='personal_info_goback_icon' src={GoBack} onClick={() => navigate(-1)} />
            <div className='personal_info_logo'>AGROUNDS</div>
            <div className='personal_info_title'>팀 경기 분석결과</div>
            <div className='personal_info_match_title'>경기: 1쿼터</div>
            <table>
                <thead>
                    <tr>
                        <th colSpan="3">스프린트 횟수</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                    <tr key={index}>
                        <td>{index+1}등</td>
                        <td>{item.name}</td>
                        <td>{item.time}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default PersonalInfo;