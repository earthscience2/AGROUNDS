import CompanyInfo from "../../Components/Common/CompanyInfo";
import ALNavBar from "../../Components/NavBar/ALNavBar";
import styles from "./ALMainPage.module.css";
import ALMainSec1 from "../../Components/Main/ALMainSec1";
import ALMainSec2 from "../../Components/Main/ALMainSec2";
import ALMainSec3 from "../../Components/Main/ALMainSec3";
import testsrc from "../../assets/Logo2.png";
import { useEffect, useState } from "react";
function ALMainPage(){
    const token = new URL(window.location.href).searchParams.get('code')
    console.log(token)
    sessionStorage.setItem('token', token)
    return(
        <div>
            <ALNavBar />
            <ALMainSec1/>
            <ALMainSec2/>
            <ALMainSec3/>
            <CompanyInfo/>
        </div>
    )
}
export default ALMainPage;