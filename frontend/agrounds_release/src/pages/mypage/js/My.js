import React from 'react';
import '../css/My.scss';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import Image_Comp from '../../../components/Image_Comp';
import logo from '../../../assets/user-grey.png';
import BasicInfo from '../../../components/BasicInfo';
import MyChapter from '../../../components/MyChapter';
import Footer from '../../../components/Footer';

const My = () => {
  return (
    <div className='mypage'>
      <LogoBellNav />
      <div className='my-infobox'>
        <Image_Comp width="12vh" img={logo}/>
        <div className='infotext'>
          <p className='ename'>{sessionStorage.getItem('userNickname')}</p>
          <p className='kname'>{sessionStorage.getItem('userName')}</p>
          <p className='fc'>{sessionStorage.getItem('userPosition')}</p>
        </div>
      </div>
      <BasicInfo />
      {/* <MyChapter chapter="알림"/> */}
      <MyChapter chapter="일반"/>
      <MyChapter chapter="약관"/>
      <MyChapter chapter="계정"/>
      <Footer />
    </div>
  );
};

export default My;