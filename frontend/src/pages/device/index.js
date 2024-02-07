import NavBar from "@/Components/NavBar/NavBar";
import styles from "@/styles/MainPage.module.css";
import MainSection1 from "@/Components/Main/MainSection1";
import MainSection2 from "@/Components/Main/MainSection2";
import MainSection3 from "@/Components/Main/MainSection3";
import MainSection4 from "@/Components/Main/MainSection4";
import MainSection5 from "@/Components/Main/MainSection5";
import CompanyInfo from "@/Components/Common/CompanyInfo";
function MainPage() {
    return (
        <>
            <NavBar />
            <div className={styles.BackGround1}>
                <h1>분석장비 페이지</h1>
            </div>
            <CompanyInfo />
        </>
    )
}
export default MainPage;