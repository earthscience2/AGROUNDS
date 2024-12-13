import React, { useState } from 'react';
import '../css/PreferPosition.scss';
import Exit_btn from '../../../components/Exit_btn';
import Prefer_posi from '../../../components/Prefer_posi';
import Circle_common_btn from '../../../components/Circle_common_btn';

const PreferPosition = ({selectedPosition, setSelectedPosition, exit}) => {
  const handlePositionSelect = (position) => {
    if (selectedPosition === position) {
      setSelectedPosition(null);
    } else {
      setSelectedPosition(position);
    }
  };

  const positions = [
    { id: 'LWF', color: '#FD8661' },
    { id: 'ST', color: '#FD7759' },
    { id: 'RWF', color: '#FD6C4F' },
    { id: 'LWM', color: '#92FDAE' },
    { id: 'CAM', color: '#86FDA5' },
    { id: 'RWM', color: '#76FAB4' },
    { id: 'LM', color: '#58F8BD' },
    { id: 'CM', color: '#3CF3C1' },
    { id: 'RM', color: '#1AEFC9' },
    { id: 'LWB', color: '#64D1FC' },
    { id: 'CDM', color: '#01EBD0' },
    { id: 'RWB', color: '#4DD1FF' },
    { id: 'LB', color: '#33CAFE' },
    { id: 'CB', color: '#18CBFC' },
    { id: 'RB', color: '#00C9FE' },
    { id: 'GK', color: '#F7E46D' },
  ];

  return (
    <div className='ppBG'>
      <div className='exitBtn'><Exit_btn exit={exit}/></div>
      <div className='grid'>
        {positions.map((pos) => (
          <Prefer_posi
            key={pos.id}
            backgroundColor={pos.color}
            onClick={() => handlePositionSelect(pos.id)}
            isDimmed={selectedPosition && selectedPosition !== pos.id}
            isSelected={selectedPosition === pos.id}
          >
            {pos.id}
          </Prefer_posi>
        ))}
      </div>
      {selectedPosition ? 
      <Circle_common_btn title='완료' onClick={exit} color='#000000' backgroundColor='#FFFFFF' style={{position:'fixed', bottom:'5vh'}}/> :
      <Circle_common_btn title='포지션 선택을 완료하세요' style={{position:'fixed', bottom:'5vh'}} />}
    </div>
  );
};

export default PreferPosition;
