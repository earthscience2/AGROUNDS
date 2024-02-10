import styles from "./GamePage.module.css"
import NavBar from "../../Components/NavBar/NavBar";
import CompanyInfo from "../../Components/Common/CompanyInfo";
function GamePage(){
    return(
        <div>
            <NavBar/>
            <CompanyInfo/>
        </div>
    )
}
export default GamePage;