import React,{useEffect, useState} from 'react';
import MatchPlan from '../../components/match-plan/match_plan';
import './after_match.scss';
import Textinput from '../../components/textintput/textinput';
import client from '../../clients';
import GeneralBtn from '../../components/button/generalBtn';
const AfterMatch = () => {
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [teamList, setTeamList] = useState([]);
    const [attend, setAttend] = useState([]);
    useEffect(()=> {
        client.get('/api/V2team/main')
        .then(function(response){
            setTeamList(response.data[0].v2_team_players);
            console.log(response.data[0].v2_team_players);
            console.log(attend)
        })
    },[attend])
    return (
        <div className='after_match_background'>
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
                        <div className='after_match_player' key={index} onClick={() =>setAttend(player)}>
                            <div className='after_match_player_name'>{player}</div>
                        </div>
                    ))}
                </div>
            </div>
            <GeneralBtn color='black' children='입력완료'/>
        </div>
    );
};

export default AfterMatch;