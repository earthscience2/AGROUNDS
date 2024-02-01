import React from "react";
import styles from "./TextInput.module.css";
function TextInput({text, type, placeholder}){
    return(
        <div className={styles.block2}>
                <div className={styles.name}>{text}</div>
                <input className={styles.input}type={type} placeholder={placeholder}></input>
        </div>
    )
}
export default TextInput;