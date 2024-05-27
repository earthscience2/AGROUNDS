import React,{useEffect, useState} from 'react';
import MatchPlan from '../../components/match-plan/match_plan';
import './match_result.scss';
import client from '../../clients';
import Edit from '../../assets/edit-icon.png';
import { useNavigate } from 'react-router-dom';
import GoBack from '../../assets/go-back-icon.png';
const MatchResults = () => {
    const [teamList, setTeamList] = useState([]);
    const navigate = useNavigate();
    useEffect(()=> {
        client.get('/api/V2team/main')
        .then(function(response){
            setTeamList(response.data[0].v2_team_players);
            console.log(response.data[0].v2_team_players);
           
        })
    },[])

    
    return (
            <div className='match_result_background'>
                <img className='match_result_goback_icon' src={GoBack} onClick={() => navigate(-1)} />
                <div className='match_result_title'>AGROUNDS</div>
                <img className='match_result_edit_icon' src={Edit} onClick={() => navigate('/AfterMatch')}/>
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