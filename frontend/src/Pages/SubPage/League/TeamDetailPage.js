import { useState,useEffect } from "react"
import NavBar from "../../../Components/NavBar/NavBar";
import ALNavBar from "../../../Components/NavBar/ALNavBar";
import CompanyInfo from "../../../Components/Common/CompanyInfo";
import TeamDetail from "../../../Components/Sub/League/TeamDetail";
export default function TeamDetailPage(){
    const [nickname, setNickname] = useState('');
    
    useEffect(()=>{
        const isNickname = sessionStorage.getItem('nickname');
        if(isNickname){
            setNickname(isNickname)
        }
    },[])
    return(
        <>
            {nickname ? <ALNavBar/> : <NavBar/>}
            <TeamDetail/>
            <CompanyInfo/>
        </>
    )
}