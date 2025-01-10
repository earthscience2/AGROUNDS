import React from 'react';
import styled from 'styled-components';
import service from '../assets/service.png';

const Service = () => {
  return (
    <ServiceStyle>
      <img src={service} />
      <div style={{marginBottom: '20vh'}}></div>
    </ServiceStyle>
  );
};

export default Service;

const ServiceStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img{
    width: 50%;
    margin-top: 20vh;

  }
`