import React,{useEffect, useState} from 'react';
import MatchPlan from '../../components/match-plan/match_plan';
import './match_result.scss';
import client from '../../clients';
import Edit from '../../assets/edit-icon.png';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import GoBack from '../../assets/go-back-icon.png';
import Gps from '../../assets/gps.png';
import classNames from 'classnames';
import GeneralBtn from '../../components/button/generalBtn';
const MatchResults = () => {
    const [teamList, setTeamList] = useState([]);
    const [gpsList, setGpsList] = useState([]);
    const [home, setHome] = useState('');
    const [away, setAway] = useState('');
    const [place, setPlace] = useState('');
    const [date, setDate] = useState('');
    const [result, setResult] = useState([]);
    const navigate = useNavigate();

    
    const {state} = useLocation();
    const { matchCode } = state;
    
    const matchcode = {
        "v2_match_code" : matchCode
    }
   

    useEffect(()=> {
        client.post('/api/V2match/searchbymatchcode/', matchcode)
        .then(function(response){
            sessionStorage.setItem('matchcode', matchCode);
            if (response.data[0].v2_match_players == null){
                setTeamList([])
            }else{
                setTeamList(response.data[0].v2_match_players);
            }
            setHome(response.data[0].v2_match_home);
            setAway(response.data[0].v2_match_away);
            setPlace(response.data[0].v2_match_location);
            setDate(response.data[0].v2_match_schedule);

            if (response.data[0].v2_match_result == null){
                setResult([0,0])
            }else{
                setResult(response.data[0].v2_match_result);
            }
            if (response.data[0].v2_match_result == null){
                setGpsList([])
            }else{
                setGpsList(response.data[0].v2_match_GPSplayers)
            }
        })
        .catch(function(error){
            console.log(error);
        })
    },[])

    const hasGps = (playerName) => {
        return gpsList.includes(playerName);
    };
    
    const deleteBtn = () => {
        if(window.confirm("삭제하시겠습니까?") === true){
            client.post('/api/V2match/deletematch/', matchcode)
            .then(function(response){
                alert('삭제되었습니다.')
                navigate('/MainPage')
            })
            .catch(function(error){
                console(error)
            })
        }else{
            
        }
        
    }
    return (
            <div className='match_result_background'>
                <img className='match_result_goback_icon' src={GoBack} onClick={() => navigate(-1)} />
                <div className='match_result_title'>AGROUNDS</div>
                <img className='match_result_edit_icon' src={Edit} onClick={() => navigate('/AfterMatch')}/>
                <MatchPlan myTeam={home} teamName={away} place={place} date={date} homeScore={result[0]} awayScore={result[1]}/>
                <div className='match_result_score_playerbox'>
                    <div className='match_result_player_title'>참여자 목록</div>
                    <div className='match_result_player_list'>
                        {teamList.map((player, index) => (
                            <div onClick={()=>navigate('/PersonalInfo')}className='match_result_player' key={index} >
                                <div  className={classNames(`match_result_player_name ${hasGps(player) && 'gps'} `)}>{player}</div>
                                {hasGps(player) && <img src={Gps} className='match_result_player_gps' />}
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{marginBottom:'2vh'}}><GeneralBtn color='white' onClick={() => navigate('/TeamAnalysis', {state: {matchCode: matchCode}})}>분석결과 확인</GeneralBtn></div>
                <GeneralBtn color='black' onClick={deleteBtn}>삭제하기</GeneralBtn>
            </div>
    );
};

export default MatchResults;