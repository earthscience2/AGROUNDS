import styles from "./ErrorPage.module.css"
import GreenButton from "../Common/GreenButton"
import Logo from "../../assets/AgroundTextLogo.svg"
import { useNavigate } from "react-router-dom"

function LoginErrorPage() {
    const navigate = useNavigate()
    const onclick = () => {
        navigate(-1)
    }
    return (
        <div className={styles.content}>
            <img src={Logo}/>
            <div>앗! 로그인 후 이용가능해요.</div>
            <GreenButton onclick={onclick} text="뒤로가기"/>
        </div>
    )
}

export default LoginErrorPage;