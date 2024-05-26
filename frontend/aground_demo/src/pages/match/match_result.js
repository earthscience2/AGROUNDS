import React,{useEffect, useState} from 'react';
import MatchPlan from '../../components/match-plan/match_plan';
import './match_result.scss';
import client from '../../clients';
const MatchResults = () => {
    const [teamList, setTeamList] = useState([]);
    useEffect(()=> {
        client.get('/api/V2team/main')
        .then(function(response){
            setTeamList(response.data[0].v2_team_players);
            console.log(response.data[0].v2_team_players);
           
        })
    },[])

    
    return (
            <div className='match_result_background'>
                <div className='match_result_title'>AGROUNDS</div>
                <MatchPlan myTeam='ththth' teamName='자유' place='인하대학교 대운동장' date='2024-12-11' homeScore='3' awayScore='4'/>
                <div className='match_result_score_playerbox'>
                    <div className='match_result_player_title'>참여자 목록</div>
                    <div className='match_result_player_list'>
                        {teamList.map((player, index) => (
                            <div className='match_result_player' key={index} >
                                <div className='match_result_player_name'>{player}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    );
};

export default MatchResults;