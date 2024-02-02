import styles from "./Login.module.css";
import Button from "../Common/Button";
import Google from "../../../src/assets/Google.png";
import Kakao from "../../../src/assets/Kakao.png";
import { useState } from "react";
import logo5 from "../../assets/logo5.png";
import SignupModal from "../Signin/SignupModal";
import Image from 'next/image';

function Login(props){
    const [userid, setUserid] = useState('');
    const [userpw, setUserpw] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const ModalOpen=()=>{
        setIsOpen(true);
    }
    const ModalClose =() =>{
        setIsOpen(false);
    }
    const handleIdChange = (e) =>{
        setUserid(e.target.value);
        console.log('id:', userid);
    }
    const handlePwChange = (e) => {
        setUserpw(e.target.value);
        console.log('pw:',userpw);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('id:', userid);
        
    }

    return (
        <form onSubmit={handleSubmit}>
            {isOpen &&(<div className={styles.compbox}><SignupModal ModalClose = {ModalClose}/></div>)}
            <div className={styles.login}>
                <div className={styles.logo}>AGROUNDS</div>
                <div className={styles.idbox}><input onChange={handleIdChange} placeholder="아이디"className={styles.id} type="text"></input></div>
                <div className={styles.pwbox}><input onChange={handlePwChange} placeholder="비밀번호"className={styles.pw} type="text"></input></div>
                <Button onClick={handleSubmit} type="submit"color="#FFFFFF"backcolor="#055540" text="로그인" logoimg={logo5}/>
                
                <div className={styles.find}>
                    <div className={styles.signin} onClick={ModalOpen}>회원가입</div>
                    
                    <div className={styles.fid}>아이디 찾기</div>
                    <div className={styles.fline}></div>
                    <div className={styles.fpw}>비밀번호 찾기</div>
                </div>
                <Button logoimg={Kakao} color="black"backcolor="#FEE502" text="카카오톡으로 로그인"/>
                <div className={styles.ggback}><Button logoimg={Google} color="black"backcolor="#FFFFFF" text="구글로 로그인"/></div>
            </div>
        </form>
    )
}
export default Login;