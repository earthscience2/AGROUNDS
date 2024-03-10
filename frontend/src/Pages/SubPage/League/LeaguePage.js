import styles from "./LeaguePage.module.css"
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
import LoginErrorPage from "../../../Components/ErrorPage/LoginErrorPage";
import client from "../../../Clients";
function LeaguePage(){
    const [nickname,setNickname] = useState();
    const [state, setState] = useState('');
    const [color, setColor] = useState();
    const navigate = useNavigate();
    const [leagueDatas,setLeagueDatas] = useState([]);
    const [currentPage,setCurrentPage] = useState(1);
    const [slicedData,setSlicedData] = useState([]);
    const itemsPerPage = 10;
    const [ startIndex,setStartIndex] = useState(1);
    const [endIndex,setEndIndex] = useState(10);
    const [element,setElement]=useState([]);
    const [filteredData,setFilteredData] = useState([]);
    let [data,setData] = useState()
    
    let newStartIndex = (currentPage - 1) * itemsPerPage;
    let newEndIndex = newStartIndex +itemsPerPage;
    const goRegion = () => {
        navigate('/LeagueByRegion');
    }
    const makeLeague = () => {
        {nickname ? navigate('/MakeLeaguePage'):navigate('/LoginErrorPage')}
        
    }
    const LeagueDetail = () => {
        navigate('/LeagueDetailPage');
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
    useEffect(()=> {
        client.get('/api/league/main/')
        .then(function(response){
            setLeagueDatas(response.data)
            setSlicedData(response.data.slice(startIndex,endIndex))
            
            let tmp=[];
            for (let i=1;i<response.data.length/10+1;i++){
                tmp[i-1] = i
                
            }
            setElement(tmp)
           
            if (state === '') {
                setFilteredData(leagueDatas);
              } else {
                let filtered = leagueDatas.filter(item => item['league_official'] === state);
                setFilteredData(filtered);
              }
              console.log(filteredData)
              console.log(state)
        })
    },[startIndex])
    const pagination = (pages) =>{
        
        newStartIndex = (pages - 1) * itemsPerPage;
        newEndIndex = newStartIndex +itemsPerPage;
        setStartIndex(newStartIndex);
        setEndIndex(newEndIndex);
    }
    const inform = (item) => {
        setData(item)
    }
   
    
    return(
        <div>
            {nickname ? <ALNavBar/> : <NavBar/>}
            {/* <League/> */}
            <div className={styles.back}>
                <div className={styles.othercontents}></div>
                <div className={styles.sortbox}>
                    <div className={styles.searchbox}><img src={dodbogi}/><input className={styles.search}type="text"/></div>
                    <select onClick={stateSelect}name="state" className={styles.sort}>
                        <option className={styles.sort}>리그 상태<img className={styles.dropicon}src={plus}/></option>
                        <option value="모집중">모집중</option>
                        <option value="진행중">진행중</option>
                        <option value="종료">종료</option>
                    </select>
                </div>
                <div className={styles.contentbox}>
                    <div className={styles.leaguebox}>
                        <div className={styles.textgroup2}>
                            <div className={styles.textgroup}>
                                <p className={styles.text1}>전체</p>
                                <p className={styles.text2}>리그 & 컵</p>
                            </div>
                            <div className={styles.region} onClick={goRegion}>지역별 리그 &gt;</div>
                        </div>
                        <div className={styles.tableArea}>
                            <table className={styles.table}>
                                <thead tr className={styles.thead}>
                                    <tr className={styles.tr}>
                                        <th className={styles.thead1}>평균 티어</th>
                                        <th className={styles.thead2}>리그</th>
                                        <th className={styles.thead3}>종류</th>
                                        <th className={styles.thead4}>참가팀 수</th>
                                        <th className={styles.thead5}>상태</th>
                                        <th className={styles.thead6}>시작일</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map(item=>(
                                        <tr onClick={LeagueDetail}className={styles.tr2} key={item['league_code']}>
                                        <td className={styles.td}>{item['league_name']}</td>
                                        <td className={styles.td}>{item['league_name']}</td>
                                        <td className={styles.td}>{item['league_gametype']}</td>
                                        <td className={styles.td}>{item['league_team']}</td>
                                        <td style={item['league_official'] === '모집중' ? { color: "#EAAA00" } :item['league_official'] === '진행중'? { color: "#055540" }:item['league_official'] === '종료'?{ color: "#E41819" }:{ color: "#000000" }}className={styles.td1}>{item['league_endjoin'] <= new Date() ?'모집중':item['league_endjoin']>new Date()?'진행중':'종료' }</td>
                                        <td className={styles.td}>{item['league_startdate']}</td>
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
                       <div className={styles.makeLeague} onClick={makeLeague}><p className={styles.plus}>+</p>리그 만들기</div>
                </div>
                
            </div>
            <CompanyInfo/>
        </div>
    )
}
export default LeaguePage;