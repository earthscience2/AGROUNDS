import React, { useEffect } from "react";
import Logo1 from "../../assets/Logo1.png";
import styles from "./ALNavBar.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SignupModal from "../SignUp/SignupModal";
import { NavLink } from "react-router-dom";
function NavBar(props){
    const navigate = useNavigate();
    
    const moveMain = () => {
        navigate("/ALMainPage")
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
    const nickname = sessionStorage.getItem('nickname')
    return(
        <div className={styles.Back}>
            
            <img onClick={moveMain}className={styles.Logo} src={Logo1} alt="Logo1"/>
            <nav className={styles.NavBar}>
                <NavLink to='/LeaguePage' className={({isActive})=>
                    isActive ? styles.active : styles.tag}  >리그 & 컵</NavLink>
                <NavLink to='/GamePage' className={({isActive})=>
                    isActive ? styles.active : styles.tag}>경기</NavLink>
                <NavLink to='/TeamPage' className={({isActive})=>
                    isActive ? styles.active : styles.tag}>팀</NavLink>
                <NavLink to='/PlayerPage' className={({isActive})=>
                    isActive ? styles.active : styles.tag}>선수</NavLink>
                <NavLink to='/DirectorPage' className={({isActive})=>
                    isActive ? styles.active : styles.tag}>관리</NavLink>
                <NavLink to='/EquipmentPage' className={({isActive})=>
                    isActive ? styles.active : styles.tag}>전술분석</NavLink>
            </nav>
            <div className={styles.box2}>
                <img className={styles.userimg} src={props.src}/>
                <p className={styles.username}>{nickname}</p>
            </div>
            
        </div>
    )
}
export default NavBar;