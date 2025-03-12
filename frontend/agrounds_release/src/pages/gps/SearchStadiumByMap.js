import React, { useState } from 'react';
import styled from 'styled-components';
import Back_btn from '../../components/Back_btn';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import FullModal from '../../components/FullModal';
import Circle_common_btn from '../../components/Circle_common_btn';

const SearchStadiumByMap = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <SearchStadiumByMapStyle>
      <Back_btn />
      <Map 
        center={{ lat: 33.450701, lng: 126.570667 }}
        style={{ width: '100%', height: '100%' }}
        level={3}
        onCreate={() => setIsLoaded(true)}
      >
        {isLoaded && (
          <MapMarker position={{ lat: 33.450701, lng: 126.570667 }}>
            <div style={{ color: "#000" }}>here</div>
          </MapMarker>
        )}
      </Map>
      <Modal>
        <div>용인시 축구센터</div>
        <Circle_common_btn title={'경기장으로 설정'}/>
      </Modal>
    </SearchStadiumByMapStyle>
  );
};

export default SearchStadiumByMap;

const SearchStadiumByMapStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
`

const Modal = styled.div`
  width: 100%;
  height: 30vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  position: fixed;
  bottom: 0;
  border-radius: 3vh 3vh 0 0;
  z-index: 10;
`