import React from 'react';
import UserIcon from '../../assets/user-icon.svg';
import addEvent from '../../assets/add-event.png';
import team from '../../assets/team.png';
const MainPage = () => {
    return (
        <div>
            <div>
                <div>AGROUNDS</div>
                <img src={addEvent}/>
                <img src={team}/>
            </div>
            <div>
                <img src={UserIcon}/><div>teamname</div>
            </div>
            <div>
                <div className='main_page_matchplan_title'>경기일정</div>
                <div className='main_page_matchplan_teambox'><div className='main_page_matchplan_teamname1'>{myTeam}</div><div className='main_page_matchplan_vs'>VS</div><div className='main_page_matchplan_teamname2'>{teamName}</div></div>
                <div className='main_page_matchplan_place'>{place}</div>
                <div className='main_page_matchplan_date'>{date}<div className='main_page_matchplan_datespace'></div>{time}</div>
            </div>

        </div>
    );
};

export default MainPage;