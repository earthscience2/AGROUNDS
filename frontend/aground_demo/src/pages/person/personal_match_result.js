import React, { useState } from 'react';
import './personal_match_result.scss';
import GoBack from '../../assets/go-back-white-icon.png';
import { useNavigate } from 'react-router-dom';
import FullHeatMap from '../../assets/full-match/full-heat-map.png';
import FullSprint from '../../assets/full-match/full-sprint-map.png';
import FullMovePath from '../../assets/full-match/full-move-path.png';
const PersonalMatchResult = () => {
    const navigate = useNavigate();
    const nickname = '김용민 기요미';
    const matchTime = '4/29 19:00 ~ 19:20, 19:25 ~ 19:45';
    const [matchSession, setMatchSession] = useState(0);


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
            <div className='personal_match_result_imgbox'>
                <div className='personal_match_result_imgbox_title'><div className='personal_match_result_imgbox_heatmap'><img className='personal_match_result_imgbox_heatmap_img'src={FullMovePath}/></div>이동경로</div>
                <div className='personal_match_result_imgbox_title'><div className='personal_match_result_imgbox_heatmap'><img className='personal_match_result_imgbox_heatmap_img'src={FullSprint}/></div>스프린트맵</div>
                <div className='personal_match_result_imgbox_title'><div className='personal_match_result_imgbox_heatmap'><img className='personal_match_result_imgbox_heatmap_img'src={FullHeatMap}/></div>히트맵</div>
                
                
            </div>
            <div className='personal_match_result_detail_box'>
                <div className='personal_match_result_detail_contents_title'><p className='personal_match_result_detail_contents_content'>CAM</p>position</div>
                <div className='personal_match_result_detail_contents_title'><p className='personal_match_result_detail_contents_content'>4.31</p>평균속력(km/h)</div>
                <div className='personal_match_result_detail_contents_title'><p className='personal_match_result_detail_contents_content'>25.55</p>최대속력(km/h)</div>
                <div className='personal_match_result_detail_contents_title'><p className='personal_match_result_detail_contents_content'>40</p>이동시간(분)</div>
                <div className='personal_match_result_detail_contents_title'><p className='personal_match_result_detail_contents_content'>1</p>스프린트 횟수</div>
                <div className='personal_match_result_detail_contents_title'><p className='personal_match_result_detail_contents_content'>3.23</p>이동 거리(km)</div>
            </div>
            <div>

            </div>
        </div>
    );
};

export default PersonalMatchResult;