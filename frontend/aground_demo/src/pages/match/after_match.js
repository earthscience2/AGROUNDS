import React,{useEffect, useState} from 'react';
import MatchPlan from '../../components/match-plan/match_plan';
import './after_match.scss';
import Textinput from '../../components/textintput/textinput';
import client from '../../clients';
import GeneralBtn from '../../components/button/generalBtn';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import GoBack from '../../assets/go-back-icon.png';
const AfterMatch = () => {
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [teamList, setTeamList] = useState([]);
    const [attend, setAttend] = useState([]);
    const navigate = useNavigate();
    useEffect(()=> {
        client.get('/api/V2team/main')
        .then(function(response){
            setTeamList(response.data[0].v2_team_players);
            console.log(response.data[0].v2_team_players);
           
        })
    },[])

    const addPlayerToAttend = (player) => {
        setAttend((prevAttend) => {
            if (prevAttend.includes(player)) {
                return prevAttend.filter(p => p !== player);
            } else {
                return [...prevAttend, player];
            }
        });
        console.log(attend)
    };

    const onSubmitHandler = () => {
        const afterMatchData = {
            "v2_match_code": '',
            "v2_match_result": [homeScore, awayScore],
            "v2_match_players": attend,
            "v2_match_GPSplayers": ["asdf"]
        }
        client.post('/api/V2match/aftermatch/', afterMatchData)
        .then(function(response){
            console.log(response);
        })
        .catch(function(error){
            console.log(error)
        })
    }
    const isValid = homeScore && awayScore && attend
    
    return (
        <form onSubmit={onSubmitHandler}>
            <div className='after_match_background'>
                <img className='after_match_goback_icon' src={GoBack} onClick={() => navigate(-1)} />
                <div className='after_match_title'>AGROUNDS</div>
                <MatchPlan myTeam='ththth' teamName='자유' place='인하대학교 대운동장' date='2024-12-11' homeScore={homeScore} awayScore={awayScore}/>
                <div className='after_match_score_inputbox'>
                    <div className='after_match_score'>Score</div>
                    <div className='after_match_score_input'>
                        <Textinput size='small' placeholder='Home Score' type='number' onChange={(e) => setHomeScore(e.target.value)}/>
                        <div className='after_match_score_input_-'>-</div>
                        <Textinput size='small'placeholder='Away Score' type='number' onChange={(e) => setAwayScore(e.target.value)}/>
                    </div>
                </div>
                <div className='after_match_score_playerbox'>
                    <div className='after_match_player_title'>참여자 선택</div>
                    <div className='after_match_player_list'>
                        {teamList.map((player, index) => (
                            <div className={`after_match_player ${attend.includes(player) ? 'selected' : ''}`} key={index} onClick={() => addPlayerToAttend(player)}>
                                <div className='after_match_player_name'>{player}</div>
                            </div>
                        ))}
                    </div>
                </div>
                {isValid ? <GeneralBtn color='black' children='입력완료' onClick={onSubmitHandler}/> : <GeneralBtn color='white' children='입력완료' onClick={() => alert('필드를 모두 입력해주세요')}/>}
            </div>
        </form>
    );
};

export default AfterMatch;