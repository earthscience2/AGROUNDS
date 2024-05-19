import React from "react";
import ReactDOM from "react-dom";
import { Route ,Routes, BrowserRouter} from 'react-router-dom';
import MainPage from "./Pages/MainPage/MainPage";
import LoginPage from "./Pages/Login/LoginPage";
import KSigninPage from "./Pages/SignUp/KSignupPage";
import GSigninPage from "./Pages/SignUp/GSignupPage";
import ASigninPage from "./Pages/SignUp/ASignupPage";
import ALMainPage from "./Pages/MainPage/ALMainPage";
import WelcomeSignUpPage from "./Pages/SignUp/WelcomeSignUpPage";
import DirectorPage from "./Pages/SubPage/Director/DirectorPage";
import EquipmentPage from "./Pages/SubPage/Equipment/EquipmentPage";
import GamePage from "./Pages/SubPage/GamePage/GamePage";
import LeaguePage from "./Pages/SubPage/League/LeaguePage";
import PlayerPage from "./Pages/SubPage/Player/PlayerPage";
import TeamPage from "./Pages/SubPage/Team/TeamPage";
import MakeLeaguePage from "./Pages/SubPage/League/MakeLeaguePage";
import MakeLeagueConf from "../src/Components/Sub/League/MakeLeague/MakeLeagueConf";
import LeagueByRegion from "./Components/Sub/League/LeagueByRegion";
import LeagueDetailPage from "./Pages/SubPage/League/LeagueDetailPage";
import TeamDetailPage from "./Pages/SubPage/League/TeamDetailPage";
import TeamByRegionPage from "./Pages/SubPage/Team/TeamByRegionPage";
import RegionTeamPage from "./Pages/SubPage/Team/RegionTeamPage";
import GameByRegionPage from "./Pages/SubPage/GamePage/GameByRegionPage";
import PlayerByRegionPage from "./Pages/SubPage/Player/PlayerByRegionPage";
import LoginErrorPage from "./Components/ErrorPage/LoginErrorPage";
function App() {
  return(
    <BrowserRouter>
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<MainPage />} />
        <Route path="/ALMainPage" element={<ALMainPage />} />

        {/* 회원가입 페이지 */}
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/KSigninPage" element={<KSigninPage />} />
        <Route path="/GSigninPage" element={<GSigninPage />} />
        <Route path="/ASigninPage" element={<ASigninPage />} />
        

        {/* 서브 페이지 */}
        <Route path="/DirectorPage" element={<DirectorPage />} />
        <Route path="/EquipmentPage" element={<EquipmentPage />} />
        <Route path="/GamePage" element={<GamePage />} />
        <Route path="/LeaguePage" element={<LeaguePage />} />
        <Route path="/PlayerPage" element={<PlayerPage/>} />
        <Route path="/WelcomeSignUpPage" element={<WelcomeSignUpPage />} />
        <Route path="/TeamPage" element={<TeamPage />} />
        <Route path="/MakeLeaguePage" element={<MakeLeaguePage />} />
        <Route path="/MakeLeagueConf" element={<MakeLeagueConf />} />
        <Route path="/LeagueByRegion" element={<LeagueByRegion />} />
        <Route path="/LeagueDetailPage" element={<LeagueDetailPage />} />
        <Route path="/TeamDetailPage" element={<TeamDetailPage />} />
        <Route path="/TeamByRegionPage" element={<TeamByRegionPage />} />
        <Route path="/RegionTeamPage" element={<RegionTeamPage />} />
        <Route path="/GameByRegionPage" element={<GameByRegionPage />} />
        <Route path="/PlayerByRegionPage" element={<PlayerByRegionPage />} />
        <Route path="/LoginErrorPage" element={<LoginErrorPage />} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App;
