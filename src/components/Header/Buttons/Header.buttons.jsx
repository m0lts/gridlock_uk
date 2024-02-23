
import { CircleUser } from '../../Icons/Icons'
import './header.buttons.styles.css'

export const LoginButton = () => {
    return (
        <button className="btn primary-button login">
            <CircleUser />
            Login
        </button>
    )
}

export const SignupButton = () => {
    return (
        <button className="btn plain-button signup">
            Signup
        </button>
    )
}