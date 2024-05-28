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
        <Route path="/PersonalMatchResult" element={<PersonalMatchResult/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
