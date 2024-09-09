import React from 'react';
import styled from 'styled-components';

const summary = {
  all: '선수는 을미기 체육공원 축구장에서 총 5.85km를 이동하며 62분간 경기를 소화했습니다. 평균 속력은 5.62km/h로 안정적인 성과를 보였으며, 최고 속력에 도달한 시점은 3쿼터의 27.4km/h입니다. 모든 쿼터에서 방향 전환 횟수는 다소 높았으며, 특히 1쿼터에서 18회의 90~135도 방향전환을 기록했 습니다. 스프린트는 총 10회 발생하였고, 평균 스프린트 속력은 22.3km/h로 강력한 스프린트 능력을 보여주었습니다. 전반적으로 선수는 전 경기에서 활동 범위와 스프린트 적중률을 유지하며 적극적인 플레이를 선보였습니다.',
  attack: '공격 면에서 선수는 총 3.24km를 이동하며, 2쿼터에서 가장 높은 공격 비율인 76%를 기록했습니다. 평균 속력은 5.81km/h로, 공격 시 더욱 향상된 속력을 보였으며, 최고 속력은 1쿼터와 2쿼터에서 각각 26.17km/h로 두 번 기록했습니다. 공격 시 방향 전환은 39회를 기록하며 기민한 움직임을 유지하였고, 2쿼터에서는 공격 점수 4.4를 기록했습니다. 이처럼, 선수는 공격 전환에서 탄력 있는 움직임을 통해 공격 기술과 속도를 잘 결합했습니다.',
  defence: '수비 부문에서 선수는 총 2.52km를 이동했으며, 경기 시간에 비해 수비적 활동이 다소 낮은 편이었습니다. 특히 3쿼터에서 수비 평점 1.3을 기록하며, 수비 강도가 떨어지는 경향을 보였습니다. 수비 시 평균 속력은 4.14km/h로 낮았고, 방향 전환 횟수 또한 10회로 제한적이었습니다. 수비적으로 4.0의 낮은 점수를 기록한 것은 개선이 필요한 지역으로, 공격적인 플레이와는 다른 세심함이 필요합니다. 전반적으로 수비 기여도가 부족했던 점이 아쉬운 결과로 남았습니다',
}
const Summary = ({ activePosition }) => {
  const summaryContents = () => {
    switch (activePosition) {
      case '공격':
        return summary.attack;
      case '수비':
        return summary.defence;
      case '전체':
        return summary.all;
      default:
        return summary.all;
    }
  }
  
  return (
    <SummaryStyle>
      <p>AI 요약</p>
      <span>{summaryContents()}</span>
    </SummaryStyle>
  );
};

export default Summary;

const SummaryStyle = styled.div`
  background-color: #F5F5F5;
  padding: 2vh 4vh;
  p {
    margin: 2vh 0;
    font-size: 2.5vh;
    font-weight: 600;
  }
  span {
    font-size: 1.6vh;
    line-height: 1.5;
  }
`