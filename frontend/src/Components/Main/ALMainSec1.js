import styles from "./ALMainSec1.module.css";
import MainSection3_1 from "../../assets/MainSection3_1.png"
import ALMainSec1_1 from "../../assets/ALMainSec1_1.png"
import MainSection3_2 from "../../assets/MainSection3_2.png"
import MainSection3_3 from "../../assets/MainSection3_3.png"
import { useNavigate } from "react-router-dom";
import GameHistory from "./GameHistory";
function ALMainSec1(){
    const navigate = useNavigate();
    const rankpage = () => {
        navigate("/Loginpage")
    }
    const leaguePage = () => {
        navigate('/LeaguePage')
    }
    const playerPage = () =>{
        navigate("/PlayerPage")
    }
    const GamePage = () =>{
        navigate("/GamePage")
    }
    const TeamPage = () =>{
        navigate('/TeamPage')
    }
    return (
        <div className={styles.back}>
            <div className={styles.boxgroup}>
                    <div className={styles.box1} onClick={leaguePage}>
                        <div className={styles.inbox1}><img className={styles.img}src={MainSection3_1}/></div>
                        <div className={styles.inbox4}><p className={styles.text}>리그 & 컵</p><p className={styles.conf1}>확인 &gt;</p></div>
                    </div>
                    <div className={styles.box1} onClick={GamePage}>
                        <div  className={styles.inbox5}><img className={styles.img}src={ALMainSec1_1}/></div>
                        <div  className={styles.inbox4}><p className={styles.text}>경기</p><p className={styles.conf1}>확인 &gt;</p></div>
                    </div>
                    <div className={styles.box1} onClick={playerPage}>
                        <div  className={styles.inbox3}><img className={styles.img}src={MainSection3_3}/></div>
                        <div  className={styles.inbox4}><p className={styles.text}>선수</p><p className={styles.conf1}>확인 &gt;</p></div>
                    </div>
                    <div className={styles.box1} onClick={TeamPage}>
                        <div  className={styles.inbox2}><img className={styles.img}src={MainSection3_2}/></div>
                        <div  className={styles.inbox4}><p className={styles.text}>팀</p><p className={styles.conf1}>확인 &gt;</p></div>
                    </div>
                </div>
                <GameHistory/>
            
        </div>
    )
}
export default ALMainSec1;
