import React from 'react';
import ImgAnal from '../display/ImgAnal';
import DataAnal from '../display/DataAnal';
import Map from '../../assets/full-match/'

const Quarter1 = () => {
  return (
    <div>
      <div className='map'>
        <img src="" />
      </div>
      <ImgAnal activePosition={activePosition} imgAnal={imgAnal} setImgAnal={setImgAnal}/>
      <div>
        <DataAnal quarter='1쿼터' position={activePosition}/>
      </div>
    </div>
  );
};

export default Quarter1;