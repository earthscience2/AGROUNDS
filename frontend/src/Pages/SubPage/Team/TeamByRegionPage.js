
import NavBar from "../../../Components/NavBar/NavBar";
import ALNavBar from "../../../Components/NavBar/ALNavBar";
import TeamByRegion from "../../../Components/Sub/Team/TeamByRegion";
import CompanyInfo from "../../../Components/Common/CompanyInfo";
import { useState,useEffect } from "react";
export default function TeamByRegionPage(){
    const [nickname, setNickname] = useState('');
    const [isClicked,setIsClicked] = useState(false);
    const[step,setStep] = useState(1);
    useEffect(()=>{
        const isNickname = sessionStorage.getItem('nickname');
        if(isNickname){
            setNickname(isNickname)
        }
    },[])
    return (
        <div>
            {nickname ? <ALNavBar/>:<NavBar/>}
            <TeamByRegion/>
            <CompanyInfo/>
        </div>
    )
}