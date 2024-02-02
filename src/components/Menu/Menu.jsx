import { NavLink, useLocation } from 'react-router-dom'
import './menu.styles.css'
import { AccountIcon, CalendarIcon, HomeIcon, PredictorIcon, StandingsIcon } from '../Icons/Icons'

export const Menu = () => {

    const location = useLocation()


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
                    <NavLink to="/account" className="menu-link link" style={{ color: location.pathname === '/account' ? 'var(--blue)' : 'var(--white)'}}>
                        <AccountIcon />
                        <p className="text">Account</p>
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}