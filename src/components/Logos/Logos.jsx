import { Link } from "react-router-dom";
import NoTextLogo from "../../assets/logos/logo_notext_vector.svg";
import Logo from "../../assets/logos/logo-white.png";
import './logos.styles.css';

export const DefaultLogo = () => {

    return (
        <Link to={'/'} className="default-logo link">
            <img src={Logo} alt="Gridlock logo" />
        </Link>
    )
}