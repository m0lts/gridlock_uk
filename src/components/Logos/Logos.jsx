// Dependencies
import { Link } from "react-router-dom";
// Components
import Logo from "../../assets/logos/logo-white.png";
// Styles
import './logos.styles.css';

export const DefaultLogo = () => {
    return (
        <Link to={'/'} className="default-logo link">
            <img src={Logo} alt="Gridlock logo" />
        </Link>
    )
}

export const NoLinkLogo = () => {
    return (
        <div className="default-logo">
            <img src={Logo} alt="Gridlock logo" />
        </div>
    )
}