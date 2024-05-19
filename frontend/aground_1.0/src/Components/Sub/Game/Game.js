import styles from "./Game.module.css";
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
import profile from "../../../assets/profile.png";
import client from "../../../Clients";
import defaultimg from "../../../assets/profile.png";

export default function PlayerPage(){
    const [nickname,setNickname] = useState();
    const [state, setState] = useState();
    const [playerDatas,setPlayerDatas] = useState();
    const [currentPage,setCurrentPage] = useState(1);
    const [data,setData] = useState({})
    const [basic,setBasic] = useState('B')
    const itemsPerPage = 10;
    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    const [slicedData,setSlicedData] = useState([]);
    
    const [element,setElement]=useState([]);
    const navigate = useNavigate();

    const goRegion = () => {
        navigate('/GameByRegionPage');
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
    }
    useEffect(()=>{
        client.get('api/player/get-all-players/')
        .then(function(response){
            setPlayerDatas(response.data.data)
            // console.log(response.data.data[0])
            setSlicedData(response.data.data.slice(startIndex, endIndex))
            
            let tmp = []
            for (let i=1;i<response.data.data.length/10+1;i++){
                tmp[i-1] = i
                
            }
            setElement(tmp)
            console.log(element)
    })
    },[])
    const pagination = (pages) => {
        console.log(pages)
        startIndex = (pages - 1) * itemsPerPage;
        endIndex = startIndex + itemsPerPage;
    }
    
    const inform = (item) => {
        console.log(item)
        setData(item)
    }
    const basicClick = () =>{
        setBasic('B')
        console.log(basic)
    }
    const lineupClick = () =>{
        setBasic('L')
        console.log(basic)
    }
    
    



    return(
        <div>
            {nickname ? <ALNavBar/> : <NavBar/>}
            <div className={styles.back}>
                <div className={styles.back1}>
                    <div className={styles.back2}>
                        <div className={styles.sortbox}>
                            <div className={styles.searchbox}><img src={dodbogi}/><input className={styles.search}type="text"/></div>
                            <select onClick={stateSelect}name="state" className={styles.sort}>
                                <option className={styles.sort}>포지션<img className={styles.dropicon}src={plus}/></option>
                                <option value="ST">ST</option>
                                <option value="LWF">LWF</option>
                                <option value="RWF">RWF</option>
                                <option value="LWM">LWM</option>
                                <option value="CAM">CAM</option>
                                <option value="RWM">RWM</option>
                                <option value="LM">LM</option>
                                <option value="CM">CM</option>
                                <option value="RM">RM</option>
                                <option value="LWB">LWB</option>
                                <option value="CDM">CDM</option>
                                <option value="RWB">RWB</option>
                                <option value="LB">LB</option>
                                <option value="CB">CB</option>
                                <option value="RB">RB</option>
                                <option value="GK">GK</option>
                            </select>
                        </div>
                        <div className={styles.contentbox}>
                            <div className={styles.leaguebox}>
                                <div className={styles.textgroup2}>
                                    <div className={styles.textgroup}>
                                        <p className={styles.text1}>선수</p>
                                        <p className={styles.text2}>전체</p>
                                    </div>
                                    <div className={styles.region} onClick={goRegion}>지역별 선수 &gt;</div>
                                </div>
                                <div className={styles.tableArea}>
                                    <table className={styles.table}>
                                        <thead tr className={styles.thead}>
                                            
                                                <tr className={styles.tr}>
                                                <th className={styles.thead1}>성실 포인트</th>
                                                <th className={styles.thead2}>선수 이름</th>
                                                <th className={styles.thead3}>소속 팀</th>
                                                <th className={styles.thead4}>활동 지역</th>
                                                <th className={styles.thead5}>포지션</th>
                                                <th className={styles.thead6}>연령</th>
                                            </tr>
                                        
                                        </thead>
                                        <tbody>
                                            {/* .filter(item=>item['player_position'] === state) */}
                                        {slicedData.map(item => (
                                            <tr className={styles.tr2} onClick={()=>inform(item)} key={item['user_code']}>
                                                <td className={styles.td}>{item['player_point']}</td>
                                                <td className={styles.td}>{item['user_name']}</td>
                                                <td className={styles.td}>{item['player_point']}</td>
                                                <td className={styles.td}>{item['player_area']}</td>
                                                <td className={styles.td1}>{item['player_position']}</td>
                                                <td className={styles.td}>{item['player_point']}</td>
                                            </tr>  
                                        ))}  
                                        </tbody>
                                    </table>
                                </div>
                                <div className={styles.contentpages}><img src={arrow} className={styles.arrowl}/>
                                    {element.map(pages=>(
                                        
                                        <p className={styles.pages} onClick={() => pagination(pages)}>{pages}</p>
                                    ))}
                                <img src={arrow} className={styles.arrow}/></div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.matchbox}>
                        <div className={styles.goalbox}>
                            {/* <p className={styles.text}>경기 내용</p> */}
                            <div className={styles.team}>
                                <img className={styles.teamlogo}src={defaultimg}/><p className={styles.teamname}>메시아 FC</p><div className={styles.goal}><p className={styles.goalm}>손흥민</p><p className={styles.goalm}>이강인</p><p className={styles.goalm}>이강인</p></div>
                            </div>
                            <div className={styles.versus}><p className={styles.score}>3</p><p className={styles.vs}>vs</p><p className={styles.score}>2</p></div>
                            <div className={styles.team}>
                                <img className={styles.teamlogo}src={defaultimg}/><p className={styles.teamname}>메시아 FC</p><div className={styles.goal}><p className={styles.goalm}>손흥민</p><p className={styles.goalm}>이강인</p><p className={styles.goalm}>이강인</p></div>
                            </div>
                        </div>
                        <div className={styles.inform}>
                            <div className={styles.basic}>
                                <div className={styles.basiclogo} onClick={basicClick}>기본 정보</div>
                                <div className={styles.lineuplogo} onClick={lineupClick}>라인업</div>
                                
                            </div>  
                            <div className={styles.lineup}>
                                {basic === 'B'?<div className={styles.basiccontents}>
                                    <div className={styles.basictextbox}>
                                        <p className={styles.basictext}>장소</p><p className={styles.basictext1}>인하대 운동장</p>
                                    </div>
                                    <div className={styles.basictextbox}>
                                        <p className={styles.basictext}>날짜</p><p className={styles.basictext1}>24.11.02(수) 16:00 </p>
                                    </div>
                                    <div className={styles.basictextbox}>
                                        <p className={styles.basictext}>종류</p><p className={styles.basictext1}>인하대 공대스리가 리그</p>
                                    </div>
                                </div>:<div className={styles.lineupcontents}>
                                    <div className={styles.positionbox}>
                                        <div className={styles.atack}><p className={styles.playername}>이강인</p></div><p className={styles.basictext2}>공격수</p><div className={styles.atack}><p className={styles.playername}>이강인</p></div>
                                    </div>
                                    <div className={styles.positionbox}>
                                        <div className={styles.atack}><p className={styles.playername}>이강인</p></div><p className={styles.basictext2}>미드필더</p><div className={styles.atack}><p className={styles.playername}>이강인</p></div>
                                    </div>
                                    <div className={styles.positionbox}>
                                        <div className={styles.protect}><p className={styles.playername}>이강인</p></div><p className={styles.basictext2}>수비수</p><div className={styles.protect}><p className={styles.playername}>이강인</p></div>
                                    </div>
                                    <div className={styles.positionbox1}>
                                        <div className={styles.kiper}><p className={styles.playername}>이강인</p></div><p className={styles.basictext2}>골키퍼</p><div className={styles.kiper}><p className={styles.playername}>이강인</p></div>
                                    </div>
                                </div>}
                                
                            </div >
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}