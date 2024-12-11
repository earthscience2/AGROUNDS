import React from 'react';
import styled from 'styled-components';
import Image_Comp from './Image_Comp';

const Member = ({img, player, age, position, color, onClick, isManager=true}) => {
  return (
    <MemberStyle onClick={onClick}>
      {isManager ? (
        <>
          <Image_Comp width="8vh" img={img}/>
          <div className="playerdetail">
            <p className="t3">{player}</p>
            <p className="t4">{age}</p>
            <div className='posi'>
              <div className='dot' style={{backgroundColor: color}}/>
              <p className='position'>{position}</p>
            </div>
          </div>
          <button className='getoutBtn'>추방하기</button>
        </>
        
      ) : (
        <>
          <Image_Comp width="7vh" img={img}/>
          <div className="playerdetail">
            <p className="t3f">{player}</p>
            <p className="t4f">{age}</p>
          </div>
          <div className='posif'>
            <div className='dotf' style={{backgroundColor: color}}/>
            <p className='positionf'>{position}</p>
          </div>
        </>
      )}
    </MemberStyle>
  );
};

export default Member;

const MemberStyle = styled.div`
  display: flex;
  width: 90%;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #E5E9ED;
  padding: 1.5vh 0;
  .playerdetail{
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    width: 50%;
    .t3{
      font-size: 1.9vh;
      font-weight: 500;
      margin: 0;
    }
    .t4{
      font-size: 1.4vh;
      font-weight: 500;
      color: #6F6F6F;
      margin: .5vh 0;
    }
    .t3f{
      font-size: 2.1vh;
      font-weight: 500;
      margin: 1vh 0 0 0;
    }
    .t4f{
      font-size: 1.6vh;
      font-weight: 500;
      color: #6F6F6F;
      margin: 1vh 0;
    }
    .posi{
    display: flex;
    justify-content: center;
    align-items: center;
    .dot{
      width: .6vh;
      height: .6vh;
      border-radius: 50%;
    }
    .position{
      font-size: 1.5vh;
      font-weight: 600;
      margin: .2vh 0 0 .5vh;
    }
  }
  }
  .posif{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 7vh;
    .dotf{
      width: 1vh;
      height: 1vh;
      border-radius: 50%;
    }
    .positionf{
      font-size: 1.8vh;
      font-weight: 600;
      margin-left: 1vh;
    }
  }
  .getoutBtn{
    border: none;
    height: 4vh;
    width: 8vh;
    border-radius: 3vh;
    font-size: 1.5vh;
    font-weight: 600;
  }
`
