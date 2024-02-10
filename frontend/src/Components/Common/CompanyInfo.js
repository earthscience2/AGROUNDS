import React from "react";
import logo3 from "../../../src/assets/logo3.png";
import styles from "./CompanyInfo.module.css";
function CompanyInfo(){
    return(
        <div className={styles.back}>
            <div className={styles.write} >
                <div className={styles.box}>
                    <div className={styles.click1}>이용약관</div>
                    <div className={styles.click1}>문의하기</div>
                    <div className={styles.click1}>개인정보처리방침</div>
                </div>
                <div className={styles.write2}>(주)에이그라운즈</div>
                <div className={styles.write3}>대표자 : 이희구</div>
                <div className={styles.write3}>사업자번호 : 제 2024-인천미추홀구-0000</div>
                <div className={styles.write3}>Tel. 010-7769-4505 | agrounds@gmail.com</div>
                <div className={styles.write3}>주소 : 인하대 어딘가</div>
                <div className={styles.write3}>Copyright AGROUNDS. 2024 All rights reserved</div>
            </div>
            <div className={styles.logo}>
                <img className={styles.logo1} src={logo3}/>
            </div>
        </div>
    )
}
export default CompanyInfo;