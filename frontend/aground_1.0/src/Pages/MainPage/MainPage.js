import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import styles from "./MainPage.module.css";
import MainSection1 from "../../Components/Main/MainSection1";
import MainSection2 from "../../Components/Main/MainSection2";
import MainSection3 from "../../Components/Main/MainSection3";
import MainSection4 from "../../Components/Main/MainSection4";
import MainSection5 from "../../Components/Main/MainSection5";
import ALMainPage from "./ALMainPage";
import { useNavigate } from "react-router-dom";
import CompanyInfo from "../../Components/Common/CompanyInfo";
function MainPage(){
    const isLogin = sessionStorage.getItem('isLogin');
    
    return(
        <>
        {isLogin ? ALMainPage :
        <>
        <NavBar/>
        <div className={styles.BackGround}>
            <MainSection1 />
            <MainSection2 />
            <MainSection3 />
            <MainSection4 />
            <MainSection5 />
            
        </div>
        <CompanyInfo/>
        </>
}
</>

    )
}
export default MainPage;