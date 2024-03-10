import { useState,useEffect } from "react";
import React from "react";
import styles from "./LeagueByRegion.module.css";
import CenterMode from "../CenterSlider";
import SearchLeague from "../../Common/SearchLeague";
import { useNavigate } from "react-router-dom";
import NavBar from "../../NavBar/NavBar";
import ALNavBar from "../../NavBar/ALNavBar";
import CompanyInfo from "../../Common/CompanyInfo";
function League(){
    const [nickname, setNickname] = useState('');
    useEffect(()=>{
        const isNickname = sessionStorage.getItem('nickname');
        if(isNickname){
            setNickname(isNickname)
        }
    },[])
    return (
        <>
        {nickname?<ALNavBar/>:<NavBar/>}
        <div className={styles.back}>
            리그 & 컵
            <CenterMode/>
        </div>
        <CompanyInfo/>
        </>
    )
}
export default League;