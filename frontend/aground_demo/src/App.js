import './App.css';
import { Route ,Routes, BrowserRouter} from 'react-router-dom';
import SignUp from './pages/sign_up/sign_up';
import KakaoSignUp from './pages/sign_up/kakao_sign_up';
import LogIn from './pages/log_in/log_in';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogIn/>}/>
        <Route path="/signUp" element={<SignUp/>}/>
        <Route path="/kakao_sign_up" element={<KakaoSignUp/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
