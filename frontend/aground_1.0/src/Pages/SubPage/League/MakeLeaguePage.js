import { useState,useEffect } from "react";
import NavBar from "../../../Components/NavBar/NavBar";
import ALNavBar from "../../../Components/NavBar/ALNavBar";
import CompanyInfo from "../../../Components/Common/CompanyInfo";
import SearchLeague from "../../../Components/Common/SearchLeague";
import styles from "./MakeLeaguePage.module.css";
import SelectType from "../../../Components/Sub/League/MakeLeague/SelectType";
import SelectName from "../../../Components/Sub/League/MakeLeague/SelectName";
import SelectRegion from "../../../Components/Sub/League/MakeLeague/SelectRegion";
import arrow2 from "../../../../src/assets/arrow2.png";
import SelectDate from "../../../Components/Sub/League/MakeLeague/SelectDate";
import SelectGetDate from "../../../Components/Sub/League/MakeLeague/SelectGetDate";
import SelectPG from "../../../Components/Sub/League/MakeLeague/SelectPG";
import { useNavigate } from "react-router-dom";
import MakeLeagueConf from "../../../Components/Sub/League/MakeLeague/MakeLeagueConf";
import client from "../../../Clients";
function MakeLeaguePage(){
    const [nickname, setNickname] = useState('');
    const [isClicked,setIsClicked] = useState(false);
    const navigate = useNavigate();

    const [type, setType] = useState('');
    const [name, setName] = useState('');
    const [region,setRegion] = useState('지역선택');
    const [startDate,setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date());
    const [startJoin,setStartJoin] = useState(new Date());
    const [endJoin,setEndJoin] = useState(new Date());

    const[step,setStep] = useState(1);
    useEffect(()=>{
        const isNickname = sessionStorage.getItem('nickname');
        if(isNickname){
            setNickname(isNickname)
        }
        
    },[])
    const handleStep = () => {
        setStep(step+1)
    }
    const handlestepback = () => {
        if(step === 1){
            navigate('/LeaguePage')
        }else{
            setStep(step-1)
        }
    }
    const MakeLeague=()=>{
       
        const leagueData = {
            'league_host': sessionStorage.getItem('usercode'),
            'league_name':name,
            'league_startdate':startDate.getFullYear()+'-'+startDate.getMonth() + '-' +startDate.getDate(),
            'league_enddate': endDate.getFullYear()+'-'+endDate.getMonth() + '-' +endDate.getDate(),
            'league_startjoin': startJoin.getFullYear()+'-'+startJoin.getMonth() + '-' +startJoin.getDate(),
            'league_endjoin':endJoin.getFullYear()+'-'+endJoin.getMonth() + '-' +endJoin.getDate(),
            'league_gametype': type,
            'league_area' : region
            
            
        }
        console.log(leagueData)
        client.post('api/league/league/',leagueData)
        .then(function(response){
        console.log(response)
        console.log('성공!')
        navigate('/ALMainPage')
        })
        .catch(function(error){
            console.log(error)
            alert(error)
        })
        
        
    }
    
    
    

    return (
        <div className={styles.back1}>
            {nickname ? <ALNavBar/>:<NavBar/>}
            <div className={styles.back2}>

                <div className={styles.whitebord}>
                    <div className={styles.contents} >
                    {step === 1 ?<SelectType handleStep={handleStep} />:
                    step === 2 ? <SelectPG handleStep={handleStep} type={type} setType={setType}/>:
                    step === 3 ? <SelectName handleStep={handleStep} name={name} setName={setName}/>:
                    step === 4 ? <SelectRegion handleStep={handleStep} region={region}setRegion={setRegion}/>:
                    step === 5 ? <SelectDate handleStep={handleStep} startDate={startDate}setStartDate={setStartDate} endDate={endDate}setEndDate={setEndDate}/>:
                    step === 6 ? <SelectGetDate handleStep={handleStep}startJoin={startJoin}setStartJoin={setStartJoin}endJoin={endJoin}setEndJoin={setEndJoin}/>:
                    <MakeLeagueConf gotoMain={MakeLeague}name={name}/>
                    }
                    </div>
                    {step <= 6 ?
                    <div className={styles.progress}>
                        <div onClick={handlestepback}className={styles.back}>&lt; 이전</div>
                        <div className={styles.numselect}>
                            <div  className={`${step===1?styles.num1:styles.num2}`}>1</div>
                            <div  className={`${step===2?styles.num1:styles.num2}`}>2</div>
                            <div className={`${step===3?styles.num1:styles.num2}`}>3</div>
                            <div className={`${step===4?styles.num1:styles.num2}`}>4</div>
                            <div  className={`${step===5?styles.num1:styles.num2}`}>5</div>
                            <div className={`${step===6?styles.num1:styles.num2}`}>6</div>
                        </div>
                    </div>:''}
                </div>

            </div>
            <CompanyInfo/>
        </div>
    )
}
export default MakeLeaguePage;