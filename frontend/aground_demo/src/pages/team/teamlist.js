import React,{useEffect, useState} from 'react';
import './teamlist.scss';
import minus from '../../assets/minus.png';
import client from '../../clients';
import { useNavigate } from 'react-router-dom';
import GoBack from '../../assets/go-back-icon.png';
import classNames from 'classnames';
import Nav from '../../components/general/nav';

const TeamList = () => {
    const navigate = useNavigate();
    const [teamList, setTeamList] = useState([]);
    const [teamName, setTeamName] = useState('');
    const teamcode = {
        "v2_team_code" : sessionStorage.getItem('teamcode')
    }

    useEffect(() => {
        client.post('/api/V2team/searchbycode/', teamcode)
        .then(function(response){
            setTeamName(response.data.v2_team_name);
            setTeamList(response.data.v2_team_players_detail);
        })
        .catch(function(error){
            console.log(error)
        })
    }, [])
    
    
    const usertype = sessionStorage.getItem('usertype');
    return (
        <div className='teamlist-background'>
            <Nav/>
            <div className='teamlist-title'>{teamName} 팀원 목록</div>
            <div className='teamlist-line'></div>
            <div className='teamlist-largebox'>
                {teamList.map((player, index) => (
                    <div key={index} className='teamlist-personbox' onClick={() => navigate('/PersonalInfo', {state : {userCode : player.user_code}})}>
                        <div className={classNames(`teamlist-personbox-player ${usertype == 0 ? 'minus' : ''}` )}>{player.user_name}</div>
                        {usertype == 0 ? <img className='teamlist-personbox-minus'src={minus}/> : ''}
                    </div>
                ))}
                
                

                
            </div>
        </div>
    );
};

export default TeamList;
