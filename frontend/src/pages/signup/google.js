import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import CompanyInfo from "../../Components/Common/CompanyInfo";
import Signin from "../../Components/Signin/Signin";
import Google from "../../assets/Google.png";
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