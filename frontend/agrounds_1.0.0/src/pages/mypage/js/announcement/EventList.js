import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackTitle_Btn from '../../../../components/BackTitle_Btn';
import paper from '../../../../assets/common/ico_paper.png';
import '../../css/announcement/EventList.scss';

const EventList = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = () => {
      // setList(announcementApi() || []);

    }
    getData();
  }, [])

  return (
    <div className='eventList'>
      <BackTitle_Btn navTitle='이벤트' />
      {list.length ? (
        list.map((announce, index) => (
          <div className='eventebox' key={index} onClick={() => navigate('/app/announce',{state: {contents: announce}})}>
            <p className='eventtitle'>{announce.title}</p>
            <p className='eventdate'>{announce.date}</p>
          </div>
        ))
      )
      : (
        <div className='noevent'>
          <img src={paper} />
          <div>진행중인 이벤트가 없습니다.</div>
        </div>
      )}
    </div>
  );
};

export default EventList;