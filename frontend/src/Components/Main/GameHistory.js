import styles from "./GameHistory.module.css";
import { useNavigate } from "react-router-dom";
import SouthKoreaFlag from "../../assets/SouthKoreaFlag.png";
import Rank from "../Common/Rank";
function GameHistory(){
    const navigate = useNavigate();

    const moveRankPage = () => {
        navigate('/LeaguePage')
    }
    return (
        <div className={styles.rankgroup} onClick={moveRankPage}>
                <p className={styles.text5}>LIVE</p>
                <p className={styles.text6}>2024-1 인하대 공대스리가</p>
                <p className={styles.text7}>2024.3.24.(토) 20:30 인하대학교 운동장</p>
                <p className={styles.text7}>공식경기</p>
                <div className={styles.gamegroup}><img src={SouthKoreaFlag} className={styles.flag1}/><p className={styles.team1}>메시아 FC</p><p className={styles.vs}>VS</p><p className={styles.team2}>디딤돌 FC</p><img src={SouthKoreaFlag} className={styles.flag2}/></div>
                <Rank content1="3위" content2="4위" topic="순위"/>
                <Rank content1="1위 2승" content2="1무 2패" topic="전적"/>
                <Rank content1="손흥민" content2="이강인" topic="주요선수"/>
                <Rank content1="박지성" content2="차범근" topic="감독"/>
                <div className={styles.Cheer}>응원하기 &gt;</div>
        </div>
    )
}
export default GameHistory;