import styles from "./RegionByLeaguePage.module.css";
import NavBar from "../../../Components/NavBar/NavBar";
import ALNavBar from "../../../Components/NavBar/ALNavBar";
import LeagueByRegion from "../../../Components/Sub/League/LeagueByRegion";
import CompanyInfo from "../../../Components/Common/CompanyInfo";
function RegionByLeaguePage(){
    const [nickname, setNickname] = useState('');
    const [isClicked,setIsClicked] = useState(false);
    const[step,setStep] = useState(1);
    useEffect(()=>{
        const isNickname = sessionStorage.getItem('nickname');
        if(isNickname){
            setNickname(isNickname)
        }
    },[])
    return (
        <div>
            {nickname ? <ALNavBar/>:<NavBar/>}
            <LeagueByRegion/>
            <CompanyInfo/>
        </div>
    )
}
export default RegionByLeaguePage;