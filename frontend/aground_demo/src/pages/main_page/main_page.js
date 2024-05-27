import React, { useEffect, useState } from 'react';
import UserIcon from '../../assets/soccer-team-logo.png';
import addEvent from '../../assets/add-event.png';
import Team from '../../assets/team.png';
import client from '../../clients';
import './main_page.scss';
import { useNavigate } from 'react-router-dom';
const MainPage = () => {
    const [team, setTeam] = useState([]);
    const [teamName, setTeamName] = useState('');
    const navigate = useNavigate();
    const [matchCode, setMatchCode] = useState([])

    const teamcode = {
        "v2_team_code" : 't_1sa95sa10rmdrs'
    }
    const matchcode = {
        "v2_match_code" : matchCode
    }

    useEffect(() => {
        client.post('/api/V2team/searchbycode/', teamcode)
        .then(function(response){
            console.log(response);
            setTeamName(response.data.v2_team_name)
            
            setMatchCode(response.data.v2_team_match);
            console.log(matchCode);
        })
        .catch(function(error){
            console.log(error)
        })
    }, [])

    client.post('/api/V2match/searchbymatchcode/', matchcode)
    .then(function(response) {
        console.log(response);
    })
    .catch(function(error){
        console.log(error)
    })


    const isEmpty = () => {
        if (team.length < 1 ){
            return(
                <div className='main_page_contentbox_empty'><div className='main_page_contentbox_empty_text1'>텅 ...</div><div className='main_page_contentbox_empty_text2'>경기일정을 추가해보세요 !</div></div> 
            )
        }else{
            return team.map((match, index) => (
                <div className='main_page_matchplan' key={index} onClick={()=>navigate('/MatchResults')}>
                    <div className='main_page_matchplan_teambox'><div className='main_page_matchplan_teamname1'>{match.v2_match_home}</div><div className='main_page_matchplan_vs'>VS</div><div className='main_page_matchplan_teamname2'>{match.v2_match_away}</div></div>
                    <div className='main_page_matchplan_place'>{match.v2_match_location}</div>
                    <div className='main_page_matchplan_date'><div className='main_page_matchplan_datespace'>{match.v2_match_schedule}</div></div>
                </div>
            ))
        }
            
    }
    return (
        <div className='main_page_background'>
            <div className='main_page_navbox'>
                <div className='main_page_nav_logo'>AGROUNDS</div>
                <div className='main_page_teamlogobox'>
                    <div className='main_page_teamlogobox_box'>
                        <div className='main_page_teamlogobox_logobox'><img className='main_page_teamlogobox_logo' src={UserIcon}/></div><div className='main_page_teamlogobox_teamname'>{teamName}</div>
                    </div>
                        <div className='main_page_nav'>
                            <div className='main_page_title'>경기일정</div>
                            <img className='main_page_nav_team' onClick={() => navigate('/TeamList')}src={Team}/>
                            <img className='main_page_nav_addevent' onClick={() => navigate('/AddMatch')}src={addEvent}/>
                    </div>
                </div>
            </div>
            
            <div className='main_page_contentbox'>
                {isEmpty()}
            </div>
        </div>
    );
};

export default MainPage;