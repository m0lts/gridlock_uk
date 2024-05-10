// Dependencies
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
// Components
import { AccountIcon } from '../Icons/Icons'
import { DefaultLogo, NoLinkLogo } from '../Logos/Logos'
// Styles
import './header.styles.css'

export const Header = ({ user }) => {

    const [showAccountMenu, setShowAccountMenu] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        setShowAccountMenu(!showAccountMenu)
        try {
            const response = await fetch('/api/accounts/handleLogout', { method: 'POST' });
            if (response.ok) {
                navigate('/');
                window.location.reload();
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }


    return (
        <header className="header">
            {location.pathname === '/verifyaccount' ? (
                <NoLinkLogo />
            ) : (
                <DefaultLogo />
            )}
            {(location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgotpassword' || location.pathname === '/resetpassword' || location.pathname === '/verifyaccount') ? (
                null
            ) : user ? (
                <div className="account-icon" onClick={() => setShowAccountMenu(!showAccountMenu)}>
                    <AccountIcon />
                </div>
            ) : (
                <Link className='btn white link' to={'/login'}>
                    Login
                </Link>
            )}
            {showAccountMenu && (
                <ul className="account-menu">
                    <li className="item">
                        <Link className="btn black link" to={'/settings'} onClick={() => setShowAccountMenu(!showAccountMenu)}>
                            Settings
                        </Link>
                    </li>
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