import { useState } from "react";
import styles from "./LeagueDetail.module.css"
import { useNavigate } from "react-router-dom";
export default function LeagueDetail(props){
    const navigate = useNavigate();
    const TeamDetail = () =>{
        navigate('/TeamDetailPage')
    }
    return (
        <div className={styles.back}>
            <div className={styles.leaguebox}>
                        <div className={styles.textgroup2}>
                        <div className={styles.textgroup}>
                            <p className={styles.text1}>리그 & 컵 &gt; 인천광역시</p>
                            <p className={styles.text2}>인천 미추홀 리그</p>
                        </div>
                        
                        </div>
                        <table className={styles.table}>
                            <thead tr className={styles.thead}>
                                <tr className={styles.tr}>
                                    <th className={styles.thead1}>순위</th>
                                    <th className={styles.thead2}>팀</th>
                                    <th className={styles.thead3}>경기수</th>
                                    <th className={styles.thead4}>승</th>
                                    <th className={styles.thead5}>무</th>
                                    <th className={styles.thead6}>패</th>
                                    <th className={styles.thead7}>득점</th>
                                    <th className={styles.thead8}>실점</th>
                                    <th className={styles.thead9}>포인트</th>
                                    <th className={styles.thead10}>최근 5개 경기</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr onClick={TeamDetail}className={styles.tr2}>
                                    <td className={styles.td}>1</td>
                                    <td className={styles.td}>메시아 FC</td>
                                    <td className={styles.td}>15</td>
                                    <td className={styles.td}>10</td>
                                    <td className={styles.td}>2</td>
                                    <td className={styles.td}>3</td>
                                    <td className={styles.td}>10</td>
                                    <td className={styles.td}>5</td>
                                    <td className={styles.td}>154</td>
                                    <td className={styles.td}>1 1 1 1 1</td>
                                </tr>
                                <tr onClick={TeamDetail}className={styles.tr2}>
                                    <td className={styles.td}>1</td>
                                    <td className={styles.td}>메시아 FC</td>
                                    <td className={styles.td}>15</td>
                                    <td className={styles.td}>10</td>
                                    <td className={styles.td}>2</td>
                                    <td className={styles.td}>3</td>
                                    <td className={styles.td}>10</td>
                                    <td className={styles.td}>5</td>
                                    <td className={styles.td}>154</td>
                                    <td className={styles.td}>1 1 1 1 1</td>
                                </tr>
                                <tr onClick={TeamDetail}className={styles.tr2}>
                                    <td className={styles.td}>1</td>
                                    <td className={styles.td}>메시아 FC</td>
                                    <td className={styles.td}>15</td>
                                    <td className={styles.td}>10</td>
                                    <td className={styles.td}>2</td>
                                    <td className={styles.td}>3</td>
                                    <td className={styles.td}>10</td>
                                    <td className={styles.td}>5</td>
                                    <td className={styles.td}>154</td>
                                    <td className={styles.td}>1 1 1 1 1</td>
                                </tr>
                                <tr onClick={TeamDetail}className={styles.tr2}>
                                    <td className={styles.td}>1</td>
                                    <td className={styles.td}>메시아 FC</td>
                                    <td className={styles.td}>15</td>
                                    <td className={styles.td}>10</td>
                                    <td className={styles.td}>2</td>
                                    <td className={styles.td}>3</td>
                                    <td className={styles.td}>10</td>
                                    <td className={styles.td}>5</td>
                                    <td className={styles.td}>154</td>
                                    <td className={styles.td}>1 1 1 1 1</td>
                                </tr>
                                <tr onClick={TeamDetail}className={styles.tr2}>
                                    <td className={styles.td}>1</td>
                                    <td className={styles.td}>메시아 FC</td>
                                    <td className={styles.td}>15</td>
                                    <td className={styles.td}>10</td>
                                    <td className={styles.td}>2</td>
                                    <td className={styles.td}>3</td>
                                    <td className={styles.td}>10</td>
                                    <td className={styles.td}>5</td>
                                    <td className={styles.td}>154</td>
                                    <td className={styles.td}>1 1 1 1 1</td>
                                </tr>
                                <tr onClick={TeamDetail}className={styles.tr2}>
                                    <td className={styles.td}>1</td>
                                    <td className={styles.td}>메시아 FC</td>
                                    <td className={styles.td}>15</td>
                                    <td className={styles.td}>10</td>
                                    <td className={styles.td}>2</td>
                                    <td className={styles.td}>3</td>
                                    <td className={styles.td}>10</td>
                                    <td className={styles.td}>5</td>
                                    <td className={styles.td}>154</td>
                                    <td className={styles.td}>1 1 1 1 1</td>
                                </tr>
                                <tr onClick={TeamDetail}className={styles.tr2}>
                                    <td className={styles.td}>1</td>
                                    <td className={styles.td}>메시아 FC</td>
                                    <td className={styles.td}>15</td>
                                    <td className={styles.td}>10</td>
                                    <td className={styles.td}>2</td>
                                    <td className={styles.td}>3</td>
                                    <td className={styles.td}>10</td>
                                    <td className={styles.td}>5</td>
                                    <td className={styles.td}>154</td>
                                    <td className={styles.td}>1 1 1 1 1</td>
                                </tr>
                            </tbody>
                        </table>

        </div>
                        <div className={styles.schedulebox}>
                            <div className={styles.text3}>경기결과 & 일정</div>
                            <div className={styles.box}>
                                <div className={styles.uptextbox}>
                                    <div className={styles.textbox}>
                                    <img className={styles.profile} src={props.src}/><p className={styles.text4}>메시아 FC</p><p className={styles.text5}>3</p></div>
                                    <div className={styles.textbox}><img className={styles.profile} src={props.src}/><p className={styles.text4}>디딤돌 FC</p><p className={styles.text5}>3</p></div>
                                    </div>  
                                    <p className={styles.text6}>1.12 (수)</p>
                                
                            </div>
                        </div>
        </div>
    )
}