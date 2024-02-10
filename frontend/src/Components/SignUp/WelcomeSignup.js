import styles from "./WelcomeSignup.module.css";
import logo2 from "../../assets/Logo2.png";
import Button from "../Common/Button";
import { useNavigate } from "react-router-dom";

function WelcomeSignUp({username}){
    const navigate = useNavigate();
    const confirm =() => {
        navigate("/LoginPage");
    }
    return (
        <div className={styles.back}>
            <img className={styles.logo}src={logo2}/>
            <div className={styles.firstline}><p className={styles.username}>{username}</p> 회원님 !</div>
            <p className={styles.firstline}>AGROUNDS 홈페이지 회원가입을 환영합니다.</p>
            <div type="button" onClick={confirm} className={styles.button} >로그인</div>
        </div>
    )
}
export default WelcomeSignUp;