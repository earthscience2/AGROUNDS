import NavBar from "../../Components/NavBar/NavBar";
import styles from "./WelcomeSignupPage.module.css";
import WelcomeSignUp from "../../Components/SignUp/WelcomeSignup";
import CompanyInfo from "../../Components/Common/CompanyInfo";
function WelcomeSignUpPage(){
    const nickname = sessionStorage.getItem('nickname')
    return (
        <div className={styles.back}>
            <NavBar/>
            <WelcomeSignUp username={nickname}/>
            <CompanyInfo/>
        </div>
    )
}
export default WelcomeSignUpPage;