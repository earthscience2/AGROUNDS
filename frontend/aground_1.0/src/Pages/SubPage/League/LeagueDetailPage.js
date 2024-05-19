import { useState,useEffect} from "react";
import NavBar from "../../../Components/NavBar/NavBar";
import ALNavBar from "../../../Components/NavBar/ALNavBar";
import LeagueDetail from "../../../Components/Sub/League/LeagueDatail";
import CompanyInfo from "../../../Components/Common/CompanyInfo";
import src from "../../../assets/profile.png";
export default function LeagueDetailPage(){
    const [nickname, setNickname] = useState('');

    useEffect(()=>{
        const isNickname = sessionStorage.getItem('nickname');
        if(isNickname){
            setNickname(isNickname)
        }
    },[])
    return (
        
        <>
        {nickname ? <ALNavBar/>: <NavBar/>}
        <LeagueDetail src={src}/>
        <CompanyInfo/>
            
        </>
    )
}