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
import DirectorPage from "./Pages/SubPage/DirectorPage";
import EquipmentPage from "./Pages/SubPage/EquipmentPage";
import GamePage from "./Pages/SubPage/GamePage";
import LeaguePage from "./Pages/SubPage/LeaguePage";
import PlayerPage from "./Pages/SubPage/PlayerPage";
import TeamPage from "./Pages/SubPage/TeamPage";
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
      </Routes>
    </BrowserRouter>
    
  )
}

export default App;
