import SignupBtn from "../Common/SignupBtn";
import styles from "./SignupModal.module.css";
import Google from "../../assets/Google.png";
import Kakao from "../../assets/Kakao.png";
import Logo from "../../assets/logo5.png";
import Close from "../../assets/Close.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupModal(props){
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const ModalOpen=()=>{
        setIsOpen(true);
    }
    const ModalClose =() =>{
        setIsOpen(false);
        props.ModalClose();
        
    }
    const goGoogle=()=>{
        navigate("/GSigninPage")
    }
    const goKakao=()=>{
        navigate("/KSigninPage")
    }
    const goAground=()=>{
        navigate("/ASigninPage")
    }
    

    return(
        <div className={styles.back}>
        <div className={styles.background} onClick={ModalClose}></div>
            <div className={styles.compback}>
                <div className={styles.closebox}><img className={styles.close} src={Close} onClick={ModalClose}/></div>
                <div className={styles.gBtn}><SignupBtn backcolor="white" color="black" text="구글로 회원가입" logoimg={Google} onClick ={goGoogle}/></div>
                <SignupBtn backcolor="#FEE502" color="black" text="카카오톡으로 회원가입" logoimg={Kakao} onClick ={goKakao}/>
                <SignupBtn backcolor="#245441" color="white" text="AGROUNDS로 회원가입" logoimg={Logo} onClick ={goAground}/>
            </div>
        </div>
    )
}
export default SignupModal;