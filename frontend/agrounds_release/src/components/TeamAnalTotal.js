import styled from 'styled-components';
import RankBox from './RankBox';
import HighBox from './HighBox';


const TeamAnalTotal = ({data}) => {
  return(
    <TeamAnalTotalStyle>
      <div className="title">팀내 항목별 최고 순위</div>
      <div className="high-box">
        <div className="high-column">
          <HighBox img='' name='최현우' title='평점' titleData='9.3' km=''/>
          <HighBox img='' name='최현우' title='활동량' titleData='7.75' km='km'/>
          
        </div>
        <div className="high-column">
          <HighBox img='' name='최현우' title='스프린트' titleData='36.79' km='m'/>
          <HighBox img='' name='최현우' title='속력' titleData='26.17' km='km/h'/>
        </div>
      </div>
      <div className="title2">나의 순위</div>
      <div className='rank-box'>
        <div className="rank-column">
          <RankBox title='평점' titleData='4.5' rank='5' />
          <RankBox title='활동량' titleData='3.5' rank='10' km={true}/>
        </div>
        <div className="rank-column">
          <RankBox title='스프린트' titleData='33.21' rank='2' km={true}/>
          <RankBox title='속력' titleData='20.33' rank='9' km={true}/>
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
  font-family: 'Pretendard-Regular';
  .title{
    width: 90%;
    font-size: 2vh;
    font-weight: 700;
    font-family: 'Pretendard-Regular';
    color: #262626;
  }
  .title2{
    width: 90%;
    font-size: 2vh;
    font-weight: 700;
    font-family: 'Pretendard-Regular';
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
