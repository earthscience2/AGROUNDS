import React from "react";
import styles from "./TextInput.module.css";
import { useState } from "react";
function TextInput({text, type, placeholder,errortext, onChange,correcttext,isValid,value}){
    
    return(
        <div className={styles.block1}>
            <div className={styles.block2}>
                    <div className={styles.name}>{text}</div>
                    <input className={styles.input}type={type} value={value}onChange={onChange}placeholder={placeholder}></input>
            </div>
            {isValid === "0" && (
                <p className={styles.errortext} style={{ color: "red" }}>{errortext}</p>
            )}
            {isValid === "1" && (
                <p className={styles.errortext} style={{ color: "rgb(60,100,233)" }}>{correcttext}</p>
            )}
            {isValid === "2" && (
                <p className={styles.errortext} style={{ color: "white" }}>{correcttext}</p>
            )}
            
        
        </div>
    )
}
export default TextInput;