import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { Home } from './pages/Home/Home'
import { Menu } from './components/Menu/Menu'
import { Predictor } from './pages/Predictor/Predictor'
import './assets/global.styles.css'
import { Calendar } from './pages/Calendar/Calendar'
import { Standings } from './pages/Standings/Standings'
import { Account } from './pages/Account/Account'
import { filterEventResponse, filterDriverResponse } from './utils/FilterApiResponses'
import LogIn from './pages/Login/Login'
import SignUp from './pages/Signup/Signup'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import { ErrorPage } from './pages/Error/ErrorPage'
import { VerifyAccount } from './pages/VerifyAccount/VerifyAccount'
import { MaintenancePage } from './pages/Maintenance/Maintenance'

export default function App() {

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
      
        // Receive returned data and set state with data.
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


  return (
    <div className="app">
      <Header />
      {/* <MaintenancePage /> */}
      <Routes>
        <Route path="/" element={<Home seasonData={returnedEventData} driverData={returnedDriverData} />} />
        <Route path="/predictor" element={<Predictor seasonData={returnedEventData} driverData={returnedDriverData} />} />
        <Route path="/calendar" element={<Calendar seasonData={returnedEventData} />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp seasonData={returnedEventData} />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/resetpassword' element={<ResetPassword />} />
        <Route path='/verifyaccount' element={<VerifyAccount />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Menu />
    </div>
  )
}


