import React, { useEffect, useState } from 'react';
import MatchPlan from '../../components/match-plan/match_plan';
import './after_match.scss';
import Textinput from '../../components/textintput/textinput';
import client from '../../clients';
import GeneralBtn from '../../components/button/generalBtn';
import classNames from 'classnames';
import { useNavigate, useLocation, UNSAFE_ErrorResponseImpl } from 'react-router-dom';
import GoBack from '../../assets/go-back-icon.png';
import SignUpInput from '../../components/textintput/sign_up_input';
import Nav from '../../components/general/nav';

const AfterMatch = () => {
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [teamList, setTeamList] = useState([]);
    const [attend, setAttend] = useState([]);
    const [attendName, setAttendName] = useState([]);
    const [date, setDate] = useState(null);
    const [place, setPlace] = useState('');
    const [gpsPlayer, setGpsPlayer] = useState([]);
    const [home, setHome] = useState('');
    const [away, setAway] = useState('');
    const [gpsPlayerCode, setGpsPlayerCode] = useState([]);
    const navigate = useNavigate();
    const {state} = useLocation();
    const {matchCode} = state;

    const matchcode = {
        'v2_match_code': matchCode
    }
    const teamcode = {
        'v2_team_code': sessionStorage.getItem('teamcode')
    }

    const homeScoreField = (e) => {
        if (e.target.value < 0) {
            alert('점수는 0 이상이어야 합니다.')
        } else {
            setHomeScore(e.target.value)
        }
    }
    const awayScoreField = (e) => {
        if (e.target.value < 0) {
            alert('점수는 0 이상이어야 합니다.')
        } else {
            setAwayScore(e.target.value)
        }
    }
    useEffect(() => {
        client.post('/api/V2match/searchbymatchcode/', matchcode)
        .then(function(response){
            setHome(response.data.v2_match_home);
            setAway(response.data.v2_match_away);
            setPlace(response.data.v2_match_location);
            setDate(response.data.v2_match_schedule);
        })
        .catch(function(error){
            console.log(error);
        })
        client.post('/api/V2team/searchbycode/', teamcode)
            .then(function (response) {
                setTeamList(response.data.v2_team_players_detail);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const addPlayerToAttend = (playercode, playername) => {
        setAttend((prevAttend) => {
            if (prevAttend.some(p => p.code === playercode)) {
                return prevAttend.filter(p => p.code !== playercode);
            } else {
                return [...prevAttend, { code: playercode, name: playername }];
            }
        });
        setAttendName(attend.map((user) => (
            user.code
        )))
    };

    const GpsPlayerAttend = (gplayer) => {
        const player = attend.find(p => p.code === gplayer);
        setGpsPlayer((prevGpsPlayer) => {
            if (prevGpsPlayer.some(p => p.code === gplayer)) {
                return prevGpsPlayer.filter(p => p.code !== gplayer);
            } else {
                return [...prevGpsPlayer, player];
            }
        });
        setGpsPlayerCode((prevGpsPlayerCode) => {
            if (prevGpsPlayerCode.includes(gplayer)) {
                return prevGpsPlayerCode.filter(p => p !== gplayer);
            } else {
                return [...prevGpsPlayerCode, gplayer];
            }
        });
    };

    const onSubmitHandler = () => {
        const afterMatchData = {
            "v2_match_code": matchCode,
            "v2_match_result": [homeScore, awayScore],
            "v2_match_players": attendName,
            "v2_match_GPSplayers": gpsPlayerCode,
            "v2_match_location": place,
            "v2_match_schedule": date
        }
        client.post('/api/V2match/aftermatch/', afterMatchData)
            .then(function (response) {
                alert('경기 결과를 성공적으로 입력했습니다!');
                navigate(-1);
            })
            .catch(function (error) {
                alert('필드를 모두 입력해주세요.');
            });
    }
    const isValid = homeScore && awayScore && attend.length && gpsPlayer.length ;

    return (
        <form onSubmit={onSubmitHandler}>
            <div className='after_match_background'>
                <Nav />
                <MatchPlan myTeam={home} teamName={away} place={place} date={date} homeScore={homeScore} awayScore={awayScore} />
                <div className='after_match_score_inputbox'>
                    <div className='after_match_score'>Score<p className='after_match_score_essencial'>*</p></div>
                    <div className='after_match_score_input'>
                        <Textinput size='small' placeholder='Home Score' type='number' onChange={homeScoreField} />
                        <div className='after_match_score_input_-'>-</div>
                        <Textinput size='small' placeholder='Away Score' type='number' onChange={awayScoreField} />
                    </div>
                </div>
                <div className='after_match_score_playerbox'>
                    <div className='after_match_player_title'>참여자 선택<p className='after_match_player_title_essencial'>*</p><div className='after_match_player_title_number'>{attend.length} 명</div></div>
                    <div className='after_match_player_list'>
                        {teamList.map((player, index) => (
                            <div className={`after_match_player ${attend.some(p => p.code === player.user_code) ? 'selected' : ''}`} key={index} onClick={() => addPlayerToAttend(player.user_code, player.user_name)}>
                                <div className='after_match_player_name'>{player.user_name}/{player.user_position}/{player.user_height}/{player.user_weight}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='after_match_score_gps_playerbox'>
                    <div className='after_match_gps_player_title'>GPS 사용자 선택<p className='after_match_gps_player_title_essencial'>*</p><div className='after_match_gps_player_title_number'>{gpsPlayer.length} 명</div></div>
                    <div className='after_match_gps_player_list'>
                        {attend.map((gplayer, index) => (
                            <div className={`after_match_gps_player ${gpsPlayerCode.includes(gplayer.code) ? 'selected' : ''}`} key={index} onClick={() => GpsPlayerAttend(gplayer.code)}>
                                <div className='after_match_gps_player_name'>{gplayer.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ margin: '0 0 3vh 1vh' }}>
                    <SignUpInput title="경기 장소" type="text" onChange={(e) => setPlace(e.target.value)} />
                    <SignUpInput title="경기 일자" type='date' onChange={(e) => setDate(e.target.value)} />
                </div>
                {isValid ? <GeneralBtn color='black' children='입력완료' onClick={onSubmitHandler} /> : <GeneralBtn color='white' children='입력완료' onClick={() => alert('필드를 모두 입력해주세요')} />}
            </div>
        </form>
    );
};

export default AfterMatch;
