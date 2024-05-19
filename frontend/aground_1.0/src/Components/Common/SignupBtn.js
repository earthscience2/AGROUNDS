import styles from "./SignupBtn.module.css";
import React from "react";


function SignupBtn({backcolor, color, text,logoimg, onClick}){
    const buttonStyle = {
        backgroundColor: backcolor,
        color: color,
       
    }
    
    
    return(
        <div className={styles.button} onClick={onClick} style={buttonStyle}>
            <p className={styles.text}>{text}</p>
            <div className={styles.imgbox}><img className={styles.img} src={logoimg}/></div>
        </div>
    )
}
export default SignupBtn;