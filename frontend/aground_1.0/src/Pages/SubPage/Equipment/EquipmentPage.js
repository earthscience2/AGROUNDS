import styles from "./EquipmentPage.module.css";
import NavBar from "../../../Components/NavBar/NavBar";
import CompanyInfo from "../../../Components/Common/CompanyInfo";
import ALNavBar from "../../../Components/NavBar/ALNavBar";
import { useState } from "react";
import { useEffect } from "react";
import PageNotPrepared from "../../../Components/ErrorPage/PageNotPrepared";
function EquipmentPage(){
    const [nickname,setNickname] = useState();
    useEffect(()=>{
        const isNickname = sessionStorage.getItem('nickname');
        if(isNickname){
            setNickname(isNickname)
        }
    },[])
    return(
        <div>
            {nickname ? <ALNavBar/> : <NavBar/>}
            <PageNotPrepared/>
            <CompanyInfo/>
        </div>
    )
}
export default EquipmentPage;