import React from 'react';
import FullMovePath from '../../assets/full-match/full-move-path.png';
const PersonalAnalysis = () => {
    return (
        <>
            <div className='personal_match_result_imgbox'>
            <div className='personal_match_result_imgbox_title'>이동경로</div><img className='personal_match_result_imgbox_heatmap'src={FullMovePath}/>
            </div>
            <div className='personal_match_result_imgbox'>
                <div className='personal_match_result_imgbox_title'>스프린트맵</div><img className='personal_match_result_imgbox_heatmap'src={FullMovePath}/>
            </div>
            <div className='personal_match_result_imgbox'>
                <div className='personal_match_result_imgbox_title'>히트맵</div><img className='personal_match_result_imgbox_heatmap'src={FullMovePath}/>
            </div>
            <div className='personal_match_result_detail_box_title'>세부정보</div>
            <div className='personal_match_result_detail_box'>
                <div className='personal_match_result_detail_contents_title'><p className='personal_match_result_detail_contents_content'>CAM</p>포지션</div>
                <div className='personal_match_result_detail_contents_title'><p className='personal_match_result_detail_contents_content'>4.31</p>평균속력(km/h)</div>
                <div className='personal_match_result_detail_contents_title'><p className='personal_match_result_detail_contents_content'>25.55</p>최대속력(km/h)</div>
                <div className='personal_match_result_detail_contents_title'><p className='personal_match_result_detail_contents_content'>40</p>이동시간(분)</div>
                <div className='personal_match_result_detail_contents_title'><p className='personal_match_result_detail_contents_content'>1</p>스프린트 횟수</div>
                <div className='personal_match_result_detail_contents_title'><p className='personal_match_result_detail_contents_content'>3.23</p>이동 거리(km)</div>
                <div className='personal_match_result_detail_contents_title'><p className='personal_match_result_detail_contents_content'>40</p>이동시간(분)</div>
                <div className='personal_match_result_detail_contents_title'><p className='personal_match_result_detail_contents_content'>1</p>스프린트 횟수</div>
                <div className='personal_match_result_detail_contents_title'><p className='personal_match_result_detail_contents_content'>3.23</p>이동 거리(km)</div>
            </div>
        </>
        
    );
};

export default PersonalAnalysis;