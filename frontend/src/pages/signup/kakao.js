import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import CompanyInfo from "../../Components/Common/CompanyInfo";
import Signin from "../../Components/Signin/Signin";
import Kakao from "../../assets/Kakao.png";
function SigninPage(){
    const styles = {
        display: "flex",
        justifyContent:"center"
    }
    return(
        <div>
            <NavBar/>
            <div style={styles}>
                <Signin text="카카오톡으" imgsrc={Kakao} color="#FEE502"/> 
            </div>
            
            <CompanyInfo/>
        </div>
    )
}
export default SigninPage;