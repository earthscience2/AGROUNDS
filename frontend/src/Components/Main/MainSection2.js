import React, { useEffect } from "react";
import styles from "./MainSection2.module.css";
import logo from "../../assets/logo4.png";
import { useState} from "react";

function MainSection2(){
    const [showDiv, setShowDiv] = useState(false);

  

    return(
        <div className={`${styles.MainSection2} ${showDiv ? styles.show : ''}`}>
            <div className={styles.textgroup1}>
                <div className={styles.textgroup1_1}>
                    <p className={styles.text1}>경기를 재밌게</p>
                    <p className={styles.text2}><span className={styles.text5}>아마추어</span> 축구리그</p>
                    <p className={styles.text3}>AGROUNDS에서 리그를 만들거나 인기있는 리그에 참여하고 <br/>
                    새로운 리그를 개설하거나 원하는 리그에 참여해서 우승해보세요.</p>
                    <div className={styles.confirm1}>확인하기 -&gt;</div>
                </div>
                <div className={styles.line}/>
                <div className={styles.textgroup1_2}>
                    <p className={styles.text1}>어려운 전술분석은</p>
                    <p className={styles.text5}>AGROUNDS</p>
                    <p className={styles.text3}>GPS 장비를 이용해서 경기기록과 분석까지 한 번에 가능하고<br/>
                    히트맵, 이동거리, 전술 분석 등 다양한 정보를 제공합니다.</p>
                    <div className={styles.confirm2}> &lt;- 확인하기</div>
                </div>
            </div>
            <div className={styles.textgroup2}>
                <p className={styles.text7}><span className={styles.text9}>A</span>mateur</p>
                <p className={styles.text7}><span className={styles.text9}>A</span>ssist</p>
                <p className={styles.text7}><span className={styles.text9}>A</span>class</p>
                <p className={styles.text8}>AGROUNDS는 아마추어(Amateur)들을<br/>
                어시스트(Assist)하여 실력을 한 단계<br/>
                성장(Aclass)시키기 위한 플랫폼입니다.</p>
            </div>
            <img className={styles.logo} src={logo}/>
        </div>
    )
}
export default MainSection2;