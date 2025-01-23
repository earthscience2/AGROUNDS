import React, { useEffect, useState } from 'react';
import BackTitle_Btn from '../../../components/BackTitle_Btn';
import { useNavigate } from 'react-router-dom';
import client from '../../../client';
import Input_error_tooltip from '../../../components/Input_error_tooltip';
import LoginInput from '../../../components/Login_input';
import CircleBtn from '../../../components/Circle_common_btn';
import Gender from '../../../components/Gender';
import Nickname_check_tooltip from '../../../components/Nickname_check_tooltip';
import PreferPosition from '../../onboard/js/PreferPosition';
import right from '../../../assets/right.png';
import '../css/InfoFix.scss';
import { EditUserInfoApi } from '../../../function/MyPageApi';

const InfoFix = () => {
  const navigate = useNavigate();

  const [selectedGender, setSelectedGender] = useState("");
  const [userName, setUserName] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [userBirth, setUserBirth] = useState("");

  const [viewPosition, setViewPosition] = useState(false);

  const [userWeight, setUserWeight] = useState("");
  const [userHeight, setUserHeight] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");

  const [errorNum, setErrorNum] = useState(1); //0: 정상, 1: 몸무게 에러, 2: 신장 에러, 3: 포지션 에러

  const [errorText, setErrorText] = useState("");
  const [nicknameCheck, setNicknameCheck] = useState('null');
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isModified, setIsModified] = useState(false);

  const originalData = {
    userName: sessionStorage.getItem("userName"), 
    userNickname: sessionStorage.getItem("userNickname"),
    userBirth: sessionStorage.getItem("userBirth"),
    selectedGender: sessionStorage.getItem("userGender"),
    userWeight: sessionStorage.getItem("userWeight"),
    userHeight: sessionStorage.getItem("userHeight"),
    selectedPosition: sessionStorage.getItem("userPosition")
  };

  function validateUserName(name) {
    return /^[a-zA-Z가-힣]{2,15}$/.test(name);
  }

  function validateUserNickname(nickname) {
    return /^[a-zA-Z가-힣0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]{2,15}$/.test(nickname);
  }

  function isDateValid(date) {
    const currentDate = new Date();
    const parsedDate = new Date(date);
    return parsedDate < currentDate;
  }

  function validateUserWeight(weight) {
    return weight >= 10 && weight <= 220;
  }

  function validateUserHeight(height) {
    return height >= 10 && height <= 220;
  }

  const checkNickname = () => {
    if(originalData.userNickname === userNickname) return;
    client.get(`/api/login/nickname/?user_nickname=${userNickname}`)
      .then((res) => {
        if (res.data.isAvailable) setNicknameCheck('success');
        else setNicknameCheck('fail');
      })
      .catch(() => {
        setNicknameCheck('fail');
        setErrorText('서버 에러');
        alert('서버 에러');
      });
  };

  useEffect(() => {
    setUserName(originalData.userName);
    setUserNickname(originalData.userNickname);
    setUserBirth(originalData.userBirth);
    setSelectedPosition(originalData.selectedPosition);
    setUserWeight(originalData.userWeight);
    setUserHeight(originalData.userHeight);
    setSelectedGender(originalData.selectedGender);
  }, [])

  useEffect(() => {
    if (typingTimeout) {
      setNicknameCheck('null');
      clearTimeout(typingTimeout);
    }

    if (userNickname) {
      const timeout = setTimeout(() => {
        checkNickname();
      }, 1000);
      setTypingTimeout(timeout);
    }
  }, [userNickname]);

  useEffect(() => {
    setIsModified(
      userName !== originalData.userName ||
      userNickname !== originalData.userNickname ||
      userBirth !== originalData.userBirth ||
      selectedGender !== originalData.selectedGender ||
      userWeight !== originalData.userWeight ||
      userHeight !== originalData.userHeight ||
      selectedPosition !== originalData.selectedPosition
    );
    handleValidation();
  }, [userName, userNickname, userBirth, selectedGender, userWeight, userHeight, selectedPosition]);

  const handleValidation = () => {
    if (userName && !validateUserName(userName)) {
      setErrorText("이름은 영문 또는 한글 2 ~ 15글자 이내로 설정해주세요.");
      setErrorNum(1);
      return false;
    }
    if (userNickname && !validateUserNickname(userNickname)) {
      if(originalData.userNickname !== userNickname) {
        setErrorText("닉네임은 영문, 한글, 숫자, 특수문자 2 ~ 15글자 이내로 설정해주세요.");
        setErrorNum(2);
        return false;
      }
    }
    if (userBirth && !isDateValid(userBirth)) {
      setErrorText("생년월일을 확인해주세요.");
      setErrorNum(3);
      return false;
    }
    if (userWeight && !validateUserWeight(userWeight)) {
      setErrorText("몸무게는 10 ~ 220kg 사이로 설정해주세요.");
      setErrorNum(4);
      return false;
    }
    if (userHeight && !validateUserHeight(userHeight)) {
      setErrorText("키는 10 ~ 220cm 사이로 설정해주세요.");
      setErrorNum(5);
      return false;
    }
    if (selectedGender === "") {
      setErrorText("성별을 선택해주세요.");
      setErrorNum(6);
      return false;
    }
    setErrorNum(0);
    setErrorText("");
    return true;
  };

  const onSendBtn = () => {
    if (!handleValidation()) return;

    const data = {
      user_code: sessionStorage.getItem('userCode'),
      user_birth: userBirth || "",
      user_name: userName || "",
      user_gender: selectedGender || "",
      user_nickname: userNickname || "",
      user_height: userHeight || "",
      user_weight: userWeight || "",
      user_position: selectedPosition || ""
    };

    EditUserInfoApi(data)
      .then(() => {
        sessionStorage.setItem('userBirth', userBirth);
        sessionStorage.setItem('userName', userName);
        sessionStorage.setItem('userGender', selectedGender);
        sessionStorage.setItem('userNickname', userNickname);
        sessionStorage.setItem('userHeight', userHeight);
        sessionStorage.setItem('userWeight', userWeight);
        sessionStorage.setItem('userPosition', selectedPosition);
        alert('성공적으로 변경했습니다.');
        navigate(-1);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className='info-fix'>
      <BackTitle_Btn navTitle='내 정보 수정' />
      <p className='info-fix-title'>필수 정보</p>
      <LoginInput
        borderRadius='15px 15px 0 0'
        placeholder='이름 입력'
        type='text'
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        borderColor={errorNum === 1 ? 'red' : '#F2F4F8'}
      />
      <div style={{ height: '0.5vh' }} />
      {nicknameCheck === 'fail' && <Nickname_check_tooltip />}
      <LoginInput
        borderRadius='0 0 0 0'
        placeholder='닉네임 입력'
        type='text'
        value={userNickname}
        onChange={(e) => setUserNickname(e.target.value)}
        borderColor={errorNum === 2 || nicknameCheck==='fail' ? 'red' : '#F2F4F8'}
      />
      <div style={{ height: '0.5vh' }} />
      <LoginInput
        borderRadius='0 0 15px 15px'
        placeholder='생년월일 입력'
        type='date'
        value={userBirth}
        onChange={(e) => setUserBirth(e.target.value)}
        
      />
      <div style={{ height: '3vh' }} />
      <p className='info-fix-title'>선택 정보</p>
      <LoginInput
        borderRadius='15px 15px 0 0'
        placeholder='몸무게'
        type='number'
        value={userWeight}
        onChange={(e) => setUserWeight(e.target.value)}
      />
      <div style={{ height: '0.5vh' }} />
      <LoginInput
        borderRadius='0'
        placeholder='키'
        type='number'
        value={userHeight}
        onChange={(e) => setUserHeight(e.target.value)}
      />
      <div style={{ height: '0.5vh' }} />
      <div className='prefpo' onClick={() => setViewPosition(true)}>
        <div style={selectedPosition ? {} : { color: '#C1C7CD' }}>{selectedPosition || '선호 포지션'}</div>
        <img src={right} alt="선택" />
      </div>

      {viewPosition && (
        <PreferPosition
          exit={() => setViewPosition(false)}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
        />
      )}
      <div className='genderBox'>
        <Gender
          gender='male'
          isSelected={selectedGender === 'male'}
          onClick={() => setSelectedGender('male')}
        />
        <Gender
          gender='female'
          isSelected={selectedGender === 'female'}
          onClick={() => setSelectedGender('female')}
        />
      </div>
      {isModified ? (
        <CircleBtn title='수정완료' style={{ position: 'fixed', bottom: '5vh' }} onClick={onSendBtn} />
      ) : (
        <CircleBtn title='수정하기' backgroundColor='#F4F4F4' color='#C6C6C6' style={{ position: 'fixed', bottom: '5vh' }} />
      )}
      <Input_error_tooltip text={errorText} style={{position: 'fixed', bottom: '14vh'}}/>
    </div>
  );
};

export default InfoFix;
