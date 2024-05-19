import { useState,useEffect } from "react";
import React from "react";
import styles from "./PlayerByRegionPage.module.css";
import PlayerCenterMode from "../../../Components/Sub/Player/PlayerCentermode";
import SearchLeague from "../../../Components/Common/SearchLeague";
import NavBar from "../../../Components/NavBar/NavBar";
import ALNavBar from "../../../Components/NavBar/ALNavBar";
import CompanyInfo from "../../../Components/Common/CompanyInfo";

function GameByRegionPage(){
    const [nickname, setNickname] = useState('');
    useEffect(()=>{
        const isNickname = sessionStorage.getItem('nickname');
        if(isNickname){
            setNickname(isNickname)
        }
    },[])
    return (
        <>
        {nickname ? <ALNavBar/>:<NavBar/>}
        <div className={styles.back}>
            선수
            <PlayerCenterMode/>
        </div>
        <CompanyInfo/>
        </>
    )
}
export default GameByRegionPage;
