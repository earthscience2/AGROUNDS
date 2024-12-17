import React, { useEffect, useState } from 'react';
import Back_btn from '../../../components/Back_btn';
import '../css/RecentMatch.scss';
import { getMatchListApi, getTeamMatchList } from '../../../function/MatchApi';
import paper from '../../../assets/ico_paper.png';

import { extractDateInfo } from '../../../function/ Conversion';

const RecentMatch = () => {
  const [ activeTab, setActiveTab] = useState('개인');
  const [matchList, setMatchList] = useState([]);
  const [teamMatchList, setTeamMatchList] = useState([]);

  const handleTabClick = (active) => {
    setActiveTab(active)
  }

  useEffect(() => {
    getMatchListApi({'user_code' : sessionStorage.getItem('userCode')})
    .then((response) => {
      setMatchList(response.data.result || [])
      console.log(response.data)
    })
    .catch((error) => console.log(error));

    getTeamMatchList({'team_code' : sessionStorage.getItem('teamCode')})
      .then((response) => {
        setTeamMatchList(response.data.result || []);
      })
      .catch((error) => console.log(error));
    
  }, [])
  return (
    <div className='recentmatchback'>
      <Back_btn />
      <p className='recenttitle'>최근 경기</p>
      <div className='tab-background'>
        <div className='tabs-back'>
          <button key={'개인'}
            className={`tab ${activeTab === '개인' ? "active" : ""}`}
            onClick={() => handleTabClick(`개인`)}
          >
            개인
          </button>
          <button key={'팀'}
            className={`tab ${activeTab === '팀' ? "active" : ""}`}
            onClick={() => handleTabClick('팀')}
          >
            팀
          </button>
        </div>
      </div>

      <div className='recentlist'>
        {activeTab === '개인' ? (
          matchList.length === 0 ? (
            <>
              <div className='anal-nocontents'>
                <img src={paper} />
                <p className='anal-contenttitle'>경기 내역이 없습니다</p>
                <div className='anal-content'>경기를 하고 에이그라운즈에서 제공하는<br/> 분석 데이터를 받아보세요!</div>
              </div>
            </>
          ) : (
            matchList.map((match) => {
              const { month, day, dayOfWeek } = extractDateInfo(match.match_schedule || ''); // 날짜 정보 추출
  
              return (
                <div key={match.match_code} className='recent-contentbox'>
                  <div className='datebox'>
                    <div className='monthbox'>{`${month}월`}</div>
                    <div className='daybox'>
                      <span className='daybox-day'>{day}</span>
                      <span className='daybox-week'>{dayOfWeek}</span>
                    </div>
                  </div>
                  <div className='extrabox'>
                    <div className='matchthumbnail'>
                      <img src={match.thumbnail} alt='Match Thumnail' />
                    </div>
                    <div className='matchlocationbox'>
                      <div className='matchlocationdot'></div>
                      <p className='matchlocation'>{match.match_location}</p>
                    </div>
                    <p className='matchtitle'>{match.match_title}</p>
                  </div>
                </div>
              );
            })
          )

        ) : (
          teamMatchList.length === 0 ? (
            <>
              <div className='anal-nocontents'>
                <img src={paper} />
                <p className='anal-contenttitle'>경기 내역이 없습니다</p>
                <div className='anal-content'>경기를 하고 에이그라운즈에서 제공하는<br/> 분석 데이터를 받아보세요!</div>
              </div>
            </>
          ) : (
            teamMatchList.map((match) => {
              const { month, day, dayOfWeek } = extractDateInfo(match.match_schedule || ''); 
  
              return (
                <div key={match.match_code} className='recent-contentbox'>
                  <div className='datebox'>
                    <div className='monthbox'>{`${month}월`}</div>
                    <div className='daybox'>
                      <span className='daybox-day'>{day}</span>
                      <span className='daybox-week'>{dayOfWeek}</span>
                    </div>
                  </div>
                  <div className='extrabox'>
                    <div className='matchthumbnail'>
                      <img src={match.thumbnail} alt='Match Thumnail' />
                    </div>
                    <div className='matchlocationbox'>
                      <div className='matchlocationdot'></div>
                      <p className='matchlocation'>{match.match_location}</p>
                    </div>
                    <p className='matchtitle'>{match.match_title}</p>
                  </div>
                </div>
              );
            })
          )
        )}
      
      </div>
    </div>
  );
};

export default RecentMatch;