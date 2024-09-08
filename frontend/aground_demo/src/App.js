import './App.css';
import { Route ,Routes, BrowserRouter} from 'react-router-dom';
import SignUp from './pages/sign_up/sign_up';
import KakaoSignUp from './pages/sign_up/kakao_sign_up';
import LogIn from './pages/log_in/log_in';
import FirstSignup from './pages/team/first_signup';
import AddMatch from './pages/match/add_match';
import TeamList from './pages/team/teamlist';
import MainPage from './pages/main_page/main_page';
import AfterMatch from './pages/match/after_match';
import MatchResults from './pages/match/match_result';
import PersonalMatchResult from './pages/person/personal_match_result';
import LoadingForLogin from './pages/log_in/loading_for_login';
import PersonalInfo from './pages/person/personal_info';
import MyPage from './pages/my-page/my_page';
import ExtraData from './pages/log_in/extra_data';
import TeamAnalysis from './pages/team/team_analysis';
import Video from './pages/team/video';
import DisplayMain from './pages/display/MainPage';
import DisplayProduct from './pages/display/Product';
import DisplayVest from './pages/display/Vest';
import DisplayCam from './pages/display/AICam';
import DisplayGps from './pages/display/GpsDisplay';
import DisplayAnal from './pages/display/Analysis';
import DisplayAbout from './pages/display/AboutUs';
import Analysis from './pages/display/GameAnalysis';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogIn/>}/>
        <Route path="/signUp" element={<SignUp/>}/>
        <Route path="/KakaoSignUp" element={<KakaoSignUp/>}/>
        <Route path="/FirstSignup" element={<FirstSignup/>}/>
        <Route path="/AddMatch" element={<AddMatch/>}/>
        <Route path="/TeamList" element={<TeamList/>}/>
        <Route path="/MainPage" element={<MainPage/>}/>
        <Route path="/AfterMatch" element={<AfterMatch/>}/>
        <Route path="/MatchResults" element={<MatchResults/>}/>
        <Route path='/LoadingForLogin' element={<LoadingForLogin/>}/>
        <Route path="/PersonalMatchResult" element={<PersonalMatchResult/>}/>
        <Route path="/PersonalInfo" element={<PersonalInfo/>}/>
        <Route path="/MyPage" element={<MyPage/>}/>
        <Route path="/ExtraData" element={<ExtraData/>}/>
        <Route path="/TeamAnalysis" element={<TeamAnalysis/>}/>
        <Route path="/Video" element={<Video/>}/>


        <Route path="/display/main" element={<DisplayMain/>}/>
        <Route path="/display/product" element={<DisplayProduct/>}/>
        <Route path="/display/vest" element={<DisplayVest/>}/>
        <Route path="/display/cam" element={<DisplayCam/>}/>
        <Route path="/display/gps" element={<DisplayGps/>}/>
        <Route path="/display/analysis" element={<DisplayAnal/>}/>
        <Route path="/display/aboutus" element={<DisplayAbout/>}/>
        <Route path="/display/gameanalysis" element={<Analysis/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
