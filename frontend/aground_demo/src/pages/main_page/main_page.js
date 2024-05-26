import React, { useEffect, useState } from 'react';
import UserIcon from '../../assets/soccer-team-logo.png';
import addEvent from '../../assets/add-event.png';
import Team from '../../assets/team.png';
import client from '../../clients';
import './main_page.scss';
const MainPage = () => {
    const [team, setTeam] = useState([])
    useEffect(() => {
        client.get('/api/V2match/main/')
        .then(function(response){
            setTeam(response.data)
        })
        .catch(function(error){
            console.log(error)
        })
    })
    return (
        <div className='main_page_background'>
            <div className='main_page_nav_logo'>AGROUNDS</div>
            <div className='main_page_teamlogobox'>
                <div className='main_page_teamlogobox_box'>
                    <div className='main_page_teamlogobox_logobox'><img className='main_page_teamlogobox_logo' src={UserIcon}/></div><div className='main_page_teamlogobox_teamname'>토트넘</div>
                </div>
                
                    <div className='main_page_nav'>
                    <div className='main_page_title'>경기일정</div>
                    <img className='main_page_nav_team' src={Team}/>
                    <img className='main_page_nav_addevent' src={addEvent}/>
                </div>
            </div>
            
            {team.map((match, index) => (
                <div className='main_page_matchplan' key={index}>
                    <div className='main_page_matchplan_teambox'><div className='main_page_matchplan_teamname1'>{match.v2_match_home}</div><div className='main_page_matchplan_vs'>VS</div><div className='main_page_matchplan_teamname2'>{match.v2_match_away}</div></div>
                    <div className='main_page_matchplan_place'>{match.v2_match_location}</div>
                    <div className='main_page_matchplan_date'><div className='main_page_matchplan_datespace'>{match.v2_match_schedule}</div></div>
                </div>
            ))}
            

        </div>
    );
};

export default MainPage;