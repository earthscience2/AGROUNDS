import React,{useEffect, useState} from 'react';
import './teamlist.scss';
import minus from '../../assets/minus.png';
import client from '../../clients';
import { useNavigate } from 'react-router-dom';
import GoBack from '../../assets/go-back-icon.png';
const TeamList = () => {
    const navigate = useNavigate();
    const [teamList, setTeamList] = useState([]);
    const [teamName, setTeamName] = useState('');
    useEffect(() => {
        client.get('/api/V2team/main/')
        .then(function(response){
            const Players = response.data.flatMap(team => team.v2_team_players);
            setTeamName(sessionStorage.getItem('team_code'))
            setTeamList(Players);
        })
        .catch(function(error){
            console.log(error)
        })
    }, [teamList])
    

    return (
        <div className='teamlist-background'>
            <img className='teamlist_goback_icon' src={GoBack} onClick={() => navigate(-1)} />
            <div className='teamlist-logo'>AGROUNDS</div>
            <div className='teamlist-title'>{teamName} 팀원 목록</div>
            <div className='teamlist-line'></div>
            <div className='teamlist-largebox'>
                {teamList.map((player, index) => (
                    <div key={index} className='teamlist-personbox'>
                        <div className='teamlist-personbox-player'>{player}</div>
                        {sessionStorage.getItem('usertype') === 0 ? <img className='teamlist-personbox-minus'src={minus}/> : ''}
                        
                    </div>
                ))}
                
                

                
            </div>
        </div>
    );
};

export default TeamList;
