// Dependencies
import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
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
import { getTokenFromCookie } from './utils/cookieFunctions'


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
        const [userName, setUserName] = useState('');
        const [userId, setUserId] = useState('');
        const [verified, setVerified] = useState(false);
        const [fetchingUserData, setFetchingUserData] = useState(true);
    
        useEffect(() => {
            // Function to decode JWT token
            const decodeToken = (token) => {
                try {
                    const tokenParts = token.split('.');
                    const encodedPayload = tokenParts[1];
                    const decodedPayload = atob(encodedPayload);
                    return JSON.parse(decodedPayload);
                } catch (error) {
                    console.error('Error decoding token:', error);
                    return null;
                }
            };
    
            // Retrieve JWT token from cookie
            const token = getTokenFromCookie();
    
            // Decode JWT token to get user information
            const decodedToken = decodeToken(token);
            if (decodedToken && decodedToken.username) {
                setUserName(decodedToken.username);
                setUserId(decodedToken.user_id);
                setVerified(decodedToken.verified);
            }
    
            setFetchingUserData(false);
        }, []);

        console.log(userName, userId, verified)

  return (
    <div className="app">
      <Header />
      {/* <MaintenancePage /> */}
      <Routes>
        <Route path="/" element={<Home seasonData={returnedEventData} driverData={returnedDriverData} />} />
        <Route path="/predictor" element={<Predictor seasonData={returnedEventData} driverData={returnedDriverData} />} />
        <Route path="/calendar" element={<Calendar seasonData={returnedEventData} />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/standings/:leagueName" element={<LeagueStandings />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp seasonData={returnedEventData} />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/resetpassword' element={<ResetPassword />} />
        <Route path='/verifyaccount' element={<VerifyAccount />} />
        <Route path='/user/:user' element={<UserProfile seasonData={returnedEventData} />} /> 
        <Route path='/event/:event' element={<EventPage />} />
        <Route path='/session-result/:sessionId' element={<SessionResult />} />
        <Route path='/help' element={<HelpPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Menu />
    </div>
  )
}



