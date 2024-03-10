import styles from "./MainSection3.module.css";
import MainSection3_1 from "../../assets/MainSection3_1.png";
import MainSection3_2 from "../../assets/MainSection3_2.png";
import MainSection3_3 from "../../assets/MainSection3_3.png";
import { useNavigate } from "react-router-dom";

function MainSection3(){
    const navigate= useNavigate();

    const moveLeague=()=>{
        navigate('/LeaguePage');
    }
    const moveTeam=()=>{
        navigate('/TeamPage');
    }
    const movePlayer=()=>{
        navigate('/PlayerPage');
    }
    return (
        <div className={styles.MainSection3}>
                <div className={styles.tagbox}>
                    <p className={styles.tag3}>AGROUNDS에서 다 확인할 수 있으니까</p>
                    <p className={styles.tag4}>아마추어 축구에 기록과 통계를 더하다</p>
                </div>
                <div className={styles.boxgroup}>
                    <div className={styles.box1}>
                        <div className={styles.inbox1}><img className={styles.img}src={MainSection3_1}/></div>
                        <div className={styles.inbox4} onClick={moveLeague}><p className={styles.text}>리그 & 컵</p><p className={styles.conf1}>확인 &gt;</p></div>
                    </div>
                    <div className={styles.box1}>
                        <div  className={styles.inbox2}><img className={styles.img}src={MainSection3_2}/></div>
                        <div  className={styles.inbox4} onClick={moveTeam}><p className={styles.text}>팀</p><p className={styles.conf2}>확인 &gt;</p></div>
                    </div>
                    <div className={styles.box1}>
                        <div  className={styles.inbox3}><img className={styles.img}src={MainSection3_3}/></div>
                        <div  className={styles.inbox4} onClick={movePlayer}><p className={styles.text}>선수</p><p className={styles.conf3}>확인 &gt;</p></div>
                    </div>
                </div>
                
            </div>
    )
}
export default MainSection3;