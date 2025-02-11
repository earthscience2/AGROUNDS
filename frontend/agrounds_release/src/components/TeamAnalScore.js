
import styled from 'styled-components';
import user from '../assets/user-grey.png'
import PositionDotColor, { AnalPositionColor } from '../function/PositionColor';
import red from '../assets/rank-red.png';
import blue from '../assets/rank-blue.png';
import green from '../assets/rank-green.png';
import yellow from '../assets/rank-yellow.png';

const TeamAnalScore = ({data}) => {
  const rankingData = data || [];

  const fPosition = data?.[0]?.position || ""

  const backgroundImg = () => {
    if (fPosition === "LWF" || fPosition === "ST" || fPosition === "RWF") {
      return red;
    } else if (fPosition === "LWM" || fPosition === "CAM" || fPosition === "RWM" || fPosition === "LM" || fPosition === "CM" || fPosition === "RM" || fPosition === "CDM") {
      return green;
    } else if (fPosition === "LWB" || fPosition === "RWB" || fPosition === "LB" || fPosition === "CB" || fPosition === "RB" ) {
      return blue;
    } else {
      return yellow;
    }
  }
  return(
    <TeamAnalScoreStyle>
      <div className='teamlist'>
        {rankingData.map((rank, index) => (
          index === 0 ? (
            <div className="first-player" key={rank.nickname} style={{ backgroundImage: `url(${backgroundImg()})` }}>
              <div className='first-player-box'>
                <p className='rank'>1</p>
                <div className='nickpo-box'>
                  <div className='nick'>{rank.nickname}</div>
                  <div className='po-box'>
                    <div className='color' style={{backgroundColor: PositionDotColor(rank.position)}}></div>
                    <div className='po'>{rank.position}</div>
                  </div>
                  <div className='value'>{rank.value}</div>
                </div>
                <div className='img-box'>
                  {rank.profile ? <img src={rank.profile} className='img'/> : <img src={user} className='img'/>}
                </div>
              </div>
            </div>
          ) : (
            <div key={index} className="other-player">
              <p className='rank'>{index + 1}</p>
              <div className='profile-box'>
                <div className='img-box'>
                  {rank.profile ? <img src={rank.profile} className='img'/> : <img src={user} className='img'/>}
                </div>
                
                <div className='nickpo-box'>
                  <div className='nick'>{rank.nickname}</div>
                  <div className='po-box'>
                    <div className='color' style={{backgroundColor: PositionDotColor(rank.position)}}></div>
                    <div className='po'>{rank.position}</div>
                  </div>
                  
                </div>
              </div>
              <div className='value'>{rank.value}</div>
            </div>
          )
        ))}
       
      </div>
    </TeamAnalScoreStyle>
  )
}

export default TeamAnalScore;

const TeamAnalScoreStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1vh;
  .title{
    width: 90%;
    font-size: 2vh;
    font-weight: 700;
    font-family: 'Pretendard';
  }
  .teamlist {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-family: 'Pretendard';
    margin: 2vh 0 5vh 0;
    width: 100%;
    .first-player{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #F2F4F8;
        height: 12vh;
        width: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        .first-player-box{
          width: 85%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          .rank{
            font-size: 2vh;
            font-weight: 700;
            color: white;
          }
          .nickpo-box{
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 60%;
            .nick{
              font-size: 1.9vh;
              font-weight: 700;
              color: white;
              }
            .po-box{
              display: flex;
              justify-content: start;
              align-items: center;
              margin: .5vh 0;
              .color{
                width: .6vh;
                height: .6vh;
                border-radius: 50%;
                border: 1px solid white;
              }
              .po{
                font-size: 1.5vh;
                font-weight: 700;
                color: white; 
                margin-left: .5vh;
              }
            }
            .value{
              font-size: 2.4vh;
              font-weight: 700;
              color: white;
            }
          }
          .img-box{
            height: 7vh;
            width: 7vh;
            border-radius: 50%;
            overflow: hidden; 
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: white;
            .img{
              height: 100%;
              object-fit: cover;
            }
          }
        }
      
    }
    .other-player{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin: auto;
      border-bottom: 1px solid #F2F4F8;
      height: 8vh;
      width: 85%;
      .rank{
        font-size: 2vh;
        font-weight: 700;
      }
      .profile-box{
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 65%;
        .img-box{
          height: 4vh;
          width: 4vh;
          border-radius: 50%;
          overflow: hidden; 
          display: flex;
          justify-content: center;
          align-items: center;
          .img{
            height: 100%;
            object-fit: cover;
          }
        }
        .nickpo-box{
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 2.5vh;
          .nick{
            font-size: 1.8vh;
            font-weight: 700;
            color: #262626;
          }
          .po-box{
            display: flex;
            align-items: center;
            margin: .5vh 0;
            .color{
              border-radius: 50%;
              width: .8vh;
              height: .8vh;
            }
            .po{
              font-size: 1.4vh;
              font-weight: 700;
              color: #393939;
              margin-left: .5vh;
            }
          }
          
        }
      }
      .value{
          font-size: 2.3vh;
          font-weight: 700;
          color: #697077;
          text-align: center;
          min-width: 5vh;
        }
    }
  }
`