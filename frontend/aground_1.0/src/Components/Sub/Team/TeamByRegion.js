import { useState,useEffect } from "react";
import React from "react";
import styles from "./TeamByRegion.module.css";
import TeamCenterMode from "./TeamCenterSlider";
import SearchLeague from "../../Common/SearchLeague";
import { useNavigate } from "react-router-dom";
import NavBar from "../../NavBar/NavBar";
import ALNavBar from "../../NavBar/ALNavBar";
import CompanyInfo from "../../Common/CompanyInfo";
export default function TeamByRegion(){
    const [nickname, setNickname] = useState('');
    useEffect(()=>{
        const isNickname = sessionStorage.getItem('nickname');
        if(isNickname){
            setNickname(isNickname)
        }
    },[])
    return (
        <>
        
        <div className={styles.back}>
            팀
            <TeamCenterMode/>
        </div>
        
        </>
    )
}
