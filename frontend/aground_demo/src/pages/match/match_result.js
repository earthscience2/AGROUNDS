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
import Nav from '../../components/general/nav';
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
            if (response.data.v2_match_players_detail === null){
                setTeamList([])
            }else{
                setTeamList(response.data.v2_match_players_detail);
                
            }
            setHome(response.data.v2_match_home);
            setAway(response.data.v2_match_away);
            setPlace(response.data.v2_match_location);
            setDate(response.data.v2_match_schedule);

            if (response.data.v2_match_result == null){
                setResult([0,0])
                setGpsList([])
            }else{
                setResult(response.data.v2_match_result);
                setGpsList(response.data.v2_match_GPSplayers)
                
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
                <Nav />
                <img className='match_result_edit_icon' src={Edit} onClick={() => navigate('/AfterMatch', {state: {matchCode: matchCode}})}/>
                <MatchPlan myTeam={home} teamName={away} place={place} date={date} homeScore={result[0]} awayScore={result[1]}/>
                <div className='match_result_score_playerbox'>
                    <div className='match_result_player_title'>참여자 목록</div>
                    <div className='match_result_player_list'>
                        {teamList.map((player, index) => (
                            <div onClick={()=>navigate('/PersonalInfo', {state: {userCode: player.user_code }})} className='match_result_player' key={index} >
                                <div  className={classNames(`match_result_player_name ${hasGps(player) && 'gps'} `)}>{player.user_name}/{player.user_position}/{player.user_height}/{player.user_weight}</div>
                                {hasGps(player.user_code) && <img src={Gps} className='match_result_player_gps' />}
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