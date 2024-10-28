import React, { useState } from 'react';
import './match_plan.scss';
const MatchPlan = ({myTeam,teamName,place,date, homeScore,awayScore}) => {
    
    return (
        <div className='match_plan_matchplan'>
            <div className='match_plan_teambox'><div className='match_plan_teamname1'>{myTeam}</div><div className='match_plan_vs'>VS</div><div className='match_plan_teamname2'>{teamName}</div></div>
            <div className='match_plan_scorebox'><div className='match_plan_homeScore'>{homeScore}</div><div className='match_plan_-'>-</div><div className='match_plan_awayscore'>{awayScore}</div></div>
            <div className='match_plan_place'>{place}</div>
            <div className='match_plan_date'>{date}<div className='match_plan_datespace'></div></div>
        </div>
    );
};

export default MatchPlan;