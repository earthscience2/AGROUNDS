import React from "react";
import styles from "./SelectName.module.css";
import { useState,useEffect } from "react";
function SelectName(props){
    
    const [isName,setIsName] = useState(false);
    const handleChange=(event)=>{
        props.setName(event.target.value)
        console.log(props.name)
    }
    useEffect(() => {
        if(props.name.length > 2){
            setIsName(true);
        } else {
            setIsName(false);
        }
    }, [props.name]);
    
        return (
        <>
            <p className={styles.name1}> 리그 생성하기</p>
            <p className={styles.name2}>STEP 3. 리그 이름을 적어주세요.</p>
            <div className={styles.box}><input onChange={handleChange}className={styles.input} types='text' placeholder="생성하는 리그의 이름을 적어주세요"/></div>
            {isName? <div onClick={props.handleStep}className={styles.select}>다음</div>:<div className={styles.select}>다음</div>}
            
        </>
    )
}
export default SelectName;