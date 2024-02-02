import React, { useState } from "react";
import styles from "./Signin.module.css";
import TextInput from "../Common/TextInput";
import SelectGender from "../Common/SelectGender";
import AgreeCheckbox from "../Common/AgreeCheckbox";
import Image from 'next/image';

function Signin({color,text,imgsrc}){
  
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    let value = event.target.value;
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    setInputValue(value);
  };

    const sameBStyle = {
        border: `.2vh solid ${color}`,
    }
    const SigninBStyle = {
        backgroundColor: color,
    }
    
    return(
      <form>
        <div className={styles.back}>
            <div className={styles.block1}>
                <Image className={styles.icon} src={imgsrc}/>  
                {text}로 회원가입
            </div>
            <div className={styles.block2}>
                <div className={styles.name}>닉네임</div>
                <input className={styles.input}type="text" placeholder="닉네임"></input>
                <div className={styles.checkdup} style={sameBStyle}>중복확인</div>
            </div>
            
            <TextInput text="이름" type="text" placeholder="실명"/>
            <TextInput text="생년월일" type="text" placeholder="8자리 (YYYYMMDD)" maxLength={8} pattern="\d*" onChange={handleInputChange}/>
            
            <div >
                <SelectGender color={color}/>
            </div>
            
            <AgreeCheckbox color={color}/>
            <button style={SigninBStyle} className={styles.submit}>가입하기</button>
        </div>
      </form>
    )
}
export default Signin;