import React from "react";
import styles from './SelectType.module.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SelectPG(props){
    const navigate = useNavigate();
    const [isClicked,setIsClicked] = useState(false);
    const handleClickP=()=>{
        props.setType('P');
        // navigate('/');
        console.log(isClicked)
    }
    const handleClickG=()=>{
        props.setType('G');
        // navigate('/');
        console.log(isClicked)
    }
    return (
        <>
        <h2 className={styles.name1}>리그 생성하기</h2>
                    <h3 className={styles.name2}>STEP 2. 리그 종류를 선택해주세요.</h3>
                    <div className={styles.box}>
                        <div onClick={handleClickP} className={styles.box1}>
                            <div className={props.type === 'P'?styles.pboxA: styles.pbox}><p className={styles.text5}>순위가 더 높은 팀을 잡으면 <br/>더 높은 점수를 얻는 방식입니다.</p><p className={styles.text3}>일정한 경기를 진행하기 어려운 팀들에게 <br/>적합한 리그 입니다.</p></div>
                            <p className={styles.text6}>포인트 리그</p>
                        </div>
                        <div onClick={handleClickG} className={styles.box1}>
                        <div className={props.type === 'G'?styles.pboxA: styles.pbox}><p className={styles.text5}>프로에서 사용하는 <br/>일반적인 리그 진행 방식입니다.</p><p className={styles.text3}>꾸준한 경기를 통해 승자를 가려낼 수 있습니다.</p><p className={styles.text4}>*승리는 3점, 무승부는 1점, 패배 시에는 0점을 얻습니다.</p></div>
                            <p className={styles.text6}>일반 리그</p>
                            
                        </div>
                    </div>
                    {props.type?<div onClick={props.handleStep}className={styles.select}>다음</div>:<div className={styles.select}>다음</div>}
        </>
    )
}