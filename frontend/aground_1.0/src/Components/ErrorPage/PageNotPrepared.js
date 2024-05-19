import styles from "./ErrorPage.module.css"
import GreenButton from "../Common/GreenButton"
import Logo from "../../assets/AgroundTextLogo.svg"

function PageNotPrepared() {
    return (
        <div className={styles.content}>
            <img src={Logo}/>
            <div>현재 준비 중인 페이지입니다.</div>
            <GreenButton text="뒤로가기"/>
        </div>
    )
}

export default PageNotPrepared;