import styles from "./ALMainSec2.module.css";
import { useNavigate } from "react-router-dom";
function ALMainSec2(){
    const navigate = useNavigate();
    const Equipment=()=>{
        navigate("/EquipmentPage")
    }
    return (
        <div className={styles.MainSection4}>
            <div className={styles.img}></div>
            <div className={styles.textgroup}>
                <p className={styles.text1}>AGROUNDS</p>
                <p className={styles.text2}>초당 10회의 위치 정보로 <br/>빠르고 정확하게</p>
                <p className={styles.text3}>AGROUNDS 만의 기술력을 바탕으로 정확하고 빠르게<br/>실시간 위치 정보를 모바일로 확인 할 수 있습니다.</p>
                <div className={styles.conf}onClick={Equipment}>확인하기 &gt;</div>
            </div>
        </div>
    )
}
export default ALMainSec2;