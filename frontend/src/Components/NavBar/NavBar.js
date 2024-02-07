import React, { useState } from "react";
import Image from 'next/image';
import Logo1 from "@/assets/logo1.png";
import styles from "./NavBar.module.css";
import { useRouter } from 'next/router';
import Button_signup from "../Common/Button_signup";
import Google from "../../../src/assets/Google.png";
import Kakao from "../../../src/assets/Kakao.png";
import logo5 from "../../assets/logo5.png";

function NavBar() {
    const navigate = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const moveMain = () => {
        navigate.push("/")
    }
    const DoLogin = () => {
        navigate.push("/login")
    }
    const DoSignin = () => {
        navigate.push("/signup")
    }
    const DoLeague = () => {
        navigate.push("/league")
    }
    const DoMatch = () => {
        navigate.push("/match")
    }
    const DoTeam = () => {
        navigate.push("/team")
    }
    const DoPlayer = () => {
        navigate.push("/player")
    }
    const DoCoach = () => {
        navigate.push("/coach")
    }
    const DoDivice = () => {
        navigate.push("/device")
    }
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };
    return (
        <div className={styles.Back}>
            <div className={styles.box1}>
                <Image onClick={moveMain} className={styles.Logo} src={Logo1} alt="Logo1" />
                <div className={styles.NavBar}>
                    <p className={styles.tag1} onClick={DoLeague}>리그 & 컵</p>
                    <p className={styles.tag2} onClick={DoMatch}>경기</p>
                    <p className={styles.tag3} onClick={DoTeam}>팀</p>
                    <p className={styles.tag4} onClick={DoPlayer}>선수</p>
                    <p className={styles.tag5} onClick={DoCoach}>감독</p>
                    <p className={styles.tag6} onClick={DoDivice}>분석장비</p>
                </div>
            </div>
            <div className={styles.box2}>
                <div className={styles.Login} onClick={DoLogin}>로그인</div>
                <div className={styles.line} />
                <div className={styles.Signin} onClick={togglePopup}>회원가입</div>

                {showPopup && (
                    <div className={styles.popupOverlay}>
                        <div className={styles.popup}>
                            <div className={styles.popupContent}>
                                <Button_signup logoimg={logo5} color="FFFFFF" backcolor="#055540" onClick={() => navigate.push('/signup/')} text="AGROUNDS로 회원가입" />
                                <Button_signup logoimg={Kakao} color="black" backcolor="#FEE502" onClick={() => navigate.push('/signup/kakao')} text="카카오톡으로 회원가입" />
                                <div className={styles.ggback}><Button_signup logoimg={Google} color="black" backcolor="#FFFFFF" onClick={() => navigate.push('/signup/google')} text="구글로 회원가입" /></div>

                            </div>
                            <div className={styles.closePopup} onClick={togglePopup}>닫기</div>
                        </div>
                    </div>
                )}

            </div>

        </div>
    )
}
export default NavBar;