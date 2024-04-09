import { NavLink, useLocation } from 'react-router-dom'
import './menu.styles.css'
import { AccountIcon, CalendarIcon, HomeIcon, PredictorIcon, QuestionIcon, StandingsIcon } from '../Icons/Icons'

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
                    <NavLink to="/predictor" className="menu-link link" style={{ color: location.pathname === '/predictor' ? 'var(--red)' : 'var(--white)'}}>
                        <PredictorIcon />
                        <p className="text">Predictor</p>
                    </NavLink>
                </li>
                <li className="menu-item">
                    <NavLink to="/calendar" className="menu-link link" style={{ color: (location.pathname.includes('/calendar') || location.pathname.includes('event') || location.pathname.includes('session-result')) ? 'var(--red)' : 'var(--white)'}}>
                        <CalendarIcon />
                        <p className="text">Calendar</p>
                    </NavLink>
                </li>
                <li className="menu-item">
                    <NavLink to="/standings" className="menu-link link" style={{ color: (location.pathname.includes('/standings') || location.pathname.startsWith('/user/')) ? 'var(--red)' : 'var(--white)'}}>
                        <StandingsIcon />
                        <p className="text">Standings</p>
                    </NavLink>
                </li>
                <li className="menu-item">
                    <NavLink to="/help" className="menu-link link" style={{ color: location.pathname === '/help' ? 'var(--red)' : 'var(--white)'}}>
                        <QuestionIcon />
                        <p className="text">Help</p>
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}