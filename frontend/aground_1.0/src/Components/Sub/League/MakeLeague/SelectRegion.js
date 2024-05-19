import React, { useEffect } from "react";
import styles from "./SelectRegion.module.css";
import { useState} from "react";
function SelectRegion(props){
    const [selectregion, setSelectregion] = useState('지역선택');
    const [isClicked,setIsClicked] = useState(false)
    const handleChange = (event) => {
        props.setRegion(event.target.value)
        console.log(event.target.value)
    }
    useEffect(()=>{
        {props.region ==='지역선택' ?setIsClicked(false):setIsClicked(true)}
    },[props.region])
    return (
        <>
            <p className={styles.name1}> 리그 생성하기</p>
            <p className={styles.name2}>STEP 4. 리그를 진행할 지역범위를 설정해 주세요.</p>

            <select className={styles.selectbox}value='option' onChange={handleChange}>
                <option value="지역선택">{props.region}</option>
                <option value="서울특별시">서울특별시</option>
                <option value="부산광역시">부산광역시</option>
                <option value="인천광역시">인천광역시</option>
                <option value="대전광역시">대전광역시</option>
                <option value="대구광역시">대구광역시</option>
                <option value="울산광역시">울산광역시</option>
                <option value="광주광역시">광주광역시</option>
                <option value="경기도">경기도</option>
                <option value="강원도">강원도</option>
                <option value="충청북도">충청북도</option>
                <option value="충청남도">충청남도</option>
                <option value="경상북도">경상북도</option>
                <option value="경상남도">경상남도</option>
                <option value="전라북도">전라북도</option>
                <option value="전라남도">전라남도</option>
                <option value="세종특별자치도">세종특별자치도</option>
                <option value="제주특별자치도">제주특별자치도</option>

            </select>
            {isClicked?<div onClick={props.handleStep}className={styles.select}>다음</div>:<div className={styles.select}>다음</div>}
      
    
            
        </>
    )
}
export default SelectRegion;