import CompanyInfo from "../../Components/Common/CompanyInfo";
import ALNavBar from "../../Components/NavBar/ALNavBar";
import styles from "./ALMainPage.module.css";
import ALMainSec1 from "../../Components/Main/ALMainSec1";
import ALMainSec2 from "../../Components/Main/ALMainSec2";
import ALMainSec3 from "../../Components/Main/ALMainSec3";
import testsrc from "../../assets/Logo2.png";
function ALMainPage(){
    return(
        <div>
            <ALNavBar username="인하대 손흥민" src={testsrc} />
            <ALMainSec1/>
            <ALMainSec2/>
            <ALMainSec3/>
            <CompanyInfo/>
        </div>
    )
}
export default ALMainPage;