import React from "react";
import styles from './SelectType.module.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import tournament from "../../../../assets/tournament.png";
import League from "../../../../assets/League.png";
import leagueC from "../../../../assets/leagueC.png";
import tournamentN from "../../../../assets/tournamentN.png";
function SelectType(props){
    const navigate = useNavigate();
    const [step,setStep] = useState(1)
    
    
    const [isClicked,setIsClicked] = useState(false);
    const handleClickT=()=>{
        setIsClicked('T');
        // navigate('/');
        console.log(isClicked)
    }
    const handleClickL=()=>{
        setIsClicked('L');
        // navigate('/');
        console.log(isClicked)
    }
    
    return (
        <>
        <h2 className={styles.name1}>리그 생성하기</h2>
                    <h3 className={styles.name2}>STEP 1. 생성할 대진의 타입을 선택하세요 !</h3>
                    <div className={styles.box}>
                        <div onClick={handleClickT} className={styles.tbox}>
                            {isClicked ==='T'? <img className={styles.tournament}src={tournament}/> : <img className={styles.tournament}src={tournamentN}/>}
                            <p className={styles.text1}>컵</p>
                            <p className={styles.text2}>진 팀을 제외시키며 경기를 해요</p>
                        </div>
                        <div onClick={handleClickL} className={styles.lbox}>
                            {isClicked ==='L' ? <img className={styles.league} src={leagueC}/> : <img className={styles.league} src={League}/>}
                            <p className={styles.text1}>리그</p>
                            <p className={styles.text2}>모든 팀과 경기를 해요</p>
                        </div>
                    </div>
                    {isClicked ? <div onClick={props.handleStep}className={styles.select}>다음</div>:<div className={styles.select}>다음</div>}
        </>
    )
}
export default SelectType;