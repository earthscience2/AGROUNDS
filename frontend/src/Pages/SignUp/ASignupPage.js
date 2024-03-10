import React, { useEffect } from "react";
import NavBar from "../../Components/NavBar/NavBar";
import CompanyInfo from "../../Components/Common/CompanyInfo";
import Logo from "../../assets/Logo1.png";
import styles from "./ASignupPage.module.css";
import TextInput from "../../Components/Common/TextInput";
import { useState } from "react";
import SelectGender from "../../Components/Common/SelectGender";
import AgreeCheckbox from "../../Components/Common/AgreeCheckbox";
import client from "../../Clients";
import { useNavigate } from "react-router-dom";

function SigninPage(){
    const [email, setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confpassword,setConfpassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [name, setName] = useState('');
    const [birth,setBirth] = useState('');
    const [gender, setGender] = useState('');
    const [marketingAgree, setMarketingAgree] = useState(false);
    const [termsAgree,setTermsAgree] = useState('');
    const [privacyAgree,setPrivacyAgree] = useState('');
    const [allAgree,setAllAgree] = useState('');
    const [isNickname,setIsNickname] = useState('');
    const [isEmail,setIsEmail] = useState('');
    const [isPassword,setIsPassword] = useState('');
    const [isconfPassword, setIsconfPassword] = useState('');
    const [isName,setIsName] = useState('');
    const [isBirth,setIsBirth] = useState('');
    const [isDup,setIsDup] = useState('');
    const navigate = useNavigate();


    let isAgree = privacyAgree && termsAgree;
    let isAllValid = isDup && isEmail && isPassword && isName && isBirth && isAgree;

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
    
    const saveEmail = event => {
        setEmail(event.target.value);
        const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(event.target.value);
        setIsEmail(isValidEmail ? "1" : "0");
        if (event.target.value === "") {
            setIsEmail("2");
          }
        
    }
    
    const savePassword = event => {
        setPassword(event.target.value);
        const IsValidPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,}$/.test(event.target.value)
        setIsPassword(IsValidPassword? "1" : "0");
        if (event.target.value === "") {
            setIsPassword("2");
          }
    }
    
    const saveConfpassword = event => {
        setConfpassword(event.target.value);
        const IsValidconfPassword = password === event.target.value;
        setIsconfPassword(IsValidconfPassword? "1" : "0");
        if (event.target.value === "") {
            setIsconfPassword("2");
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
            'user_id' : email,
            'password' : password,
            'user_birth' : birth,
            'user_name' : name,
            'user_gender' : gender,
            'user_nickname' : nickname,
            'marketing_agree' : marketingAgree

        }
        
        client.post('/api/login/signup/',SignUpData)
        .then(function(response){
            console.log(response)
            navigate("/WelcomeSignUpPage")
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
   
 



    
  
    return(
        <div className={styles.backg}>
            <NavBar/>
            <form onSubmit={onSubmitHandler}>
                <div className={styles.back}>
                    <div className={styles.block1}>
                        <img className={styles.icon} src={Logo}/>  
                        AGROUNDS로 회원가입
                    </div>
                    
                    <TextInput isValid={isEmail} errortext="올바른 이메일을 입력해주세요."correcttext="사용 가능한 아이디에요."onChange={saveEmail} text="아이디" type="email" placeholder="abc@gmail.com"/>
                    <TextInput isValid={isPassword} errortext="영문, 숫자, 특수문자를 조합하여 최소 8자리 이상 입력해주세요." correcttext="사용가능한 비밀번호에요."onChange={savePassword}text="비밀번호" type="password" placeholder="영문, 숫자, 특수문자를 조합"/>
                    <TextInput isValid={isconfPassword}errortext="비밀번호가 일치하지 않습니다." correcttext="비밀번호가 일치합니다."onChange={saveConfpassword}text="비밀번호 확인" type="password" placeholder="비밀번호 확인"/>
                    <div className={styles.block0}>
                        <div className={styles.block2}>
                            <div className={styles.name}>닉네임</div>
                            <input onChange={saveNickname}className={styles.input}type="text" placeholder="3~8자리 입력"></input>
                            
                            {isNickname === "1" ? (
                                <div className={styles.checkdup2} onClick={onDupCheckHandler}>중복확인</div>
                            ) : (<div className={styles.checkdup} >중복확인</div>)}
                            
                            
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
                        <SelectGender setGender={setGender} onChange={saveGender} color="#055540"/>
                    </div>
                    
                    <AgreeCheckbox setTermsAgree={setTermsAgree}privacyAgree={privacyAgree}termsAgree={termsAgree}marketingAgree={marketingAgree}allAgree={allAgree}setAllAgree={setAllAgree}setMarketingAgree={setMarketingAgree}setPrivacyAgree={setPrivacyAgree} color="#055540"/>
                    {isAllValid ? <button type="submit"className={styles.submit}>가입하기</button> : <button type="button"className={styles.submit2}>가입하기</button>}
                </div>
            </form>
            <CompanyInfo/>
        </div>
    )
}
export default SigninPage;