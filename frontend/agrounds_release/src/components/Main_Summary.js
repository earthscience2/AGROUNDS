import React from 'react';
import './Main_Summary.scss';

const MainSummary = () => {
  return (
    <div className='mainsummary'>
      <div className='infobox'>
        <div className='info'>
          <p className='age'>만 32세</p>
          <p className='name'>손흥민</p>
        </div>
        <div className='position'>LWF</div>
      </div>
      <div className='playbox'>
        <p className='datetitle'>최근 경기일</p>
        <div className='bottombox'>
          <p className='date'>2024.08.20</p>
          <p className='detail'>자세히 보기</p>
        </div>
      </div>
    </div>
  );
};

export default MainSummary;