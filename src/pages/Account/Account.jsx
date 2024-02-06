import { PrimaryHeading } from '../../components/Typography/Titles/Titles'
import { useAuth0 } from '@auth0/auth0-react'
import LogoBlack from "../../assets/logos/logo-black.png";
import './account.styles.css'
import { HowToPlay } from '../../components/HowToPlay/HowToPlay';

export const Account = () => {

    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0()

    const userLoggedIn = isAuthenticated;
    
    return (
        <section className='account'>
            <div className='page-padding bckgrd-black'>
                <PrimaryHeading
                    title="Account"
                    accentColour="blue"
                    backgroundColour="white"
                    textColour="black"
                />
                <div className="border">
                    {userLoggedIn ? (
                        <>
                            <div className="info">
                                <p><span className='detail'>Username:</span>{user.nickname}</p>
                                <p><span className='detail'>Email:</span>{user.email}</p>
                            </div>
                            <div className="two-buttons">
                                <button className="btn btn-white" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log Out</button>
                                <button className="btn btn-red">Delete Account</button>
                            </div>
                        </>
                    ) : (
                        <button className="btn btn-white center" onClick={() => loginWithRedirect()}>Login to Gridlock</button>
                    )}
                </div>
            </div>
            <div className="page-padding">
                <HowToPlay
                    backgroundColour="white"
                    textColour="black"
                    accentColour="blue"
                />            
            </div>
            <div className="footer">
                <p>Gridlock is not affiliated with F1 in any way.</p>
                <img src={LogoBlack} alt="" />
            </div>
        </section>
    )
}