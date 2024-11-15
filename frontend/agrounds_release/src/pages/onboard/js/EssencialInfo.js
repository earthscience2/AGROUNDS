import React, {useState} from 'react';
import BackBtn from '../../../components/Back_btn';
import LoginTitle from '../../../components/Login_title';
import LoginInput from '../../../components/Login_input';
import CircleBtn from '../../../components/Circle_common_btn';
import '../css/EssencialInfo.scss';
import Gender from '../../../components/Gender';

const EssencialInfo = () => {
  const [selectedGender, setSelectedGender] = useState(null);

  return (
    <div className='eiBG'>
      <BackBtn />
      <LoginTitle title='필수정보 입력' explain='다양한 정보 분석을 제공해드려요.' />
      <LoginInput borderRadius='15px 15px 0 0' placeholder='이름 입력' type='text'/>
      <div style={{height: '0.5vh'}} />
      <LoginInput borderRadius='0 0 15px 15px'placeholder='닉네임 입력' type='text'/>
      <div className='genderBox'>
        <Gender gender='man' isSelected={selectedGender === 'man'} onClick={() => setSelectedGender('man')}/>
        <Gender gender='woman' isSelected={selectedGender === 'woman'} onClick={() => setSelectedGender('woman')}/>
      </div>
      <CircleBtn title='다음' />
    </div>
  );
};

export default EssencialInfo;