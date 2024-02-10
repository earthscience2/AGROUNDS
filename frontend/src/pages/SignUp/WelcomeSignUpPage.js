import NavBar from "../../Components/NavBar/NavBar";
import styles from "./WelcomeSignupPage.module.css";
import WelcomeSignUp from "../../Components/SignUp/WelcomeSignup";
import CompanyInfo from "../../Components/Common/CompanyInfo";
function WelcomeSignUpPage(){
    return (
        <div className={styles.back}>
            <NavBar/>
            <WelcomeSignUp username="인하대 손흥민"/>
            <CompanyInfo/>
        </div>
    )
}
export default WelcomeSignUpPage;