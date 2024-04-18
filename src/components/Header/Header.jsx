// Dependencies
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
// Components
import { AccountIcon } from '../Icons/Icons'
import { DefaultLogo } from '../Logos/Logos'
// Utils
import { removeTokenFromCookie } from '../../utils/cookieFunctions'
// Styles
import './header.styles.css'

export const Header = ({ user }) => {

    const [showAccountMenu, setShowAccountMenu] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        removeTokenFromCookie();
        navigate('/');
        window.location.reload();
    }


    return (
        <header className="header">
            <DefaultLogo />
            {user ? (
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