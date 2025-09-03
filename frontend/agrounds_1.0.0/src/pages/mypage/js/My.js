import React from 'react';
import '../css/My.scss';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import Image_Comp from '../../../components/Image_Comp';
import logo from '../../../assets/common/user-grey.png';
import BasicInfo from '../../../components/BasicInfo';
import MyChapter from '../../../components/MyChapter';
import camera from '../../../assets/common/camera.png';

const My = () => {
  return (
    <div className='mypage'>
      <LogoBellNav />
      <div className='my-infobox'>
        <div className='image-compbox' style={{overflow: 'hidden', width:'12vh', height: '12vh', borderRadius: '50%'}}>
          <img src={logo} style={{objectFit: 'contain', width: '12vh'}}/>
          <div className='camera-bg'>
            <img src={camera} className='camera'/>
          </div>
        </div>
        
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
      
    </div>
  );
};

export default My;