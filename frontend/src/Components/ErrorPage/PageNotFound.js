import styles from "./ErrorPage.module.css"
import GreenButton from "../Common/GreenButton"
import Logo from "../../assets/AgroundTextLogo.svg"
import { useNavigate } from "react-router-dom"

function PageNotFound() {
    const navigate = useNavigate()
    const onclick = () => {
        navigate(-1)
    }
    return (
        <div className={styles.content}>
            <img src={Logo}/>
            <div>원하시는 페이지를 찾을 수 없습니다.</div>
            <GreenButton onclick={onclick} text="뒤로가기"/>
        </div>
    )
}

export default PageNotFound;