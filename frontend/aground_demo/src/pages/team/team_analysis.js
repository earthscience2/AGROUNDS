import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GoBack from '../../assets/go-back-icon.png';
import { useLocation } from "react-router-dom";
import client from "../../clients";
import './team_analysis.scss';
import TeamAnalysisC from "../../components/analysis/TeamAnalysis";
import SelectQuarter from "../../components/analysis/SelectQuarter";
import Canvas from '../../components/canvas/Canvas';
import styled from "styled-components";
import Nav from '../../components/general/nav';

const TeamAnalysis = () => {
    const [positions, setPositions] = useState([]);

    useEffect(()=>{
        const eventSource = new EventSource('https://agrounds.com/api/V2gps/team_gps_sse');

        eventSource.onmessage = function(event) {
            try {
                let jsonData = event.data;

                if (jsonData.startsWith("{") && jsonData.endsWith("}")) {
                    jsonData = jsonData.replace(/'/g, '"');
                } else {
                    throw new SyntaxError("Invalid JSON format");
                }

               
                const newEvent = JSON.parse(jsonData);
               
                const newPositions = Object.values(newEvent);
               
                setPositions((prevPositions) => [...prevPositions, ...newPositions]);
                
                if (event.data === 'end') {
                    eventSource.close();
                }
            } catch (error) {
                console.error("Failed to parse event data:", error);
            }
        };

        eventSource.onerror = function(error) {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        // Clean up the event source on component unmount
        return () => {
            eventSource.close();
        };
    }, [])
    

    const {state} = useLocation();
    const { matchCode } = state;
    const navigate = useNavigate();
// const matchcode = {
//     'v2_match_code' : matchCode
// }
// client.post('', matchcode)
// .then(function(){

// })
// .catch(function(error){

// })
    const Test = (quarter) => {
        console.log(quarter);
    }
    return (
        <div className='team_analysis_background'>
            <Nav/>
            <div className='team_analysis_title'>팀 경기 분석결과</div>
            <SelectQuarter quarter={Test}/>
            <MovingPath>
                <SpanTitle>선수 이동경로</SpanTitle>
                <Canvas positions={positions}/>
            </MovingPath>
            
            <TeamAnalysisC title='스프린트'/>
            <TeamAnalysisC title='이동거리'/>
            <TeamAnalysisC title='최대속력'/>
            <TeamAnalysisC title='평균속력'/>
            <TeamAnalysisC title='활동범위'/>
        </div>
    );
};

const MovingPath = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const SpanTitle = styled.span`
    font-size: 2.2vh;
    font-weight: 700;
    margin: 5vh 0 2vh 0;
`

export default TeamAnalysis;
