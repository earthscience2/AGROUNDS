import styles from "./Login.module.css";
import Button from "../Common/Button";
import Google from "../../../src/assets/Google.png";
import Kakao from "../../../src/assets/Kakao.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo5 from "../../assets/logo5.png";
import SignupModal from "../SignUp/SignupModal";
import client from "../../Clients";

function Login(props){
    const [userid, setUserid] = useState('');
    const [userpw, setUserpw] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isid,setIsid] = useState('');
    const [isPassword,setIsPassword] = useState('');
    const [isLogin,setIsLogin] = useState('')
    const [token, setToken] = useState('');
    const [Logined, setIsLogined] = useState('');
    const navigate = useNavigate();
    const ModalOpen=()=>{
        setIsOpen(true);
    }
    const ModalClose =() =>{
        setIsOpen(false);
    }
    const handleIdChange = (e) =>{
        setUserid(e.target.value);
        setIsid(e.target.value.toLowerCase().match(/([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/))
    }
    const handlePwChange = (e) => {
        setUserpw(e.target.value);
        setIsPassword(e.target.value.toLowerCase().match(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/))
    }

    const onKakaoClick = (e) => {
        window.location.replace(process.env.REACT_APP_BASE_URL+"/api/login/kakao");
    }
    const onAgrooundClick = (e) => {
        e.preventDefault();
        const loginData = {
            'user_id':userid,
            'password': userpw

        }
        client.post('/api/login/login/', loginData)
        .then(function(response){
            console.log(response)
            setToken(response.data.token)
            sessionStorage.setItem('nickname', response.data.user_nickname);
            sessionStorage.setItem('token', response.data.token)
            sessionStorage.setItem('usercode', response.data.user_code)
            navigate('/ALMainPage');
        })
        .catch(function(error){
            setIsLogin(false);
            alert(error.response.data.error)
            console.log(error);
        })
    }

    return (
        <form onSubmit={onAgrooundClick}>
            {isOpen &&(<div className={styles.compbox}><SignupModal ModalClose = {ModalClose}/></div>)}
            <div className={styles.login}>
                <div className={styles.logo}>AGROUNDS</div>
                <div className={styles.idbox}><input onChange={handleIdChange} placeholder="아이디"className={styles.id} type="text"></input></div>
                <div className={styles.pwbox}><input onChange={handlePwChange} placeholder="비밀번호"className={styles.pw} type="password"></input></div>
                {isid && isPassword ?<Button onClick={onAgrooundClick} type="submit"color="#FFFFFF"backcolor="#055540" text="로그인" logoimg={logo5}/>:<Button type="button"color="white"backcolor="#dadada" text="로그인" logoimg={logo5}/>}
                
                <div className={styles.find}>
                    <div className={styles.signin} onClick={ModalOpen}>회원가입</div>
                    
                    <div className={styles.fid}>아이디 찾기</div>
                    <div className={styles.fline}></div>
                    <div className={styles.fpw}>비밀번호 찾기</div>
                </div>
                <Button onClick={onKakaoClick}logoimg={Kakao} color="black"backcolor="#FEE502" text="카카오톡으로 로그인"/>
                <div className={styles.ggback}>
                    <Button logoimg={Google} color="black"backcolor="#FFFFFF" text="구글로 로그인"/></div>
            </div>
        </form>
    )
}
export default Login;