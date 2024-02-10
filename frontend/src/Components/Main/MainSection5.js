import styles from "./MainSection5.module.css";
import LoginInput from "./LoginInput";
import MainSection from "../../assets/MainSection4.png";
function MainSection5(){
    
    return(

        <div className={styles.MainSection5}>
            <div className={styles.textgroup}>
                <p className={styles.text1}>AGROUNDS</p>
                <p className={styles.text2}>독자적인 분석방법으로 <br/>축구를 재밌고 쉽게</p>
                <p className={styles.text3}>아마추어를 위한 정보 제공을 목표로 누구나<br/>쉽게 알 수 있도록 분석 자료를 제공해 드립니다.</p>
                <div className={styles.conf}>&lt; 확인하기</div>
            </div>
            <div className={styles.img}></div>
        </div>
    )
}
export default MainSection5;