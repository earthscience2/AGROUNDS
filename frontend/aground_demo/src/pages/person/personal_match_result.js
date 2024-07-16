import React, { useEffect, useState } from 'react';
import './personal_match_result.scss';
import GoBack from '../../assets/go-back-white-icon.png';
import { useNavigate } from 'react-router-dom';
import FullHeatMap from '../../assets/full-match/full-heat-map.png';
import FullSprint from '../../assets/full-match/full-sprint-map.png';
import FullMovePath from '../../assets/full-match/full-move-path.png';
import Canvas from '../../components/canvas/Canvas';

const rawData = [
    "007/2024.07.02.20.04.22.000/348065.11992098024/4050863.3452527435",
    "007/2024.07.02.20.04.22.100/348065.15558709815/4050863.410490962",
    "007/2024.07.02.20.04.22.200/348065.1810626343/4050863.4570892467",
    "007/2024.07.02.20.04.22.300/348065.20016951155/4050863.4920380684",
    "007/2024.07.02.20.04.22.400/348065.21502987127/4050863.519220593",
    "007/2024.07.02.20.04.22.500/348065.2269188663/4050863.540966065",
    "007/2024.07.02.20.04.22.600/348065.28968452057/4050863.6186592127",
    "007/2024.07.02.20.04.22.700/348065.43375102046/4050863.7337171123",
    "007/2024.07.02.20.04.22.800/348065.4779828185/4050863.8517381875",
    "007/2024.07.02.20.04.22.900/348065.54074890626/4050863.9294304345",
    "007/2024.07.02.20.04.23.000/348065.60351456085/4050864.0071235816",
    "007/2024.07.02.20.04.23.100/348065.6662806486/4050864.0848158286",
    "007/2024.07.02.20.04.23.200/348065.72904630314/4050864.1625089757",
    "007/2024.07.02.20.04.23.300/348065.79181195743/4050864.2402021233",
    "007/2024.07.02.20.04.23.400/348065.93587845715/4050864.355260023",
    "007/2024.07.02.20.04.23.500/348066.0799449571/4050864.4703179225",
    "007/2024.07.02.20.04.23.600/348066.21011038887/4050864.615621443",
    "007/2024.07.02.20.04.23.700/348066.2589758761/4050864.723560645",
    "007/2024.07.02.20.04.23.800/348066.3263756534/4050864.7911710176",
    "007/2024.07.02.20.04.23.900/348066.3937749971/4050864.8587822914",
];

const parseData = (rawData) => {
    return rawData.map(entry => {
        const [id, timestamp, x, y] = entry.split('/');
        return {
            x: parseFloat(x),
            y: parseFloat(y)
        };
        
    });
};



const PersonalMatchResult = () => {
    const navigate = useNavigate();
    const nickname = '김용민 기요미';
    const matchTime = '4/29 19:00 ~ 19:20, 19:25 ~ 19:45';
    const [matchSession, setMatchSession] = useState(0);
    const [position,setPosition] = useState([]);

    useEffect(() => {
        const data = parseData(rawData);
        setPosition(data);
    }, [])
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
                <div className='personal_match_result_imgbox_title'>이동경로</div><img className='personal_match_result_imgbox_heatmap'src={FullMovePath}/>
            </div>
            <div className='personal_match_result_imgbox'>
                <div className='personal_match_result_imgbox_title'>스프린트맵</div><img className='personal_match_result_imgbox_heatmap'src={FullMovePath}/>
            </div>
            <div className='personal_match_result_imgbox'>
                <div className='personal_match_result_imgbox_title'>히트맵</div><img className='personal_match_result_imgbox_heatmap'src={FullMovePath}/>
            </div>
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
            <Canvas positions={position}/>
        </div>
    );
};

export default PersonalMatchResult;