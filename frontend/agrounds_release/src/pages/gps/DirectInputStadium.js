import React, { useState } from 'react';
import styled from 'styled-components';
import Back_btn from '../../components/Back_btn';
import Search from '../../components/Search';
import Circle_common_btn from '../../components/Circle_common_btn';

const DirectInputStadium = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const NextBtn = ()=> {

  }

  return (
    <DirectInputStadiumStyle>
      <Back_btn />
      <div className='search'>
        <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} backgroundColor='white' placeholder='장소 또는 주소입력' />
      </div>
      <div className='btn'>
        <Circle_common_btn title='다음' onClick={NextBtn()} />
      </div>
    </DirectInputStadiumStyle>
  );
};

export default DirectInputStadium;

const DirectInputStadiumStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .search{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    position: absolute;
    top: 10vh;
  }
  .btn{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    position: absolute;
    bottom: 10vh;
  }
`