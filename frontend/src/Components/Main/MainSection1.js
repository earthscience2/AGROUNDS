import React from "react";
import styles from "./MainSection1.module.css";
import { useNavigate } from "react-router-dom";
import MainSection from "../../assets/MainSection1.png";
import GameHistory from "./GameHistory";
function MainSection1(){
    const navigate = useNavigate();
    
    const Subscribe = () => {
        navigate("/MainPage")
    }
    const rankpage = () => {
        navigate("/Loginpage")
    }
    return(
        <div className={styles.Block1}>
            <div className={styles.textgroup}>
                <p className={styles.text1}>AGROUNDS</p>
                <p className={styles.text2}>당신이 원한</p>
                <p className={styles.text3}><span className={styles.text7}>아마추어</span> 축구 플랫폼</p>
                <p className={styles.text4}>AGROUNDS는 아마추어 축구인을 위해 <br/>
                모든 경기가 재밌는 경기가 되도록 노력하는 <br/>
                축구인들을 위한 플랫폼입니다.</p>
            </div>
            <GameHistory/>
        </div>
    )
}
export default MainSection1;