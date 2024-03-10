import React, { useState } from "react";
import styles from "./MakeLeagueConf.module.css";
import ALNavBar from "../../../NavBar/ALNavBar";
import NavBar from "../../../NavBar/NavBar";
import CompanyInfo from "../../../Common/CompanyInfo";
import { Navigate, useNavigate } from "react-router-dom";


function MakeLeagueConf(props){
    const [nickname, setNickname]= useState('');
    const isNickname = sessionStorage.getItem('nickname');
    const navigate = useNavigate();
    
    
    return(
            <>
                    <p className={styles.name1}>리그 생성하기</p>
                    <div className={styles.namebox}><p className={styles.name}>{props.name}</p><p className={styles.alert}>리그가 생성되었습니다.</p></div>
                    <div className={styles.select} onClick={props.gotoMain}>확인</div>
                </>
)}
export default MakeLeagueConf;