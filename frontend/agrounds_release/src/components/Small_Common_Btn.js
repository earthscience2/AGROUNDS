import React from 'react';

const Small_Common_Btn = ({title, onClick, backgroundColor = '#262626', color = 'white'}) => {
  return (
    <div style={{display:'flex',justifyContent:'center', width: '50%'}}>
      <div style={{backgroundColor: backgroundColor, display:'flex', alignItems: 'center' ,justifyContent: 'center', width: '90%', height: '60px', color: color, borderRadius:'2vh',fontFamily: 'Pretendard-Regular', fontWeight:'600'}} onClick={onClick}>
            {title}
      </div>
    </div>
  );
};

export default Small_Common_Btn;