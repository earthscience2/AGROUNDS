import React from 'react';

const Image_Comp = ({width, img}) => {
  return (
    <div style={{overflow: 'hidden', width:width, height: width, borderRadius: '50%'}}>
      <img src={img} style={{objectFit: 'contain', width: width}}/>
    </div>
  );
};

export default Image_Comp;