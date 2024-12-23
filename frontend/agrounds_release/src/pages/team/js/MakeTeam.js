import React, { useState, useEffect } from 'react';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import Login_input from '../../../components/Login_input';
import Circle_common_btn from '../../../components/Circle_common_btn';
import '../css/MakeTeam.scss';
import UserProfile from '../../../components/UserProfile';
import { validateTeamName } from '../../../function/Validate';
import { MakeTeamApi } from '../../../function/TeamApi';
import { useNavigate } from 'react-router-dom';

const MakeTeam = () => {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    const isNameValid = validateTeamName(teamName);
    const isImageSelected = !!selectedImage;

    if (!isNameValid) {
      setErrorMessage('팀 이름은 2~15글자, 특수기호를 포함하지 않아야 합니다.');
    } else if (!isImageSelected) {
      setErrorMessage('팀 로고를 선택해주세요.');
    } else {
      setErrorMessage(''); 
    }

    setIsValid(isNameValid && isImageSelected);
  }, [teamName, selectedImage]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTeamName(value);
  };

  const handleSubmit = () => {
    const NewTeamData = {
      team_host: sessionStorage.getItem('userCode'),
      team_name: teamName,
      team_logo: selectedImage,
    };

    MakeTeamApi(NewTeamData)
      .then(() => {
        navigate('/completemaketeam');
      })
      .catch((error) => {
        console.log(error)
        // alert('팀 생성에 실패했습니다.');
      });
  };

  return (
    <div className="maketeam">
      <Back_btn />
      <Login_title title="팀 생성하기" explain="나만의 팀을 만들어보세요" />
      <UserProfile selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
      <Login_input
        placeholder="팀 이름 입력"
        type="text"
        borderRadius="15px"
        value={teamName}
        onChange={handleInputChange}
      />
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      <div className="circletab">
        <Circle_common_btn
          title="팀 생성하기"
          onClick={isValid ? handleSubmit : null}
          backgroundColor={isValid ? '#262626' : '#cccccc'}
          color={isValid ? 'white' : '#666666'}
          disabled={!isValid}
        />
      </div>
    </div>
  );
};

export default MakeTeam;
