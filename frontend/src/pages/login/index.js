import styles from "./LoginPage.module.css";
import Login from "../../Components/Login/Login";
import NavBar from "../../Components/NavBar/NavBar";
import CompanyInfo from "../../Components/Common/CompanyInfo";
import SignupModal from "../../Components/Signin/SignupModal";
function LoginPage(){
    return(
        <>
        
        <NavBar/>
        
        <div className={styles.Login}>
            <Login/>
        </div>
        <CompanyInfo/>
        </>
    )
}
export default LoginPage;