import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Back_btn from "../../components/Back_btn";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Circle_common_btn from "../../components/Circle_common_btn";
import { useLocation, useNavigate } from "react-router-dom";
import { getCoordinate } from "../../function/api/gps/gpsApi";
import { useFieldContext } from "../../function/Context";

const SearchStadiumByMap = () => {
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [center, setCenter] = useState(null); 
  const [gpsX, setGpsX] = useState();
  const [gpsY, setGpsY] = useState();

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const { updateFieldData } = useFieldContext();

  const handleNext = () => {
    if (!state?.groundCode) {
      console.error("groundCode가 없습니다.");
      return;
    }
    updateFieldData({ ground_code: state.groundCode });
    navigate('/app/selectrest'); 
  };

  // 첫 번째 useEffect: getCoordinate 호출
  useEffect(() => {
    getCoordinate({ "ground_code": state.groundCode })
      .then((response) => {
        setGpsX(response.data.x);
        setGpsY(response.data.y);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [state.groundCode]);

  // 두 번째 useEffect: 카카오맵 API 로드 후 center 설정
  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        setIsApiLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_KEY}&autoload=false`;
      script.async = true;
      script.onload = () => {
        setTimeout(() => {
          if (window.kakao && window.kakao.maps) {
            setIsApiLoaded(true);
          } else {
            console.error("Kakao Maps API failed to load");
          }
        }, 500);
      };

      script.onerror = () => {
        console.error("Failed to load Kakao Maps API");
      };
      document.head.appendChild(script);
    };

    loadKakaoMap();
  }, []);  // 카카오맵 API 로드는 한 번만 실행

  // gpsX, gpsY 값이 변경되었을 때, center를 업데이트
  useEffect(() => {
    if (gpsX !== undefined && gpsY !== undefined) {
      setCenter({ lat: gpsX, lng: gpsY });
    }
  }, [gpsX, gpsY]);  // gpsX와 gpsY가 변경될 때마다 실행

  return (
    <SearchStadiumByMapStyle>
      <Back_btn />
      <MapContainer>
        {isApiLoaded && center ? (
          <Map
            center={center}
            style={{ width: "100%", height: "100%" }}
            level={3}
            onCenterChanged={(map) => {
              const newCenter = map.getCenter();
              setCenter({ lat: newCenter.getLat(), lng: newCenter.getLng() });
            }}
          >
            <MapMarker position={center} style={{ backgroundColor: '#0EAC6A' }} />
          </Map>
        ) : (
          <div>Loading...</div>
        )}
      </MapContainer>
      <Modal>
        <div className="title">용인시 축구센터</div>
        <div className="date">선택한 경기일자</div>
        <Circle_common_btn title={"경기장으로 설정"} onClick={handleNext} />
      </Modal>
    </SearchStadiumByMapStyle>
  );
};

export default SearchStadiumByMap;

// Styled Components
const SearchStadiumByMapStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  font-family: "regular";
`;

const MapContainer = styled.div`
  width: 100%;
  flex: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -5vh;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 500px;
  height: 27vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  background-color: white;
  position: fixed;
  bottom: 0;
  border-radius: 4vh 4vh 0 0;
  z-index: 10;
  font-family: "regular";
  box-shadow: 0px 0px 36px rgba(0, 0, 0, 0.08);

  .title {
    font-size: 2vh;
    width: 85%;
    font-weight: 700;
    margin: 3vh 0 1vh 0;
    padding: 2vh 0 0 0;
  }
  .date{
    color: #525252;
    font-size: 1.8vh;
    font-weight: 500;
    width: 85%;
    margin: 0 0 3vh 0;
  }
`;

