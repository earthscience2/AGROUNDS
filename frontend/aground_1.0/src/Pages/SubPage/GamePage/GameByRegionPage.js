import { useState,useEffect } from "react";
import React from "react";
import styles from "./GameByRegionPage.module.css";
import GameCenterMode from "../../../Components/Sub/Game/GameCentermode";
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
            경기
            <GameCenterMode/>
        </div>
        <CompanyInfo/>
        </>
    )
}
export default GameByRegionPage;
