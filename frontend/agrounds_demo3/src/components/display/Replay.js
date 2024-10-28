import React from 'react';
import styled from 'styled-components';
import Replay1 from '../../assets/display/playanal/Q1/replay.mp4';
import Replay2 from '../../assets/display/playanal/Q2/replay.mp4';
import Replay3 from '../../assets/display/playanal/Q3/replay.mp4';

const Replay = ({activePosition}) => {

  const quarter = () => {
    switch (activePosition) {
      case '1쿼터':
        return Replay1;
      case '2쿼터':
        return Replay2;
      case '3쿼터':
        return Replay3;
      default:
      return Replay1;
    }
    }
  return (
    <VideoWrapper>
      <p>리플레이</p>
      <video width="300" controls>
        <source src={quarter()} type="video/mp4" />
        비디오를 재생할 수 없습니다.
      </video>
    </VideoWrapper>
  );
};

export default Replay;

const VideoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5vh;
  background-color: #D9D9D9;
  font-size: 1.8vh;
  font-weight: 600;
`;