import styles from "./TeamDetail.module.css";
import profile from "../../../assets/profile.png";
export default function TeamDetail(){
    return (
        <div className={styles.back0}>
            <div className={styles.back}>
                <div className={styles.teamrank}>
                    <div className={styles.path}>리그 & 컵 &gt; 인천광역시 &gt; 인천 미추홀 리그</div>
                    <div className={styles.contentbox}><img className={styles.profile} src={profile}/>
                        <div className={styles.textbox0}>
                            <div className={styles.FCname}>메시아 FC</div>
                            <div className={styles.textbox}>
                                <div className={styles.text}><p className={styles.text1}>순위</p><p className={styles.text2}>1위</p></div>
                                <div className={styles.text}><p className={styles.text1}>승률</p><p className={styles.text2}>75%</p></div>
                                <div className={styles.text}><p className={styles.text1}>평균연령</p><p className={styles.text2}>23세</p></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <table className={styles.table}>
                            <thead tr className={styles.thead}>
                                <tr className={styles.tr}>
                                    <th className={styles.thead1}>등번호</th>
                                    <th className={styles.thead2}>닉네임</th>
                                    <th className={styles.thead3}>포지션</th>
                                    <th className={styles.thead4}>득점</th>
                                    <th className={styles.thead5}>어시스트</th>
                                    <th className={styles.thead6}>주발</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={styles.tr2}>
                                    <td className={styles.td}>7</td>
                                    <td className={styles.td}>손흥민</td>
                                    <td className={styles.td}>FW</td>
                                    <td className={styles.td}>5</td>
                                    <td className={styles.td}>3</td>
                                    <td className={styles.td}>5/3</td>
                                </tr>
                                <tr className={styles.tr2}>
                                    <td className={styles.td}>7</td>
                                    <td className={styles.td}>손흥민</td>
                                    <td className={styles.td}>FW</td>
                                    <td className={styles.td}>5</td>
                                    <td className={styles.td}>3</td>
                                    <td className={styles.td}>5/3</td>
                                </tr>
                                <tr className={styles.tr2}>
                                    <td className={styles.td}>7</td>
                                    <td className={styles.td}>손흥민</td>
                                    <td className={styles.td}>FW</td>
                                    <td className={styles.td}>5</td>
                                    <td className={styles.td}>3</td>
                                    <td className={styles.td}>5/3</td>
                                </tr>
                                <tr className={styles.tr2}>
                                    <td className={styles.td}>7</td>
                                    <td className={styles.td}>손흥민</td>
                                    <td className={styles.td}>FW</td>
                                    <td className={styles.td}>5</td>
                                    <td className={styles.td}>3</td>
                                    <td className={styles.td}>5/3</td>
                                </tr>
                                <tr className={styles.tr2}>
                                    <td className={styles.td}>7</td>
                                    <td className={styles.td}>손흥민</td>
                                    <td className={styles.td}>FW</td>
                                    <td className={styles.td}>5</td>
                                    <td className={styles.td}>3</td>
                                    <td className={styles.td}>5/3</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className={styles.teammember}>
                <div className={styles.playerpro}>선수 프로필</div>
                    <div className={styles.contentbox1}><img className={styles.profile} src={profile}/>
                    <div className={styles.textbox0}>
                        <div className={styles.FCname}>손흥민</div>
                        <div className={styles.textbox}>
                            <div className={styles.text}><p className={styles.text1}>키</p><p className={styles.text2}>187cm</p></div>
                            <div className={styles.text}><p className={styles.text1}>몸무게</p><p className={styles.text2}>87kg</p></div>
                            <div className={styles.text}><p className={styles.text1}>주발</p><p className={styles.text2}>5/5</p></div>
                        </div>
                        </div>
                    </div>
                    <div className={styles.aboutmem}>
                        <div className={styles.content}>
                            <p className={styles.prefer}>선호 포지션</p>
                            <div className={styles.positionbox}>
                                <div className={styles.position}></div>
                                <div className={styles.contentbox3}><p className={styles.about}>연령/성별</p><p className={styles.about}>등번호</p><p className={styles.about}>골</p><p className={styles.about}>어시스트</p><p className={styles.about}>출전경기</p><p className={styles.about}>경기참여율</p><p className={styles.about}>성실포인트</p></div>
                                <div className={styles.contentbox4}><p className={styles.inform}>25/남</p><p className={styles.inform}>7</p><p className={styles.inform}>7</p><p className={styles.inform}>5</p><p className={styles.inform}>2</p><p className={styles.inform}>50%</p><p className={styles.inform}>150%</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    
    )
}