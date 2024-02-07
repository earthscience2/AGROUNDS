import styles from "./Login.module.css";
import Button from "../Common/Button";
import Google from "../../../src/assets/Google.png";
import Kakao from "../../../src/assets/Kakao.png";
import { useState } from "react";
import logo5 from "../../assets/logo5.png";
import SignupModal from "../Signin/SignupModal";
import Image from 'next/image';
import { useRouter } from 'next/router';

function Login(props) {
    const [userid, setUserid] = useState('');
    const [userpw, setUserpw] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [loginError, setLoginError] = useState('');
    const navigate = useRouter();
    const ModalOpen = () => {
        navigate.push("/signup")
    }
    const ModalClose = () => {
        setIsOpen(false);
    }
    const handleIdChange = (e) => {
        setUserid(e.target.value);
    };

    const handlePwChange = (e) => {
        setUserpw(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 기본 제출 동작 방지

        // 로그인 API 호출
        try {
            const response = await fetch('https://agrounds.com/api/login/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userid, pw: userpw }),
            });

            const data = await response.json();

            if (response.ok) {
                // 로그인 성공 처리, 예: 메인 페이지로 리다이렉트
                navigate.push('/main');
            } else {
                // 로그인 실패 처리, 예: 에러 메시지 표시
                //setLoginError(data.message || '로그인 실패');
                console.error('로그인 요청 실패:', error);
            }
        } catch (error) {
            console.error('로그인 요청 실패:', error);
            setLoginError('로그인 요청 중 오류가 발생했습니다.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {isOpen && (<div className={styles.compbox}><SignupModal ModalClose={ModalClose} /></div>)}
            <div className={styles.login}>
                <div className={styles.logo}>AGROUNDS</div>
                <div className={styles.idbox}><input onChange={handleIdChange} placeholder="아이디" className={styles.id} type="text"></input></div>
                <div className={styles.pwbox}><input onChange={handlePwChange} placeholder="비밀번호" className={styles.pw} type="password"></input></div>

                <Button onClick={handleSubmit} type="submit" color="#FFFFFF" backcolor="#055540" text="로그인" logoimg={logo5} />

                <div className={styles.find}>
                    <div className={styles.signin} onClick={ModalOpen}>회원가입</div>

                    <div className={styles.fid}>아이디 찾기</div>
                    <div className={styles.fline}></div>
                    <div className={styles.fpw}>비밀번호 찾기</div>
                </div>
                <Button logoimg={Kakao} color="black" backcolor="#FEE502" text="카카오톡으로 로그인" />
                <div className={styles.ggback}><Button logoimg={Google} color="black" backcolor="#FFFFFF" text="구글로 로그인" /></div>
            </div>
        </form>
    )
}
export default Login;