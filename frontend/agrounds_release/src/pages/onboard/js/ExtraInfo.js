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
import Modal from '../../../components/Modal';
import logo from '../../../assets/symbol.png';
import TermsAgreement from '../../../components/TermsAgreement';

const ExtraInfo = () => {
  const navigate = useNavigate();

  const [viewPosition, setViewPosition] = useState(false);

  const [userWeight, setUserWeight] = useState();
  const [userHeight, setUserHeight] = useState();
  const [selectedPosition, setSelectedPosition] = useState(null);

  const [errorNum, setErrorNum] = useState(1); //0: 정상, 1: 몸무게 에러, 2: 신장 에러, 3: 포지션 에러

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [marketingAgree, setMarketingAgree] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
        "user_position" : selectedPosition,
        "marketing_agree" : marketingAgree
      };
  
      const mergedFormData = {...receivedFormData, ...formData};
  
      console.log(mergedFormData);

      client.post('/api/login/kakao/signup/', mergedFormData)
      .then((res)=>{
        console.log(res);
        let hostname = window.location.hostname
        if(hostname !== 'localhost')
            hostname = 'agrounds.com'
        window.location.replace(process.env.REACT_APP_BASE_URL + "/api/login/kakao/?hostname=" + hostname)
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
      <Login_input borderRadius='15px 15px 0 0' placeholder='몸무게' type='number' value={userWeight} onChange={(event)=>setUserWeight(event.target.value)}/>
      <div style={{height: '0.5vh'}}/>
      <Login_input borderRadius='0' placeholder='키' type='number' value={userHeight} onChange={(event)=>setUserHeight(event.target.value)}/>
      <div style={{height: '0.5vh'}}/>
      <div className='prefpo' onClick={() => setViewPosition(true)}>
        <div style={selectedPosition ? {} : {color:'#C1C7CD'}}>{selectedPosition || '선호 포지션'}</div>
        <img src={right}/>
      </div>
      {errorNum===0 && selectedPosition ? <CircleBtn title='다음' style={{position:'fixed', bottom:'5vh'}} onClick={openModal}/> : 
      <CircleBtn title='다음' backgroundColor='#F4F4F4' color='C6C6C6' style={{maxWidth:'500px', position:'fixed', bottom:'5vh'}}/>}

      {viewPosition ? <PreferPosition 
        exit={()=>setViewPosition(false)}
        selectedPosition={selectedPosition}
        setSelectedPosition={setSelectedPosition}
        /> : null}


      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className='modal-inner'>
         <img src={logo} className='symbol'/>
         <p className='modal-title'>에이그라운즈를 사용하기 위해 <br/>약관을 동의해주세요.</p>
         <TermsAgreement onClick={onNext} setMarketingAgree={setMarketingAgree}/>
        </div>
      </Modal>
    </div>
  );
};

export default ExtraInfo;