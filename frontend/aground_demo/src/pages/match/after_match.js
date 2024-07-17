import React,{useEffect, useState} from 'react';
import MatchPlan from '../../components/match-plan/match_plan';
import './after_match.scss';
import Textinput from '../../components/textintput/textinput';
import client from '../../clients';
import GeneralBtn from '../../components/button/generalBtn';
import classNames from 'classnames';
import { useNavigate, useLocation, UNSAFE_ErrorResponseImpl } from 'react-router-dom';
import GoBack from '../../assets/go-back-icon.png';
import SignUpInput from '../../components/textintput/sign_up_input';

const AfterMatch = () => {
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [teamList, setTeamList] = useState([]);
    const [attend, setAttend] = useState([]);
    const [date, setDate] = useState(null);
    const [place, setPlace] = useState('');
    const [gpsPlayer, setGpsPlayer] = useState([]);
    const [home, setHome] = useState('');
    const [away, setAway] = useState('');
    const navigate = useNavigate();
    const matchcode = {
        'v2_match_code' : sessionStorage.getItem('matchcode')
    }
    const teamname = {
        'v2_team_name' : sessionStorage.getItem('teamname')
    }
    const homeScoreField = (e) => {
        if(e.target.value < 0){
            alert('점수는 0 이상이어야 합니다.')
        }else{
            setHomeScore(e.target.value)
        }
    }
    const awayScoreField = (e) => {
        if(e.target.value < 0){
            alert('점수는 0 이상이어야 합니다.')
        }else{
            setAwayScore(e.target.value)
        }
    }
    useEffect(()=> {
        client.post('/api/V2team/searchbyname/', teamname)
        .then(function(response){
            setTeamList(response.data[0].v2_team_players_names)
        })
        .catch(function(error){
            console.log(error)
        })


        client.post('/api/V2match/searchbymatchcode/', matchcode)
        .then(function(response){
            setHome(response.data[0].v2_match_home);
            setAway(response.data[0].v2_match_away);
            setPlace(response.data[0].v2_match_location);
            setDate(response.data[0].v2_match_schedule);
           
        })
        .catch(function(error){
            console.log(error)
        })
    },[])

    const addPlayerToAttend = (player) => {
        setAttend((prevAttend) => {
            if (prevAttend.includes(player)) {
                return prevAttend.filter(p => p !== player);
            } else {
                return [...prevAttend, player];
            }
        });
        console.log(attend)
    };

    const GpsPlayerAttend = (gplayer) => {
        setGpsPlayer((prevAttend) => {
            if (prevAttend.includes(gplayer)) {
                return prevAttend.filter(p => p !== gplayer);
            } else {
                return [...prevAttend, gplayer];
            }
        });
    };

    const onSubmitHandler = () => {
        const afterMatchData = {
            "v2_match_code": sessionStorage.getItem('matchcode'),
            "v2_match_result": [homeScore, awayScore],
            "v2_match_players": attend,
            "v2_match_GPSplayers": gpsPlayer,
            "v2_match_location": place,
            "v2_match_schedule": date
        }
        client.post('/api/V2match/aftermatch/', afterMatchData)
        .then(function(response){
            alert('경기 결과를 성공적으로 입력했습니다 !');
            navigate(-1)
        })
        .catch(function(error){
            console.log(error);
            alert('필드를 모두 입력해주세요.')
        })
    }
    const isValid = homeScore && awayScore && attend
    
    return (
        <form onSubmit={onSubmitHandler}>
            <div className='after_match_background' >
                <img className='after_match_goback_icon' src={GoBack} onClick={() => navigate(-1)} />
                <div className='after_match_title'>AGROUNDS</div>
                <MatchPlan myTeam={home} teamName={away} place={place} date={date} homeScore={homeScore} awayScore={awayScore}/>
                <div className='after_match_score_inputbox'>
                    <div className='after_match_score'>Score<p className='after_match_score_essencial'>*</p></div>
                    <div className='after_match_score_input'>
                        <Textinput size='small' placeholder='Home Score' type='number' onChange={homeScoreField}/>
                        <div className='after_match_score_input_-'>-</div>
                        <Textinput size='small'placeholder='Away Score' type='number' onChange={awayScoreField}/>
                    </div>
                </div>
                <div className='after_match_score_playerbox'>
                    <div className='after_match_player_title'>참여자 선택<p className='after_match_player_title_essencial'>*</p><div className='after_match_player_title_number'>{attend.length} 명</div></div>
                    <div className='after_match_player_list'>
                        {teamList.map((player, index) => (
                            <div className={`after_match_player ${attend.includes(player) ? 'selected' : ''}`} key={index} onClick={() => addPlayerToAttend(player)}>
                                <div className='after_match_player_name'>{player}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='after_match_score_gps_playerbox'>
                    <div className='after_match_gps_player_title'>GPS 사용자 선택<p className='after_match_gps_player_title_essencial'>*</p><div className='after_match_gps_player_title_number'>{gpsPlayer.length} 명</div></div>
                    <div className='after_match_gps_player_list'>
                        {attend.map((gplayer, index) => (
                            <div className={`after_match_gps_player ${gpsPlayer.includes(gplayer) ? 'selected' : ''}`} key={index} onClick={() => GpsPlayerAttend(gplayer)}>
                                <div className='after_match_gps_player_name'>{gplayer}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{margin: '0 0 3vh 1vh'}}>
                    <SignUpInput title= "경기 장소"type="text" onChange={(e) => setPlace(e.target.value)} />
                    <SignUpInput title= "경기 일자" type='date' onChange={(e) => setDate(e.target.value)} />
                </div>
                
                {isValid ? <GeneralBtn color='black' children='입력완료' onClick={onSubmitHandler}/> : <GeneralBtn color='white' children='입력완료' onClick={() => alert('필드를 모두 입력해주세요')}/>}
            </div>
        </form>
    );
};

export default AfterMatch;