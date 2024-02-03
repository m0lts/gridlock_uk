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
import { filterApiResponse } from './utils/FilterApiResponse'

export default function App() {

  const [apiRequest, setApiRequest] = useState('races?season=2024&timezone=Europe/London');
  const [returnedApiData, setReturnedApiData] = useState([]);

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
              setReturnedApiData(filterApiResponse(responseData.result.response));
            } else {
              console.log('failure');
            }
        } catch (error) {
          console.error('Error submitting form:', error);
        }
    }
    
      fetchData();
      console.log(returnedApiData)

  }, [apiRequest])

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home seasonData={returnedApiData} />} />
        <Route path="/predictor" element={<Predictor seasonData={returnedApiData} />} />
        <Route path="/calendar" element={<Calendar seasonData={returnedApiData} />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/account" element={<Account />} />
      </Routes>
      <Menu />
    </div>
  )
}


