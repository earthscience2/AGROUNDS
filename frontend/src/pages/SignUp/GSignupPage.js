import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import CompanyInfo from "../../Components/Common/CompanyInfo";
import Signin from "../../Components/SignUp/Signup";
import Google from "../../assets/Google.png";
import { useState } from "react";
function SigninPage(){
    const styles = {
        display: "flex",
        justifyContent:"center"
    }
    
    return(
        <div>
            <NavBar/>
            <div style={styles}>
                <Signin text="구글" imgsrc={Google} color="#97BDFF"/> 
            </div>
            
            <CompanyInfo/>
        </div>
    )
}
export default SigninPage;