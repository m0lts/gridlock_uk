// Dependencies
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
// Components
import { AccountIcon } from '../Icons/Icons'
import { DefaultLogo } from '../Logos/Logos'
// Styles
import './header.styles.css'

export const Header = () => {

    // Get user data from local storage
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const storedUsername = user ? user.username : null;

    const [showAccountMenu, setShowAccountMenu] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    }


    return (
        <header className="header">
            <DefaultLogo />
            {storedUsername ? (
                <div className="account-icon" onClick={() => setShowAccountMenu(!showAccountMenu)}>
                    <AccountIcon />
                </div>
            ) : (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgotpassword' || location.pathname === '/resetpassword') ? (
                null
            ) : (
                <Link className='btn white link' to={'/login'}>
                    Login
                </Link>
            )}
            {showAccountMenu && (
                <ul className="account-menu">
                    <li className='item'>
                        <button className='btn red' onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                </ul>
            )}
        </header>
    )
}