
import styles from "./TeamPage.module.css"
import NavBar from "../../../Components/NavBar/NavBar";
import CompanyInfo from "../../../Components/Common/CompanyInfo";
import ALNavBar from "../../../Components/NavBar/ALNavBar";
import { useState } from "react";
import { useEffect } from "react";
import League from "../../../Components/Sub/League/LeagueByRegion";
import dodbogi from "../../../assets/dodbogi.png";
import DropIcon from "../../../assets/DropIcon.png";
import side from "../../../assets/sideIcon.png";
import plus from "../../../assets/plusIcon.png";
import { useNavigate } from "react-router-dom";
import arrow from "../../../assets/Arrow.png";

function RegionTeamPage(){
    const [nickname,setNickname] = useState();
    const [state, setState] = useState();
    const [color, setColor] = useState();
    const navigate = useNavigate();

    const goRegion = () => {
        navigate('/TeamByRegionPage');
    }
    const makeLeague = () => {
        navigate('/MakeLeaguePage');
    }
    const RegionDetail = () => {
        navigate('/TeamByRegionPage');
    }
    useEffect(()=>{
        const isNickname = sessionStorage.getItem('nickname');
        if(isNickname){
            setNickname(isNickname)
        }
    },[])
    const stateSelect = (event) => {
        setState(event.target.value);
        if (event.target.value === "모집중"){
            setColor("#EAAA00")
        } else if(event.target.value === "진행중"){
            setColor("#055540")
        }else{
            setColor("#E41819")
        }
    }
    
    
    return(
        <div>
            {nickname ? <ALNavBar/> : <NavBar/>}
            <div className={styles.back}>
                <div className={styles.othercontents}></div>
                <div className={styles.sortbox}>
                    <div className={styles.searchbox}><img src={dodbogi}/><input className={styles.search}type="text"/></div>
                    <select onClick={stateSelect}name="state" className={styles.sort}>
                    <option className={styles.sort}>티어<img className={styles.dropicon}src={plus}/></option>
                        <option value="브론즈">브론즈</option>
                        <option value="실버">실버</option>
                        <option value="플래티넘">플래티넘</option>
                        <option value="다이아">다이아</option>
                        <option value="마스터">마스터</option>
                        </select>
                </div>
                <div className={styles.contentbox}>
                    <div className={styles.leaguebox}>
                        <div className={styles.textgroup2}>
                        <div className={styles.textgroup}>
                            <p className={styles.text1}>팀</p>
                            <p className={styles.text2}>인천광역시</p>
                        </div>
                        <div className={styles.region} onClick={goRegion}>지역별 리그 ></div>
                        </div>
                        <table className={styles.table}>
                            <thead tr className={styles.thead}>
                                <tr className={styles.tr}>
                                    <th className={styles.thead1}>티어</th>
                                    <th className={styles.thead2}>팀이름</th>
                                    <th className={styles.thead3}>지역</th>
                                    <th className={styles.thead4}>선수 수</th>
                                    <th className={styles.thead5}>평균연령</th>
                                    <th className={styles.thead6}>최근 경기일</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr onClick={RegionDetail}className={styles.tr2}>
                                    <td className={styles.td}>브론즈</td>
                                    <td className={styles.td}>인천 미추홀구 리그</td>
                                    <td className={styles.td}>일반 리그</td>
                                    <td className={styles.td}>12팀</td>
                                    <td style={{color:color}}className={styles.td1}>모집중</td>
                                    <td className={styles.td}>2024.08.30</td>
                                </tr>
                                <tr className={styles.tr2}>
                                    <td className={styles.td}>브론즈</td>
                                    <td className={styles.td}>인천 미추홀구 리그</td>
                                    <td className={styles.td}>일반 리그</td>
                                    <td className={styles.td}>12팀</td>
                                    <td style={{color:color}}className={styles.td1}>모집중</td>
                                    <td className={styles.td}>2024.08.30</td>
                                </tr>
                                <tr className={styles.tr2}>
                                    <td className={styles.td}>브론즈</td>
                                    <td className={styles.td}>인천 미추홀구 리그</td>
                                    <td className={styles.td}>일반 리그</td>
                                    <td className={styles.td}>12팀</td>
                                    <td style={{color:color}}className={styles.td1}>모집중</td>
                                    <td className={styles.td}>2024.08.30</td>
                                </tr>
                                <tr className={styles.tr2}>
                                    <td className={styles.td}>브론즈</td>
                                    <td className={styles.td}>인천 미추홀구 리그</td>
                                    <td className={styles.td}>일반 리그</td>
                                    <td className={styles.td}>12팀</td>
                                    <td style={{color:color}}className={styles.td1}>모집중</td>
                                    <td className={styles.td}>2024.08.30</td>
                                </tr>
                                <tr className={styles.tr2}>
                                    <td className={styles.td}>브론즈</td>
                                    <td className={styles.td}>인천 미추홀구 리그</td>
                                    <td className={styles.td}>일반 리그</td>
                                    <td className={styles.td}>12팀</td>
                                    <td style={{color:color}}className={styles.td1}>모집중</td>
                                    <td className={styles.td}>2024.08.30</td>
                                </tr>
                                <tr className={styles.tr2}>
                                    <td className={styles.td}>브론즈</td>
                                    <td className={styles.td}>인천 미추홀구 리그</td>
                                    <td className={styles.td}>일반 리그</td>
                                    <td className={styles.td}>12팀</td>
                                    <td style={{color:color}}className={styles.td1}>모집중</td>
                                    <td className={styles.td}>2024.08.30</td>
                                </tr>
                                <tr className={styles.tr2}>
                                    <td className={styles.td}>브론즈</td>
                                    <td className={styles.td}>인천 미추홀구 리그</td>
                                    <td className={styles.td}>일반 리그</td>
                                    <td className={styles.td}>12팀</td>
                                    <td style={{color:color}}className={styles.td1}>모집중</td>
                                    <td className={styles.td}>2024.08.30</td>
                                </tr>
                                <tr className={styles.tr2}>
                                    <td className={styles.td}>브론즈</td>
                                    <td className={styles.td}>인천 미추홀구 리그</td>
                                    <td className={styles.td}>일반 리그</td>
                                    <td className={styles.td}>12팀</td>
                                    <td style={{color:color}}className={styles.td1}>모집중</td>
                                    <td className={styles.td}>2024.08.30</td>
                                </tr>
                                <tr className={styles.tr2}>
                                    <td className={styles.td}>브론즈</td>
                                    <td className={styles.td}>인천 미추홀구 리그</td>
                                    <td className={styles.td}>일반 리그</td>
                                    <td className={styles.td}>12팀</td>
                                    <td style={{color:color}}className={styles.td1}>모집중</td>
                                    <td className={styles.td}>2024.08.30</td>
                                </tr>
                                <tr className={styles.tr2}>
                                    <td className={styles.td}>브론즈</td>
                                    <td className={styles.td}>인천 미추홀구 리그</td>
                                    <td className={styles.td}>일반 리그</td>
                                    <td className={styles.td}>12팀</td>
                                    <td style={{color:color}}className={styles.td1}>모집중</td>
                                    <td className={styles.td}>2024.08.30</td>
                                </tr>
                                <tr className={styles.tr2}>
                                    <td className={styles.td}>브론즈</td>
                                    <td className={styles.td}>인천 미추홀구 리그</td>
                                    <td className={styles.td}>일반 리그</td>
                                    <td className={styles.td}>12팀</td>
                                    <td style={{color:color}}className={styles.td1}>모집중</td>
                                    <td className={styles.td}>2024.08.30</td>
                                </tr>
                                
                            </tbody>
                            
                        </table>
                        <div className={styles.contentpages}><img src={arrow} className={styles.arrowl}/><p className={styles.pages}>1</p><img src={arrow} className={styles.arrow}/></div>
                       </div>
                       <div className={styles.makeLeague} ><p className={styles.plus}>+</p>리그 만들기</div>
                </div>
                
            </div>
            <CompanyInfo/>
        </div>
    )
}
export default RegionTeamPage;
