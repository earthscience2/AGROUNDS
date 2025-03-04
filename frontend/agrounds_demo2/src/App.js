import './App.css';
import { Route ,Routes, BrowserRouter} from 'react-router-dom';

import DisplayMain from './pages/display/MainPage';
import DisplayProduct from './pages/display/Product';
import DisplayVest from './pages/display/Vest';
import DisplayCam from './pages/display/AICam';
import DisplayGps from './pages/display/GpsDisplay';
import DisplayAnal from './pages/display/Analysis';
import DisplayAbout from './pages/display/AboutUs';
import Analysis from './pages/display/GameAnalysis';
import Team from './pages/display/Team';
import DemoMain from './pages/demo_distribute/demo_main';
import PersonalMov from './pages/demo_distribute/PersonalMov';
import TeamMov from './pages/demo_distribute/TeamMov';
import DemoAnal from './pages/demo_distribute/demo_anal';
import TotalMov from './pages/demo_distribute/TotalMov';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DisplayMain/>}/>
        <Route path="/display/product" element={<DisplayProduct/>}/>
        <Route path="/display/vest" element={<DisplayVest/>}/>
        <Route path="/display/cam" element={<DisplayCam/>}/>
        <Route path="/display/gps" element={<DisplayGps/>}/>
        <Route path="/display/analysis" element={<DisplayAnal/>}/>
        <Route path="/display/aboutus" element={<DisplayAbout/>}/>
        <Route path="/display/gameanalysis" element={<Analysis/>}/>
        <Route path="/display/team" element={<Team/>}/>


        {/* demo 배포 버전 */}
        <Route path="/demo/main" element={<DemoMain/>}/>
        <Route path="/demo/teammov" element={<TeamMov/>}/>
        <Route path="/demo/personalmov" element={<PersonalMov/>}/>
        <Route path="/demo/anal" element={<DemoAnal/>}/>
        <Route path="/demo/totalmov" element={<TotalMov/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
