import React, {useState, useEffect} from 'react';
import BackBtn from '../../../components/Back_btn';
import LoginTitle from '../../../components/Login_title';
import LoginInput from '../../../components/Login_input';
import CircleBtn from '../../../components/Circle_common_btn';
import '../css/EssencialInfo.scss';
import Gender from '../../../components/Gender';
import { useNavigate } from 'react-router-dom';
import Input_error_tooltip from '../../../components/Input_error_tooltip';
import client from '../../../client';
import Nickname_check_tooltip from '../../../components/Nickname_check_tooltip';

const EssencialInfo = () => {
  const navigate = useNavigate();

  const [selectedGender, setSelectedGender] = useState(null);
  const [uesrId, setUesrId] = useState("");
  const [userName, setUesrName] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [uesrBirth, setUserBirth] = useState("1990-01-01");

  const [errorNum, setErrorNum] = useState(1); //0: 정상, 1: 이름 에러, 2: 닉네임에러, 3: 생일 범위 에러, 4: 성별 선택 에러 
  const [errorText, setErrorText] = useState("");
  
  const [nicknameCheck, setNicknameCheck] = useState('null');
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(()=>{
    const type = new URL(window.location.href).searchParams.get('type');
    
    if(type === "kakao") {
      const id = new URL(window.location.href).searchParams.get('id');
      setUesrId(id);
    }

  },[]);

  function validateUserName(userName) {
    const userNameRegex = /^[a-zA-Z가-힣]{2,15}$/; // 영문 또는 한글, 2글자 이상 15글자 이하
    return userNameRegex.test(userName);
  }
  
  function validateUserNickname(userNickname) {
    const userNicknameRegex = /^[a-zA-Z가-힣0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]{2,15}$/; // 영문, 한글, 숫자, 특수문자, 2글자 이상 15글자 이하
    return userNicknameRegex.test(userNickname);
  }

  function isDateNotPast(inputDate) {
    const currentDate = new Date(); // 현재 날짜
    const parsedDate = new Date(inputDate); // 입력된 날짜를 Date 객체로 변환
  
    // 현재 날짜와 비교 (현재 날짜의 시간을 00:00:00으로 초기화)
    currentDate.setHours(0, 0, 0, 0);
  
    return parsedDate >= currentDate; // true면 현재 날짜 이후이거나 같음
  }

  const checkNickname = () => {
    client.get('/api/login/nickname/?user_nickname='+userNickname)
    .then((res)=>{
        console.log(res.data.isAvailable);
        if(res.data.isAvailable)
          setNicknameCheck('success');
        else
          setNicknameCheck('fail');
    }).catch((err)=>{
        console.log(err);
        setNicknameCheck('fail');
        setErrorText('서버 에러')
        alert('서버 에러');
    });
  }

  useEffect(()=>{
    if(!validateUserName(userName)){
      setErrorNum(1);
      setErrorText("이름 : 영문 또는 한글 2 ~ 15글자 이내로 설정해주세요");
    } else if(!validateUserNickname(userNickname)){
      setErrorNum(2);
      setErrorText("닉네임 : 영문, 한글, 숫자, 특수문자, 2 ~ 15글자로 설정해주세요");
    } else if(isDateNotPast(uesrBirth)) {
      setErrorNum(3);
      setErrorText("생년월일을 확인해주세요");
    } else if (!selectedGender){
      setErrorNum(4);
      setErrorText("성별을 설정해주세요");
    } else {
      setErrorText("");
      setErrorNum(0);
    }
  },[userName, userNickname, uesrBirth, selectedGender])

  useEffect(() => {
    if (typingTimeout) {
      setNicknameCheck('null')
      clearTimeout(typingTimeout);
    }

    if (userNickname) {
      const timeout = setTimeout(() => {
        checkNickname();
      }, 1000);
      setTypingTimeout(timeout);
    }
  }, [userNickname]);

  const onNext = () => {
    const formData = {
      "user_id" : uesrId,
      "user_name" : userName,
      "user_nickname" : userNickname,
      "user_birth" : uesrBirth,
      "user_gender" : selectedGender
    }
    console.log(formData)

    navigate('/extra-info', { state: formData});
  }

  return (
    <div className='eiBG'>
      <BackBtn />
      <LoginTitle title='필수정보 입력' explain='다양한 정보 분석을 제공해드려요.' />
      <Input_error_tooltip text={errorText}/>
      <LoginInput 
        borderRadius='15px 15px 0 0'
        placeholder='이름 입력'
        type='text'
        value={userName}
        setVale={setUesrName}
        borderColor={errorNum === 1 ? 'red' : '#F2F4F8'}
        />
      <div style={{height: '0.5vh'}} />
      {nicknameCheck==='fail' && <Nickname_check_tooltip/>}
      <LoginInput 
        borderRadius='0 0 0 0' 
        placeholder='닉네임 입력' 
        type='text' 
        value={userNickname} 
        setVale={setUserNickname}
        borderColor={errorNum === 2 || nicknameCheck==='fail' ? 'red' : '#F2F4F8'}
        />
      <div style={{height: '0.5vh'}} />
      <LoginInput 
        borderRadius='0 0 15px 15px'
        placeholder='생년월일 입력' 
        type='date'
        value={uesrBirth}
        setVale={setUserBirth}
        borderColor={errorNum === 3 ? 'red' : '#F2F4F8'}
        />
      <div className='genderBox'>
        <Gender gender='male' isSelected={selectedGender === 'male'} onClick={() => setSelectedGender('male')}/>
        <Gender gender='female' isSelected={selectedGender === 'female'} onClick={() => setSelectedGender('female')}/>
      </div>
      {errorNum===0 && nicknameCheck==='success'? <CircleBtn title='다음' style={{position:'fixed', bottom:'5vh'}} onClick={onNext}/> : 
      <CircleBtn title='다음' backgroundColor='#F4F4F4' color='C6C6C6' style={{position:'fixed', bottom:'5vh'}}/>}
      
    </div>
  );
};

export default EssencialInfo;