import React, { useState } from "react";
import styles from "./Signup.module.css";
import TextInput from "../Common/TextInput";
import SelectGender from "../Common/SelectGender";
import AgreeCheckbox from "../Common/AgreeCheckbox";
import { useEffect } from "react";
import client from "../../Clients";

function Signin({color,text,imgsrc}){
    const [nickname, setNickname] = useState('');
    const [name, setName] = useState('');
    const [birth,setBirth] = useState('');
    const [gender, setGender] = useState('');
    const [marketingAgree, setMarketingAgree] = useState('');
    const [termsAgree,setTermsAgree] = useState('');
    const [privacyAgree,setPrivacyAgree] = useState('');
    const [allAgree,setAllAgree] = useState('');
    const [isNickname,setIsNickname] = useState('');
    const [isName,setIsName] = useState('');
    const [isBirth,setIsBirth] = useState('');
    const [isDup,setIsDup] = useState('');

    
    let isAgree = privacyAgree && termsAgree;
    let isAllValid = isDup && isName && isBirth && isAgree;

    useEffect(() => {
        setAllAgree(privacyAgree && termsAgree && marketingAgree)
    },[privacyAgree ,termsAgree, marketingAgree])

    const saveNickname = event => {
        setNickname(event.target.value);
        setIsDup('');
        const IsValidNickname = /^[a-zA-Z가-힣0-9!@#$%^&*()-_=+{};:,<.>]{3,10}$/.test(event.target.value)
        setIsNickname(IsValidNickname ? "1" : "0")
        if(IsValidNickname === ""){
            setIsNickname("2")
        }
    }
    
    const saveName = event => {
        setName(event.target.value);
        const IsValidName = /^[가-힣a-zA-Z]{2,20}$/.test(event.target.value)
        setIsName(IsValidName? "1" : "0");
        if (event.target.value === "") {
            setIsName("2");
    }}
    
    const saveBirth = event => {
        setBirth(event.target.value);
        const IsValidBirth = /^\d{8}$/.test(event.target.value)
        setIsBirth(IsValidBirth? "1" : "0");
        if (event.target.value === "") {
            setIsBirth("2");
    }}
    const saveGender = event => {
        setGender(event.target.value);
    }
    
    const onSubmitHandler = async event => {
        event.preventDefault();

        let SignUpData = {
            'user_birth' : birth,
            'user_name' : name,
            'user_gender' : gender,
            'user_nickname' : nickname,
            'marketing_agree' : marketingAgree

        }
        console.log(SignUpData);
        client.post('/api/login/signup/',SignUpData)
        .then(function(response){
            console.log(response)
        })
        .catch(function(error){
            console.log(error);
        })
    }
    const onDupCheckHandler = async event => {
        event.preventDefault();
        client.get('/api/login/nickname/?nickname=' + nickname)
        .then(function(response){
            setIsDup(response.data.isAvailable)
        })
        .catch(function(error){
            console.log(error)
        })
    }
  

    const sameBStyle = {
        border: `.2vh solid ${color}`,
        
    }
    const SigninBStyle = {
        backgroundColor: color,
    }
    

    return(
      <form onSubmit={onSubmitHandler}>
        <div className={styles.back}>
            <div className={styles.block1}>
                <img className={styles.icon} src={imgsrc}/>  
                {text}로 회원가입
            </div>
            <div className={styles.block0}>
                <div className={styles.block2}>
                    <div className={styles.name}>닉네임</div>
                    <input onChange={saveNickname}className={styles.input}type="text" placeholder="3~8자리 입력"></input>
                    {isNickname === "1" ? (
                                <div className={styles.checkdup2} style={SigninBStyle}onClick={onDupCheckHandler}>중복확인</div>
                            ) : (<div className={styles.checkdup} style={sameBStyle} >중복확인</div>)}
                </div>
                {isNickname === "0" ? (
                            <p className={styles.errortext} style={{ color: "red" }}>3~8자리로 설정해주세요.</p>
                        ): isNickname === "1" && isDup ?(
                            <p className={styles.errortext} style={{ color: "rgb(60,100,233)" }}>사용가능한 닉네임입니다.</p>
                        ): isNickname === "1" && isDup === false ?(
                            <p className={styles.errortext} style={{ color: "red" }}>중복된 닉네임입니다.</p>
                        ): isNickname === "1" ?(
                            <p className={styles.errortext} style={{ color: "red" }}>중복검사를 실시해주세요.</p>
                        ): (
                            <p className={styles.errortext} style={{ color: "white" }}></p>
                        )}
            </div>
            
            <TextInput isValid={isName} errortext="이름을 입력해주세요." correcttext=""onChange={saveName}text="이름" type="text" placeholder="실명 입력"/>
            <TextInput isValid={isBirth}errortext="YYYYMMDD 형식으로 입력해주세요." correcttext="생년월일이 입력되었습니다."onChange={saveBirth}text="생년월일" type="text" placeholder="8자리 (YYYYMMDD)" maxLength={8} pattern="\d*" />
            
            <div >
                <SelectGender setGender={setGender} onChange={saveGender} color={color}/>
            </div>
        
            <AgreeCheckbox setTermsAgree={setTermsAgree}privacyAgree={privacyAgree}termsAgree={termsAgree}marketingAgree={marketingAgree}allAgree={allAgree}setAllAgree={setAllAgree}setMarketingAgree={setMarketingAgree}setPrivacyAgree={setPrivacyAgree} color={color}/>
            {isAllValid ? <button style={SigninBStyle} type="submit"className={styles.submit}>가입하기</button> : <button type="button"className={styles.submit2}>가입하기</button>}
        </div>
      </form>
    )
}
export default Signin;