import { AccountIcon } from '../Icons/Icons'
import { DefaultLogo } from '../Logos/Logos'
import './header.styles.css'

export const Header = () => {
    return (
        <header className="header">
            <DefaultLogo />
            <AccountIcon />
        </header>
    )
}