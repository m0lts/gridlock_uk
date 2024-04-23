// Dependencies
import { useState, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
// Components
import { Header } from './components/Header/Header'
// Pages
import { Home } from './pages/Home/Home'
import { Menu } from './components/Menu/Menu'
import { Predictor } from './pages/Predictor/Predictor'
import { Calendar } from './pages/Calendar/Calendar'
import { Standings } from './pages/Standings/Standings'
import LogIn from './pages/Login/Login'
import SignUp from './pages/Signup/Signup'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import { ErrorPage } from './pages/Error/ErrorPage'
import { VerifyAccount } from './pages/VerifyAccount/VerifyAccount'
import { MaintenancePage } from './pages/Maintenance/Maintenance'
import { UserProfile } from './pages/UserProfile/UserProfile'
import { EventPage } from './pages/Event/EventPage'
import { SessionResult } from './pages/SessionResult/SessionResult'
import { LeagueStandings } from './pages/LeagueStandings/LeagueStandings'
import { HelpPage } from './pages/Help/Help'
// Utils
import { filterEventResponse, filterDriverResponse } from './utils/FilterApiResponses'
// Styles
import './assets/global.styles.css'


export default function App() {

  // API request
  const [apiRequest, setApiRequest] = useState('races?season=2024&timezone=Europe/London');
  const [returnedEventData, setReturnedEventData] = useState([]);
  const [returnedDriverData, setReturnedDriverData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/externalData/CallApi.js', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiRequest),
        });
      
        if (response.ok) {
              const responseData = await response.json();
              const data = responseData.result.response;

              if (apiRequest.includes('races')) {
                setReturnedEventData(filterEventResponse(data));
                setApiRequest('rankings/drivers?season=2024');
              } else if (apiRequest.includes('drivers')) {
                setReturnedDriverData(filterDriverResponse(data));
              }
            } else {
              console.log('failure');
            }
        } catch (error) {
          console.error('Error submitting form:', error);
        }
    }
    
    fetchData();

  }, [apiRequest])

  // User data
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // If old localStorage logged in code is present, remove it
  useEffect(() => {
    if (localStorage.getItem('user')) {
      localStorage.removeItem('user');
    }
  }, []);

  useEffect(() => {

    const verifyToken = async () => {
      try {
        const response = await fetch('/api/accounts/handleTokenVerification', {
          method: 'GET',
        });
        if (response.status === 201) {
          setUser(null);
        } else if (response.status === 200) {
          const responseJson = await response.json();
          const token = responseJson.user;
          setUser(token);
          if (!token.verified) {
            navigate('/verifyaccount');
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        return null;
      }
    };

    verifyToken();

  }, []);

  // Cookie modal
  const [cookieConsent, setCookieConsent] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('cookieConsent')) {
      setCookieConsent(true);
    }
  }, []);
  const handleCloseCookieModal = () => {
    setCookieConsent(false);
    localStorage.setItem('cookieConsent', 'true');
  }


  return (
    <div className="app">
      <Header user={user} />
      {/* <MaintenancePage /> */}
      <Routes>
        <Route path="/" element={<Home seasonData={returnedEventData} driverData={returnedDriverData} user={user} />} />
        <Route path="/predictor" element={<Predictor seasonData={returnedEventData} driverData={returnedDriverData} user={user} />} />
        <Route path="/calendar" element={<Calendar seasonData={returnedEventData} user={user} />} />
        <Route path="/standings" element={<Standings user={user} />} />
        <Route path="/standings/:leagueName" element={<LeagueStandings user={user} />} />
        <Route path="/login" element={<LogIn user={user} setUser={setUser} />} />
        <Route path="/signup" element={<SignUp seasonData={returnedEventData} setUser={setUser} user={user} />} />
        <Route path='/forgotpassword' element={<ForgotPassword user={user} />} />
        <Route path='/resetpassword' element={<ResetPassword user={user} setUser={setUser} />} />
        <Route path='/verifyaccount' element={<VerifyAccount user={user} setUser={setUser} />} />
        <Route path='/user/:user' element={<UserProfile seasonData={returnedEventData} user={user} />} /> 
        <Route path='/event/:event' element={<EventPage user={user} />} />
        <Route path='/session-result/:sessionId' element={<SessionResult />} />
        <Route path='/help' element={<HelpPage user={user} />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Menu />
    </div>
  )
}



