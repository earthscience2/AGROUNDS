import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import CompanyInfo from "../../Components/Common/CompanyInfo";
import Logo from "../../assets/logo5.png";
import styles from "./ASigninPage.module.css";
import TextInput from "../../Components/Common/TextInput";
import { useState } from "react";
import SelectGender from "../../Components/Common/SelectGender";
import AgreeCheckbox from "../../Components/Common/AgreeCheckbox";
import Image from 'next/image';


function SigninPage(){
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (event) => {
        let value = event.target.value;
        if (value.length > 8) {
          value = value.slice(0, 8);
        }
        setInputValue(value);
      };
    return(
        <div className={styles.backg}>
            <NavBar/>
            <form>
                <div className={styles.back}>
                    <div className={styles.block1}>
                        <Image className={styles.icon} src={Logo}/>  
                        AGROUNDS로 회원가입
                    </div>
                    <div className={styles.block2}>
                        <div className={styles.name}>닉네임</div>
                        <input className={styles.input}type="text" placeholder="닉네임"></input>
                        <div className={styles.checkdup} >중복확인</div>
                    </div>
                    
                    <TextInput text="이름" type="text" placeholder="실명"/>
                    <TextInput text="생년월일" type="text" placeholder="8자리 (YYYYMMDD)" maxLength={8} pattern="\d*" onChange={handleInputChange}/>
                    
                    <div >
                        <SelectGender color="#055540"/>
                    </div>
                    
                    <AgreeCheckbox color="#055540"/>
                    <button className={styles.submit}>가입하기</button>
                </div>
            </form>
            <CompanyInfo/>
        </div>
    )
}
export default SigninPage;