import React,{useEffect, useState} from 'react';
import MatchPlan from '../../components/match-plan/match_plan';
import './match_result.scss';
import client from '../../clients';
import Edit from '../../assets/edit-icon.png';
import { useNavigate } from 'react-router-dom';
import GoBack from '../../assets/go-back-icon.png';
import Gps from '../../assets/gps.png';
import classNames from 'classnames';
const MatchResults = () => {
    const [teamList, setTeamList] = useState([]);
    const [gpsList, setGpsList] = useState(['이도윤','노시환']);
    const navigate = useNavigate();


    useEffect(()=> {
        client.get('/api/V2team/main')
        .then(function(response){
            setTeamList(response.data[0].v2_team_players);
            console.log(response.data[0].v2_team_players);
            
        })
    },[])
    const hasGps = (playerName) => {
        return gpsList.includes(playerName);
    };
    
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
                                <div className={classNames(`match_result_player_name ${hasGps(player) && 'gps'} `)}>{player}</div>
                                {hasGps(player) && <img src={Gps} className='match_result_player_gps' />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    );
};

export default MatchResults;