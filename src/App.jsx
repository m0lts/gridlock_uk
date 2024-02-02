import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { Home } from './pages/Home/Home'
import { Menu } from './components/Menu/Menu'
import { Predictor } from './pages/Predictor/Predictor'
import './assets/global.styles.css'
import { Calendar } from './pages/Calendar/Calendar'
import { Standings } from './pages/Standings/Standings'
import { Account } from './pages/Account/Account'

export default function App() {

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/predictor" element={<Predictor />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/account" element={<Account />} />
      </Routes>
      <Menu />
    </div>
  )
}


