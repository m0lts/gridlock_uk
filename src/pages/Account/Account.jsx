import { PrimaryHeading } from '../../components/Typography/Titles/Titles'
import LogoBlack from "../../assets/logos/logo-black.png";
import './account.styles.css'
import { HowToPlay } from '../../components/HowToPlay/HowToPlay';
import { Link, useNavigate } from 'react-router-dom';

export const Account = () => {

    const navigate = useNavigate();

    const userLoggedIn = sessionStorage.getItem('user');
    const user = JSON.parse(userLoggedIn);

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    }
    
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
                                <p><span className='detail'>Username:</span>{user.username}</p>
                                <p><span className='detail'>Email:</span>{user.email}</p>
                            </div>
                            <button className="btn btn-white" onClick={handleLogout}>Log Out</button>
                        </>
                    ) : (
                        <Link to='/login'>
                            <button className="btn btn-white center">Login to Gridlock</button>
                        </Link>
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