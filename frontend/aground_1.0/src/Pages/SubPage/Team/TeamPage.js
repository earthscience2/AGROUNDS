
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
import client from "../../../Clients";

function TeamPage(){
    const [nickname,setNickname] = useState();
    const [state, setState] = useState();
    const [color, setColor] = useState();
    const navigate = useNavigate();
    const [playerDatas,setPlayerDatas] = useState([]);
    const [currentPage,setCurrentPage] = useState(1);
    const [ slicedData,setSlicedData] = useState([]);
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const [element,setElement]=useState([]);
    const [data,setData] = useState()
    const goRegion = () => {
        navigate('/TeamByRegionPage');
    }
    const stateSelect = (event) => {
        setState(event.target.value)
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
    
    useEffect(()=>{
        client.get('/api/team/main/')
        .then(function(response){
            setPlayerDatas(response.data)
            setSlicedData(response.data.slice(startIndex,endIndex))
            console.log(response.data)
            let tmp=[];
            if(response.data.length < 10){
                tmp.push(1)
            }else{
                for(let i=1;i<response.data.length/10;i++){
                    tmp[i-1] = i
                }
            }
            
            setElement(tmp)
            console.log(element)
        })
    }, [])
    const pagination = (pages) =>{
        console.log(pages)
        startIndex = pages - 1 * itemsPerPage;
        endIndex = startIndex +itemsPerPage;
    }
    const inform = (item) => {
        console.log(item)
        setData(item)
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
                                <p className={styles.text2}>전체</p>
                            </div>
                            <div className={styles.region} onClick={goRegion}>지역별 리그 &gt;</div>
                        </div>
                        <div className={styles.tableArea}>
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
                                    {slicedData.map(item=>(
                                        <tr onClick={RegionDetail}  className={styles.tr2} key={item['team_code']}>
                                        <td className={styles.td}>{item['team_logo']}</td>
                                        <td className={styles.td}>{item['team_name']}</td>
                                        <td className={styles.td}>{item['team_area']}</td>
                                        <td className={styles.td}>{item['team_player'].length}</td>
                                        <td className={styles.td1}>{item['team_age']}</td>
                                        <td className={styles.td}>2024.08.30</td>
                                    </tr>
                                    ))}
                                </tbody>     
                            </table>
                        </div>
                        <div className={styles.contentpages}><img src={arrow} className={styles.arrowl}/>
                        {element.map(pages=>(
                            <p className={styles.pages} onClick={() => pagination(pages)}>{pages}</p>
                        ))}<img src={arrow} className={styles.arrow}/></div>
                       </div>
                       <div className={styles.makeLeague}><p className={styles.plus}>+</p>리그 만들기</div>
                </div>
                
            </div>
            <CompanyInfo/>
        </div>
    )
}
export default TeamPage;