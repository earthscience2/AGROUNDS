import React from "react";
import Logo1 from "../../assets/Logo1.png";
import styles from "./NavBar.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SignupModal from "../SignUp/SignupModal";
import { NavLink } from "react-router-dom";
function NavBar(){
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const ModalOpen=()=>{
        setIsOpen(true);
    }
    const ModalClose =() =>{
        setIsOpen(false);
    }
    const moveMain = () => {
        navigate("/")
    }
    const DoLogin = () => {
        navigate("/LoginPage");
    }
    // const moveLeague = () => {
    //     navigate("/LeaguePage");
    // }
    // const moveGame = () => {
    //     navigate("/GamePage");
    // }
    // const moveTeam = () => {
    //     navigate("/TeamPage");
    // }
    // const movePlayer = () => {
    //     navigate("/PlayerPage");
    // }
    // const moveDirector = () => {
    //     navigate("/DirectorPage");
    // }
    // const moveEquipment = () => {
    //     navigate("/EquipmentPage");
    // }

    
    
    return(
        <div className={styles.Back}>
            {isOpen &&(<div className={styles.compbox}><SignupModal ModalClose = {ModalClose}/></div>)}
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
                <div className={styles.Login} onClick={DoLogin}>로그인</div>
                <div className={styles.line}/>
                <div className={styles.Signin} onClick={ModalOpen}>회원가입</div>
                
            </div>
            
        </div>
    )
}
export default NavBar;