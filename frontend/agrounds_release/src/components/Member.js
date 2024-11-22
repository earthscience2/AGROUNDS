import React from 'react';
import styled from 'styled-components';
import Image_Comp from './Image_Comp';

const Member = ({img, player, age, position, color, onClick}) => {
  return (
    <MemberStyle onClick={onClick}>
      <Image_Comp width="6vh" img={img}/>
      <div className="playerdetail">
        <p className="t3">{player}</p>
        <p className="t4">{age}</p>
      </div>
      <div className='posi'>
        <div className='dot' style={{backgroundColor: color}}/>
        <p className='position'>{position}</p>
      </div>
    </MemberStyle>
  );
};

export default Member;

const MemberStyle = styled.div`
  display: flex;
  width: 85%;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #E5E9ED;
  padding: 1.5vh 0;
  .playerdetail{
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    max-width: 20%;
    .t3{
      font-size: 2.1vh;
      font-weight: 500;
      margin: 1vh 0 0 0;
    }
    .t4{
      font-size: 1.6vh;
      font-weight: 500;
      color: #6F6F6F;
      margin: 1vh 0;
    }
  }
  .posi{
    display: flex;
    justify-content: center;
    align-items: center;
    .dot{
      width: 1vh;
      height: 1vh;
      border-radius: 50%;
    }
    .position{
      font-size: 1.8vh;
      font-weight: 600;
      margin-left: 1vh;
    }
  }
`