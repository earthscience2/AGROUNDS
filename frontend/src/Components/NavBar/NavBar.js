import React from "react";
import Image from 'next/image';
import Logo1 from "@/assets/logo1.png";
import styles from "./NavBar.module.css";
import { useRouter } from 'next/router';
function NavBar(){
    const navigate = useRouter();
    const moveMain = () => {
        navigate.push("/")
    }
    const DoLogin = () => {
        navigate.push("/login")
    }
    const DoSignin = () => {
        navigate.push("/signup")
    }
    return(
        <div className={styles.Back}>
            <Image onClick={moveMain}className={styles.Logo} src={Logo1} alt="Logo1"/>
            <div className={styles.NavBar}>
                <p className={styles.tag}>리그 & 컵</p>
                <p className={styles.tag}>경기</p>
                <p className={styles.tag}>팀</p>
                <p className={styles.tag}>선수</p>
                <p className={styles.tag}>감독</p>
                <p className={styles.tag}>분석장비</p>
            </div>
            <div className={styles.box2}>
                <div className={styles.Login} onClick={DoLogin}>로그인</div>
                <div className={styles.line}/>
                <div className={styles.Signin} onClick={DoSignin}>회원가입</div>
            </div>
            
        </div>
    )
}
export default NavBar;