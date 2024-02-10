import styles from "./PlayerPage.module.css";
import NavBar from "../../Components/NavBar/NavBar";
import CompanyInfo from "../../Components/Common/CompanyInfo";
function PlayerPage(){
    return(
        <div>
            <NavBar/>
            <CompanyInfo/>
        </div>
    )
}
export default PlayerPage;