import React from 'react';
import device from '../assets/device.png';
import styled from 'styled-components';
import ovr from '../assets/ovr.png';
import logo from '../assets/logo_sample.png';
import location from '../assets/location.png';
import Image_Comp from '../components/Image_Comp';
import BarChart from '../components/BarChart';
import { useNavigate } from 'react-router-dom';
import playlist from '../assets/playlist.png';
import polygon from '../assets/polygon.png';

const MyTeam = () => {
  return (
    <MyTeamStyle>
      <div className='imgbox'><img className='img' src={logo} /></div>
      <div className='title'>Tottenham</div>
      <div className='detailbox'>
        {/* <p className='detail'>성남시</p>
        <div className='detailline'/> */}
        <p className='detail'>17명</p>
        <div className='detailline'/>
        <p className='detail'>24.09.21</p>
      </div>
    </MyTeamStyle>
  );
};
const NoTeam = () => {
  const navigate = useNavigate();

  return (
    <NoTeamStyle>
      <div className='noteamment'>함께할 팀을 찾고<br/>합류해보세요</div>
      <div className='noteambtn' onClick={() => navigate('/jointeam')}>팀 찾기</div>
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
  return (
    <MatchVideoStyle>
      <div className='videobox'>
        <div className='smallvideobox'/>
        <div className='bigvideobox'><img src={polygon} /></div>
      </div>
      <div className='videocount'><img src={playlist} />3</div>
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
  return (
    <RecentMatchStyle>
      <p className='date'>09.10(토)</p>
      <div className='place'><img src={location} />인하대학교 운동장</div>
      <div className='imgbox'>
        <Image_Comp width='5vh' img={logo1}/>
        <div className='secimg'>
          <Image_Comp  width='5vh' img={logo2}/>
        </div>
      </div>
    </RecentMatchStyle>
  );
};


const AverageScore = () => {
  return(
    <AverageScoreStyle>
      <p className='title'>평점지수 추이</p>
      <div className='scorebox'>
        <p className='score'>7.2</p>
        <p className='scoretitle'>평균 평점</p>
      </div>
      <div className='allteambox'>
        <div className='teambox'>
          <div className='teambbox'>
            <Image_Comp width="4vh" img={logo}/>
            <p className='date'>09.22</p>
          </div>
          <div className='colorbbox'>
            <div className='colorbox'></div>
            <p className='colorscore'>6.8</p>
          </div>
        </div>
        <div className='teambox'>
          <div className='teambbox'>
            <Image_Comp width="4vh" img={logo}/>
            <p className='date'>09.22</p>
          </div>
          <div className='colorbbox'>
            <div className='colorbox'></div>
            <p className='colorscore'>6.8</p>
          </div>
        </div>
        <div className='teambox'>
          <div className='teambbox'>
            <Image_Comp width="4vh" img={logo}/>
            <p className='date'>09.22</p>
          </div>
          <div className='colorbbox'>
            <div className='colorbox'></div>
            <p className='colorscore'>6.8</p>
          </div>
        </div>
      </div>
    </AverageScoreStyle>
  )
}

const AttackAve = () => {
  return(
    <AttackAveStyle>
      <p className='title'>공격지수 추이</p>
      <div className='chart'></div>
      <p className='title'>수비지수 추이</p>
      <div className='chart'></div>
    </AttackAveStyle>
  )
}

const OvrBarChart = () => {
  return(
    <OvrBarChartStyle>
      <BarChart />
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
    .videobox{
      width: 100%;
      height: 90%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 2vh;
      .bigvideobox{
        width: 90%;
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
        width: 80%;
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
      font-family: 'Pretendard-Regular';
      margin-top: 1vh;
      left: 30%;
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
    margin-top: 1vh;
    .img{
      object-fit: contain;
      width: 10vh;
    }
  }

  .title{
    font-size: 1.8vh;
    font-weight: 600;
    margin: 1vh;
    font-family: 'Pretendard-Regular';
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
      font-family: 'Pretendard-Regular';
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
    font-family: 'Pretendard-Regular';
  }
  .noteambtn{
    background-color: #0EAC6A;
    color: white;
    font-weight: 700;
    font-size: 1.8vh;
    margin-top: 3vh;
    margin-bottom: -3vh;
    border-radius: 3vh;
    font-family: 'Pretendard-Regular';
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
    font-family: 'Pretendard-Regular';
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
    color: #6F6F6F;
    margin: .5vh 0;
  }
  .place{
    font-size: 1.5vh;
    font-weight: 500;
    color: #6F6F6F;
    margin: 1vh 0;
    display: flex;
    align-items: center;
    & > img{
      height: 1.5vh;
    }
  }
  .imgbox{
    display: flex;
    margin-top: 8vh;
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
    width: 80%;
  }
  .scorebox{
    display: flex;
    width: 80%;
    align-items: end;
    .score{
      font-size: 3.5vh;
      font-weight: 700;
      margin: 0;
    }
    .scoretitle{
      font-size: 1.5vh;
      font-weight: 500;
      color: #A8A8A8;
      margin: 0 1vh; 
    }
  }
  .allteambox{
    display: flex;
    flex-direction: column;
    width: 80%;
    margin-top: 2vh;
    .teambox{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .teambbox{
        display: flex;
        align-items: center;
        .date{
          font-size: 1.5vh;
          font-weight: 500;
          color: #8D8D8D;
          margin: 1.2vh 0 1vh 1vh;
        }
      }
      .colorbbox{
        display: flex;
        align-items: center;
        .colorbox{
          width: .7vh;
          height: .7vh;
          background-color: #20CBAD;
          margin: auto;
        }
        .colorscore{
          margin: 1.2vh 0 1vh .7vh;
          font-size: 1.7vh;
          font-weight: 500;
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
`