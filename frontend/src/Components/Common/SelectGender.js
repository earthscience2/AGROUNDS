import styles from "./SelectGender.module.css";
import { useState } from "react";

function SelectGender({color}) {
  const [selectedGender, setSelectedGender] = useState(null);

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

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
    </div>
  );
}

export default SelectGender;
