import styled from 'styled-components';
import RankBox from './RankBox';
import HighBox from './HighBox';
import { useNavigate } from "react-router-dom"


const TeamAnalTotal = ({data}) => {
  const topData = data.total.top_players;
  const myData = data.total.my_rankings;
  
  const navigate = useNavigate();

  return(
    <TeamAnalTotalStyle>
      <div className="title">팀내 항목별 최고 순위</div>
      <div className="high-box">
        <div className="high-column">
          <HighBox img={topData.top_point.profile} position={topData.top_point.position} name={topData.top_point.nickname} title='평점' titleData={topData.top_point.value} km='점' onClick={() => navigate('/app/teamrank', {state: {title: '평점', data: data.ranking.point_ranking}})}/>
          <HighBox img={topData.top_activity.profile} position={topData.top_activity.position} name={topData.top_activity.nickname} title='이동거리' titleData={topData.top_activity.value} km='km' onClick={() => navigate('/app/teamrank', {state: {title: '이동거리', data: data.ranking.activity_ranking}})}/>
          
        </div>
        <div className="high-column">
          <HighBox img={topData.top_sprint.profile} position={topData.top_sprint.position} name={topData.top_sprint.nickname} title='스프린트' titleData={topData.top_sprint.value} km='회' onClick={() => navigate('/app/teamrank', {state: {title: '스프린트', data: data.ranking.sprint_ranking}})}/>
          <HighBox img={topData.top_speed.profile} position={topData.top_speed.position} name={topData.top_speed.nickname} title='최고속력' titleData={topData.top_speed.value} km='km/h' onClick={() => navigate('/app/teamrank', {state: {title: '최고속력', data: data.ranking.speed_ranking}})}/>
        </div>
      </div>
      <div className="title2">나의 순위</div>
      <div className='rank-box'>
        <div className="rank-column">
          <RankBox title='평점' titleData={myData.point.value} rank={myData.point.rank} km={'점'}/>
          <RankBox title='이동거리' titleData={myData.activity.value} rank={myData.activity.rank} km={'km'}/>
        </div>
        <div className="rank-column">
          <RankBox title='스프린트' titleData={myData.sprint.value} rank={myData.sprint.rank} km={'회'}/>
          <RankBox title='최고속력' titleData={myData.speed.value} rank={myData.speed.rank} km={'km/h'}/>
        </div>
      </div>
    </TeamAnalTotalStyle>
  )
}

export default TeamAnalTotal;

const TeamAnalTotalStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2vh;
  width: 100%;
  font-family: 'Pretendard';
  .title{
    width: 90%;
    font-size: 2vh;
    font-weight: 700;
    font-family: 'Pretendard';
    color: #262626;
  }
  .title2{
    width: 90%;
    font-size: 2vh;
    font-weight: 700;
    font-family: 'Pretendard';
    color: #262626;
    margin-top: 5vh;
  }
  .high-box{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 1.5vh;
    margin-top: 3vh;
    .high-column{
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 1.5vh;
    }
  }
  .rank-box{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 1.5vh;
    margin-top: 3vh;
    margin-bottom: 10vh;
    .rank-column{
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 1.5vh;
    }
  }
  
`
