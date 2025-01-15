import React, { useEffect, useState } from 'react';
import '../../css/announcement/AnnouncementList.scss';
import BackTitle_Btn from '../../../../components/BackTitle_Btn';
import { announcementApi } from '../../../../function/MyPageApi';
import { useNavigate } from 'react-router-dom';
import paper from '../../../../assets/ico_paper.png';

const AnnouncementList = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = () => {
      setList(announcementApi() || []);

    }
    getData();
  }, [])

  return (
    <div className='announcementList'>
      <BackTitle_Btn navTitle='공지사항' />
      {list.length ? (
        list.map((announce, index) => (
          <div className='announcebox' key={index} onClick={() => navigate('/app/announce',{state: {contents: announce}})}>
            <p className='anntitle'>{announce.title}</p>
            <p className='anndate'>{announce.date}</p>
          </div>
        ))
      )
      : (
        <div className='noannounce'>
          <img src={paper} />
          <div>공지사항이 없습니다.</div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementList;