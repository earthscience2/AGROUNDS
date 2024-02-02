import styles from "./Button.module.css";
import React from "react";
import Image from 'next/image';

function Button({type, backcolor, color, text,logoimg, onClick}){
    const buttonStyle = {
        backgroundColor: backcolor,
        color: color,
       
    }
    
    return(
        <div type={type}className={styles.button}onClick={onClick} style={buttonStyle}><Image className={styles.img} src={logoimg}/>{text}</div>
    )
}
export default Button;