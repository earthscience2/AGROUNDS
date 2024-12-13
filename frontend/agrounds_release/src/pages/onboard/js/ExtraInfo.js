import React, { useEffect, useState } from 'react';
import '../css/ExtraInfo.scss';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import Login_input from '../../../components/Login_input';
import CircleBtn from '../../../components/Circle_common_btn';
import right from '../../../assets/right.png';
import { useLocation, useNavigate } from 'react-router-dom';
import PreferPosition from './PreferPosition';
import client from '../../../client';

const ExtraInfo = () => {
  const navigate = useNavigate();

  const [viewPosition, setViewPosition] = useState(false);

  const [userWeight, setUserWeight] = useState();
  const [userHeight, setUserHeight] = useState();
  const [selectedPosition, setSelectedPosition] = useState(null);

  const [errorNum, setErrorNum] = useState(1); //0: 정상, 1: 몸무게 에러, 2: 신장 에러, 3: 포지션 에러

  const location = useLocation();
  const receivedFormData = location.state;

  function vaildUserWeight(userWeight){
    return userWeight >= 10 && userWeight <= 220
  }

  function vaildUserHeight(userHeight){
    return userHeight >= 10 && userHeight <= 220
  }

  useEffect(()=>{
    if(!vaildUserWeight(userWeight)) {
      setErrorNum(1);
    }
    if(!vaildUserHeight(userHeight)) {
      setErrorNum(2);
    }
    if(vaildUserHeight(userHeight) && vaildUserWeight(userWeight) && selectedPosition){
      setErrorNum(0);
    }
  }, [userWeight, userHeight, selectedPosition])

  const onNext = () => {
    if(errorNum===0 && selectedPosition) {
      const formData = {
        "user_weight" : userWeight,
        "user_height" : userHeight,
        "user_position" : selectedPosition
      };
  
      const mergedFormData = {...receivedFormData, ...formData};
  
      console.log(mergedFormData);

      client.post('/api/login/kakao/signup/', mergedFormData).then((res)=>{
        console.log(res);
        navigate('/completesignup')
      }).catch((err)=>{
        console.log(err);
        alert("회원가입 실패. agronds 팀에 문의부탁드립니다.");
      });
    }
  }
  
  return (
    <div className='extraBG'>
      <Back_btn />
      <Login_title title='추가정보 입력' explain='분석을 위해 필요한 정보로 외부에 공개되지 않아요.' />
      <Login_input borderRadius='15px 15px 0 0' placeholder='몸무게' type='number' value={userWeight} setVale={setUserWeight}/>
      <div style={{height: '0.5vh'}}/>
      <Login_input borderRadius='0' placeholder='키' type='number' value={userHeight} setVale={setUserHeight}/>
      <div style={{height: '0.5vh'}}/>
      <div className='prefpo' onClick={() => setViewPosition(true)}>
        <div style={selectedPosition ? {} : {color:'#C1C7CD'}}>{selectedPosition || '선호 포지션'}</div>
        <img src={right}/>
      </div>
      {errorNum===0 && selectedPosition ? <CircleBtn title='다음' style={{position:'fixed', bottom:'5vh'}} onClick={onNext}/> : 
      <CircleBtn title='다음' backgroundColor='#F4F4F4' color='C6C6C6' style={{position:'fixed', bottom:'5vh'}}/>}

      {viewPosition ? <PreferPosition 
        exit={()=>setViewPosition(false)}
        selectedPosition={selectedPosition}
        setSelectedPosition={setSelectedPosition}
        /> : null}
    </div>
  );
};

export default ExtraInfo;