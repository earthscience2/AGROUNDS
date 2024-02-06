import styles from "./Button.module.css";
import React from "react";
import Image from 'next/image';

function Button_sign({type, backcolor, color, text,logoimg, onClick}){
    const buttonStyle = {
        backgroundColor: backcolor,
        color: color,
       
    }
    
    return(
        <div type={type}className={styles.button_sign}onClick={onClick} style={buttonStyle}><Image className={styles.img} src={logoimg}/>{text}</div>
    )
}
export default Button_sign;
