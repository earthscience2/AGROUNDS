import React from "react";
import Logo1 from "../../assets/Logo1.png";
import styles from "./ALNavBar.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SignupModal from "../SignUp/SignupModal";

function NavBar({username, src}){
    const navigate = useNavigate();
    
    const moveMain = () => {
        navigate("/")
    }
    const DoLogin = () => {
        navigate("/LoginPage")
    }
    const moveLeague = () => {
        navigate("/LeaguePage");
    }
    const moveGame = () => {
        navigate("/GamePage");
    }
    const moveTeam = () => {
        navigate("/TeamPage");
    }
    const movePlayer = () => {
        navigate("/PlayerPage");
    }
    const moveDirector = () => {
        navigate("/DirectorPage");
    }
    const moveEquipment = () => {
        navigate("/EquipmentPage");
    }
    return(
        <div className={styles.Back}>
            
            <img onClick={moveMain}className={styles.Logo} src={Logo1} alt="Logo1"/>
            <div className={styles.NavBar}>
                <p onClick={moveLeague}className={styles.tag}>리그 & 컵</p>
                <p onClick={moveGame}className={styles.tag}>경기</p>
                <p onClick={moveTeam}className={styles.tag}>팀</p>
                <p onClick={movePlayer}className={styles.tag}>선수</p>
                <p onClick={moveDirector}className={styles.tag}>감독</p>
                <p onClick={moveEquipment}className={styles.tag}>분석장비</p>
            </div>
            <div className={styles.box2}>
                <img className={styles.userimg} src={src}/>
                <p className={styles.username}>{username}</p>
            </div>
            
        </div>
    )
}
export default NavBar;