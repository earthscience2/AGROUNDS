import React, { useEffect, useState } from 'react';
import './RecentMatch.scss';
import location from '../assets/location.png';
import logo from '../assets/logo_sample.png';
import { getMatchListApi } from '../function/MatchApi';
import arrow from '../assets/left.png';

const RecentMatch = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getMatchListApi({'user_code' : sessionStorage.getItem('userCode')})
    .then((response) => {
      setData(response.data.result[0]);
    })
    .catch((error) => console.log(error));
  }, [])
  return (
    <div className='recentmatch'>
      <div className='recentmatch_arrowtitle'>
          <p className='title'>최근 경기</p>
          <img src={arrow} />
      </div>
      <div className='detailbox'>
        <div className='detail'>
          <div className='place'><img src={location} />{data.match_location}</div>
          <p className='fc'>{data.match_title}</p>
          <p className='date'>{data.match_schedule}</p>
        </div>
        <div className='logo'>
          <div className='imgbox'><img className='img' src={data.home_team_logo || logo} /></div>
          <div className='imgbox2'><img className='img' src={data.home_team_logo || logo} /></div>
        </div>
      </div>
    </div>
  );
};

export default RecentMatch;