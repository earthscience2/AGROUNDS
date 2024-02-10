import styles from "./LeaguePage.module.css"
import NavBar from "../../Components/NavBar/NavBar";
import CompanyInfo from "../../Components/Common/CompanyInfo";
function LeaguePage(){
    return(
        <div>
            <NavBar/>
            <CompanyInfo/>
        </div>
    )
}
export default LeaguePage;