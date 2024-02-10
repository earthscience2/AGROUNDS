import styles from "./Button.module.css";
import React from "react";

function Button({type, backcolor, color, text,logoimg, onClick}){
    const buttonStyle = {
        backgroundColor: backcolor,
        color: color,
       
    }
    
    return(
        <div type={type}className={styles.button}onClick={onClick} style={buttonStyle}><img className={styles.img} src={logoimg}/>{text}</div>
    )
}
export default Button;