import { NavLink, useLocation } from 'react-router-dom'
import './menu.styles.css'
import { AccountIcon, CalendarIcon, HomeIcon, PredictorIcon, StandingsIcon } from '../Icons/Icons'

export const Menu = () => {

    const location = useLocation()

    const userLoggedIn = localStorage.getItem('user');

    return (
        <nav className="menu">
            <ul className="menu-list">
                <li className="menu-item">
                    <NavLink to="/" className="menu-link link" style={{ color: location.pathname === '/' ? 'var(--red)' : 'var(--white)'}}>
                        <HomeIcon />
                        <p className="text">Home</p>
                    </NavLink>
                </li>
                <li className="menu-item">
                    <NavLink to="/predictor" className="menu-link link" style={{ color: location.pathname === '/predictor' ? 'var(--purple)' : 'var(--white)'}}>
                        <PredictorIcon />
                        <p className="text">Predictor</p>
                    </NavLink>
                </li>
                <li className="menu-item">
                    <NavLink to="/calendar" className="menu-link link" style={{ color: location.pathname === '/calendar' ? 'var(--green)' : 'var(--white)'}}>
                        <CalendarIcon />
                        <p className="text">Calendar</p>
                    </NavLink>
                </li>
                <li className="menu-item">
                    <NavLink to="/standings" className="menu-link link" style={{ color: location.pathname === '/standings' ? 'var(--yellow)' : 'var(--white)'}}>
                        <StandingsIcon />
                        <p className="text">Standings</p>
                    </NavLink>
                </li>
                <li className="menu-item">
                    <NavLink to={`${userLoggedIn ? '/account' : '/login'}`} className="menu-link link" style={{
                        color: (
                            location.pathname === '/account' || 
                            location.pathname === '/login' || 
                            location.pathname === '/signup' || 
                            location.pathname === '/forgotpassword' || 
                            location.pathname === '/resetpassword'
                            ) ? 'var(--blue)' : 'var(--white)'
                    }}>
                        <AccountIcon />
                        <p className="text">{userLoggedIn ? 'Account' : 'Login'}</p>
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}