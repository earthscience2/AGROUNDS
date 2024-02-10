import styles from "./SelectGender.module.css";
import { useEffect, useState } from "react";

function SelectGender({color, setGender}) {
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectNone, setSelectNone] = useState('');

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setGender(gender);
    console.log(gender)
  };
  const handleGenderNone = (event) => {
    setSelectNone(event.target.checked);
  }
  useEffect((gender) =>{
    setSelectNone(false)
  },[setGender])

  return (
    <div className={styles.block4}>
      성별
      <button
        type="button"className={`${styles['gender-button']} ${selectedGender === "male" ? styles.active : ''}`}
        onClick={() => handleGenderSelect("male")} style = {{backgroundColor: selectedGender === 'male'? color: 'white'}}
      >
        남자
      </button>
      <button
        type="button" className={`${styles['gender-button']} ${selectedGender === "female" ? styles.active : ''}`}
        onClick={() => handleGenderSelect("female")} style = {{backgroundColor: selectedGender === 'female'? color: 'white'}}
      >
        여자
      </button>
      
      <div className={styles.checkbox}><p className={styles.none}>선택안함</p>
      <input style = {{backgroundColor: selectedGender === 'None'? color: 'white'}} className={`${styles['check']} ${selectedGender === "None" ? styles.active : ''}`} checked={selectNone}onChange={() => handleGenderSelect("None")} type="checkbox" /></div>
    </div>
  );
}

export default SelectGender;
