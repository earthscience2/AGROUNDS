import styles from "./LoginInput.module.css";
import RedDot from "../../assets/Reddot.png";
import { useState } from "react";

function LoginInput(props){
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event)=>{
     setInputValue(event.target.value);
    }
   return(
        
       <div>
            <div className={styles.title}>{props.title}<img src={RedDot} className={styles.redDot}/></div>  
            <input className={styles.input} type={props.type} onChange={handleChange}/> 
       </div>
   )
}
export default LoginInput;