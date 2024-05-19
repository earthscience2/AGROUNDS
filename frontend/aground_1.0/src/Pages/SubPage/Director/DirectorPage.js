import styles from "./DirectorPage.module.css";
import NavBar from "../../../Components/NavBar/NavBar";
import CompanyInfo from "../../../Components/Common/CompanyInfo";
import ALNavBar from "../../../Components/NavBar/ALNavBar";
import { useState } from "react";
import { useEffect } from "react";
import client from "../../../Clients";

import PageNotPrepared from "../../../Components/ErrorPage/PageNotPrepared";
function DirectorPage(){
    const [nickname,setNickname] = useState();
    useEffect(()=>{
        const isNickname = sessionStorage.getItem('nickname');
        if(isNickname){
            setNickname(isNickname)
        }

        client.post('api/player/getplayer/', {'user_code' : 'u_1sa88fr5gv8kce'}).then(function(response){
            console.log(response)
        }).catch(function(error){
            console.log(error)
        })
    },[])


    return(
        <div>
            {nickname ? <ALNavBar/> : <NavBar/>}
            <PageNotPrepared/>
            <CompanyInfo/>
        </div>
        
    )
}
export default DirectorPage;