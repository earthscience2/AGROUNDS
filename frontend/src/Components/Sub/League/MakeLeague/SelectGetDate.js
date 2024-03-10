import React from "react";
import styles from "./SelectDate.module.css";
import { useState, useEffect } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Navigate, useNavigate } from "react-router-dom";
function SelectGetDate(props){
    const navigate = useNavigate();
    const [isClicked,setIsClicked] = useState(false);
    
    useEffect(()=>{
        {props.startJoin < props.endJoin?setIsClicked(true):setIsClicked(false)}
    },[props.startJoin,props.endJoin])
    const lastStep=()=>{
        navigate('/MakeLeagueConf');
    }
   
    return (
        <>
            <p className={styles.name1}>{props.name} 리그 생성하기</p>
            <p className={styles.name2}>STEP 6. 리그 참여 기간을 선택해주세요.</p>
            <div className={styles.box}>
            <DatePicker 
                className={styles.date1}
                dateFormat="yyyy.MM.dd"
                selected={props.startJoin}
                onChange={(date) => props.setStartJoin(date)}/>
                -
            <DatePicker 
                className={styles.date2}
                dateFormat="yyyy.MM.dd"
                selected={props.endJoin}
                endDate={props.endJoin}
                onChange={(date) => props.setEndJoin(date)}/>
            </div>
            {isClicked?<div className={styles.select} onClick={props.handleStep}>다음</div>:<div className={styles.select} >다음</div>}
        </>
    )
}
export default SelectGetDate;