import React, { useEffect, useState } from 'react';
import device from '../assets/device.png';
import styled from 'styled-components';
import ovr from '../assets/ovr.png';
import location from '../assets/location.png';
import Image_Comp from '../components/Image_Comp';
import BarChart from '../components/BarChart';
import { useNavigate } from 'react-router-dom';
import playlist from '../assets/playlist.png';
import polygon from '../assets/polygon.png';
import { getTeamInfoApi, getTeamPlayerListApi } from './TeamApi';
import LineChart from '../components/LineChart';
import { extractDateInfo, formatDate } from './ Conversion';
import { getTeamMatchList, getVideoSummationApi } from './MatchApi';

const MyTeam = () => {
  const [info, setInfo] = useState([]);
  const [length, setLenght] = useState('');

  useEffect(() => {
    getTeamInfoApi({'team_code' : sessionStorage.getItem('teamCode')})
    .then((response) => {
      setInfo(response.data)
    })
    .catch(error => console.log(error));

    getTeamPlayerListApi({'team_code' : sessionStorage.getItem('teamCode')})
    .then((response) => {
      setLenght(response.data.result)
    })
    .catch(error => console.log(error));

  }, [sessionStorage.getItem('teamCode')])

  function formatDate(input) {
    const date = new Date(input);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}
  return (
    <MyTeamStyle>
      <div className='imgbox'><img className='img' src={info.team_logo} /></div>
      <div className='title'>{info.team_name}</div>
      <div className='detailbox'>
        {/* <p className='detail'>성남시</p>
        <div className='detailline'/> */}
        <p className='detail'>{length.length}명</p>
        <div className='detailline'/>
        <p className='detail'>{formatDate(info.created_at)}</p>
      </div>
    </MyTeamStyle>
  );
};
const NoTeam = () => {
  const navigate = useNavigate();

  return (
    <NoTeamStyle>
      <dib style={{height:'10vh', display:'flex', alignItems: 'center'}}>
        <div className='noteamment'>함께할 팀을 찾고<br/>합류해보세요</div>
      </dib>
      <div className='searchteam' onClick={() => navigate('/app/jointeam')}>팀 찾기</div>
    </NoTeamStyle>
  )
}

const MyOvr = () => {
  return (
    <MyOvrStyle>
      <div className='title'>최근 5경기 평균</div>
      <img className='ovr' src={ovr} />
    </MyOvrStyle>
  );
};
const MatchPlan = () => {
  return (
    <MatchPlanStyle>
      <div className='circleline'>
        <div className='circle'/>
        <div className='circle'/>
        <div className='circle'/>
      </div>
      <div className='detailbox'>
        <p className='date'>10.01(토)</p>
        <p className='fc'>인하대학교 FC</p>
        <p className='place'>인천축구전용경기장</p>
      </div>
    </MatchPlanStyle>
  );
};

const MatchVideo = () => {
  const [videonum, setVideoNum] = useState(0);
  useEffect(() => {
    getVideoSummationApi({'user_code': sessionStorage.getItem('userCode')})
    .then((response) => {
      const num = response.data.player_cam.number_of_videos + response.data.team_cam.number_of_videos + response.data.full_cam.number_of_videos + response.data.highlight_cam.number_of_videos
      setVideoNum(num)
    })
    .catch((error) => {
      console.log(error)
      setVideoNum(0)
    })

  }, [sessionStorage.getItem('userCode')])
  
  return (
    <MatchVideoStyle>
      <div className='videobox'>
        <div className='smallvideobox'/>
        <div className='bigvideobox'><img src={polygon} /></div>
      </div>
      <div className='videocount'><img src={playlist} />{videonum}</div>
    </MatchVideoStyle>
  )
}
const Device = () => {
  return (
    <DeviceStyle>
      <img src={device} className='deviceimg'/>
      <div className='button'>기기 사용법 보기</div>
    </DeviceStyle>
  );
};

const RecentMatchS = ({logo1, logo2}) => {
  const navigate = useNavigate();

  const [match, setMatch] = useState([]);
  useEffect(() => {
    getTeamMatchList({'team_code': sessionStorage.getItem('teamCode')})
    .then((response) => {
      setMatch(response.data.result[0] || [])
    })
  }, [sessionStorage.getItem('teamCode')])

  const formattedDate = match.match_schedule ? formatDate(match.match_schedule) : '';
  const dayOfWeek = match.match_schedule
    ? extractDateInfo(match.match_schedule).dayOfWeek.slice(0, 1)
    : '';

  return (
    <RecentMatchStyle onClick={() => navigate('/app/recentmatch')}>
      <p className='date'>
      {match.match_schedule ? `${formattedDate} (${dayOfWeek})` : '최근 경기가 없습니다.'}
      </p>
      <div className='place'>
        {match ? 
        <>
          <img src={location} />{match.match_location}
        </>
        : 
        <>
          -
        </>
        }
      </div>
        
      <div className='imgbox'>
        <Image_Comp width='6vh' img={match.home_team_logo}/>
        <div className='secimg'>
          <Image_Comp  width='6vh' img={match.away_team_logo}/>
        </div>
      </div>
    </RecentMatchStyle>
  );
};


const AverageScore = ({data, error}) => {
  const [matchData, setMatchData] = useState([]);
  const [recentData, setRecentData] = useState([]);
  
  useEffect(() => {
    setMatchData(data || []);
    setRecentData(data?.recent_match || []);
  }, [data])

  return(
    <AverageScoreStyle>
      <p className='title'>평점지수 추이</p>
      <div className='scorebox'>
        {error 
          ? <p className='score'>0</p>
          : <p className='score'>{matchData.average_point}</p>
        } 
        <p className='scoretitle'>평균 평점</p>
      </div>

      {recentData.map((data) => (
        <div className='allteambox'>
          <div className='teambox'>
            <div className='teambbox'>
              <Image_Comp width="3.5vh" img={data.team_logo}/>
              <p className='date'>{formatDate(data.match_date)}</p>
            </div>
            <div className='colorbbox'>
              <div className='colorbox'></div>
              <p className='colorscore'>{data.point}</p>
            </div>
          </div>
          
        </div>
      ))}
    </AverageScoreStyle>
  )
}

const AttackAve = ({data, error}) => {
  const [attackData, setAttackData] = useState([]);
  const [defenseData, setDefenseData] = useState([]);


  useEffect(() => {
    setAttackData(data?.attack_trend);
    setDefenseData(data?.defense_trend);
    
  }, [data])


  return(
    <AttackAveStyle>
      <p className='title'>공격지수 추이</p>
      <div className='chart'>
        <LineChart data={attackData}/>
      </div>
      <p className='title'>수비지수 추이</p>
      <div className='chart'>
        <LineChart data={defenseData}/>
      </div>
    </AttackAveStyle>
  )
}

const OvrBarChart = ({data, error}) => {
  return(
    <OvrBarChartStyle>
      <BarChart data={data} error={error}/>
    </OvrBarChartStyle> 
  )
}

export {MyTeam, MyOvr, MatchPlan, Device, RecentMatchS, AverageScore, AttackAve, OvrBarChart, NoTeam, MatchVideo};

const MatchVideoStyle = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 1vh;
    .videobox{
      width: 100%;
      height: 90%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 2vh;
      .bigvideobox{
        width: 80%;
        height: 10vh;
        background-color: #697077;
        border-radius: 1vh;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          height: 2.5vh;
        }
      }
      .smallvideobox{
        width: 75%;
        height: 1vh;
        background-color: #697077;
        margin-bottom: 3px;
        border-radius: 2vh 2vh 0 0;
      }
    }
    .videocount{
      width: 6vh;
      height: 4vh;
      background-color: #00000080;
      border-radius: .8vh;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      color: white;
      font-weight: 700;
      font-size: 2vh;
      position: relative;
      font-family: 'Pretendard';
      margin-top: 1vh;
      left: 25%;
      img{
        width: 1.8vh;
        margin-right: .3vh;
      }
    }
`
const MyTeamStyle = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  .imgbox{
    width: 10vh;
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
    margin-top: 3vh;
    .img{
      object-fit: contain;
      width: 10vh;
    }
  }

  .title{
    font-size: 1.8vh;
    font-weight: 600;
    margin: 1vh;
    font-family: 'Pretendard';
  }
  .detailbox{
    display: flex;
    justify-content: center;
    align-items: center;
    
    .detail{
      font-size: 1.4vh;
      margin: 0;
      color: #6F6F6F;
      font-weight: 500;
      font-family: 'Pretendard';
    }
    .detailline{
      width: .1vh;
      height: 1vh;
      background-color: #E0E0E0;
      margin: 0 1vh;
    }
  }
`

const NoTeamStyle = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .noteamment{
    font-size: 1.5vh;
    font-weight: 500;
    color: #333333;
    text-align: center;
    font-family: 'Pretendard';
  }
  .searchteam{
    background-color: #0EAC6A;
    color: white;
    font-weight: 700;
    font-size: 1.8vh;
    border-radius: 3vh;
    margin-top: 2vh;
    font-family: 'Pretendard';
    height: 4vh;
    width: 80%;
    font-size: 1.3vh;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
  }
`
const MyOvrStyle = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .title{
    width: 80%;
    color: #21272A;
    font-size: 1.4vh;
    font-weight: 500;
    color:#E5E9ED;
    margin: -1vh 0 2vh 0;
    font-family: 'Pretendard';
  }
  .ovr{
    height: 14vh;
    margin-top: -1vh;;
  }
`

const MatchPlanStyle = styled.div`
  width: 100%;
  height: 60%;
  margin-top: 10%;
  display: flex;
  justify-content: center;
  .circleline{
    height: 100%;
    width: 1px;
    background-color: #FFFFFF;
    opacity: 40%;
    padding: 0 0 4vh 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
    bottom: -2.2vh;
    .circle{
      width: .9vh;
      height: .9vh;
      background-color: white;
      border-radius: 50%;
      background-color: #FFFFFF;
      opacity: 40%;
      &:nth-child(1){
        background-color: white;
        opacity: 100%;
      }
    }
  }
  .detailbox{
    margin-left: 2vh;
    .date{
      font-size: 1.5vh;
      color: #A2A9B0;
      margin: 1.2vh 0;
    }
    .fc{
      font-size: 1.9vh;
      font-weight: 700;
      margin: 1vh 0;
    }
    .place{
      font-size: 1.6vh;
      font-weight: 500;
      margin: 1vh 0;
    }
  }

`
const DeviceStyle = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .title{
    color: white;
    font-size: 1.6vh;
  }
  .deviceimg{
    height: 40%;
    
  }
  .button{
    background-color: white;
    color: black;
    border-radius: 3vh;
    height: 4vh;
    width: 80%;
    font-size: 1.3vh;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2vh;
  }
`

const RecentMatchStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 80%;
  .date{
    font-size: 1.3vh;
    font-weight: 400;
    font-family: 'Pretendard';
    color: #6F6F6F;
    margin: 1vh 0;
  }
  .place{
    font-size: 1.5vh;
    font-weight: 500;
    font-family: 'Pretendard';
    color: #6F6F6F;
    margin: 1vh 0;
    display: flex;
    align-items: center;
    & > img{
      height: 1.7vh;
      margin-right: .5vh;
    }
  }
  .imgbox{
    display: flex;
    margin-top: 7vh;
    .secimg{
      position: relative;
      right: 1.5vh;
    }
  }
`

const AverageScoreStyle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    font-size: 1.8vh;
    font-weight: 700;
    font-family: 'Pretendard';
    width: 80%;
    margin: 2vh 0 1vh 0;
  }
  .scorebox{
    display: flex;
    width: 80%;
    align-items: end;
    .score{
      font-size: 3vh;
      font-weight: 700;
      font-family: 'Pretendard';
      margin: 0;
    }
    .scoretitle{
      font-size: 1.4vh;
      font-weight: 700;
      font-family: 'Pretendard';
      color: #A8A8A8;
      margin: 0 1vh .3vh 1vh; 
    }
  }
  .allteambox{
    display: flex;
    flex-direction: column;
    width: 84%;
    margin-top: 1vh;
    .teambox{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .teambbox{
        display: flex;
        align-items: center;
        .date{
          font-size: 1.5vh;
          font-weight: 700;
          font-family: 'Pretendard';
          color: #8D8D8D;
          margin: 1.2vh 0 1vh 1vh;
        }
      }
      .colorbbox{
        display: flex;
        align-items: center;
        .colorbox{
          width: .8vh;
          height: .8vh;
          background-color: #20CBAD;
          margin: auto;
        }
        .colorscore{
          margin: 1.2vh 0 1vh .7vh;
          font-size: 1.6vh;
          font-weight: 500;
          color: #525252;
        }
      }
    }
  }
`

const AttackAveStyle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title{
    font-size: 1.8vh;
    font-weight: 700;
    font-family: 'Pretendard';
    width: 80%;
  }
  .chart{
    width: 80%;
    height: 20%;
  }
`

const OvrBarChartStyle = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`