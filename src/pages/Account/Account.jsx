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
                <img src={LogoBlack} alt="" />
                <h3>Disclaimer</h3>
                <p>This application ("the App") is an unofficial, fan-focused resource for Formula 1 ("F1") enthusiasts. The App is not affiliated with Formula One World Championship Limited, Formula 1, or any other organization associated with the FIA Formula One World Championship.</p>
                <h3>Purpose and Use</h3>
                <p>The App is designed solely for informational and entertainment purposes, providing F1 fans with news, updates, statistics, and other related content. The use of the F1 name and associated trademarks within the App is strictly for informational purposes and does not imply any endorsement or sponsorship by Formula One World Championship Limited, Formula 1, or any other official F1 entity.</p>
                <h3>Not Affiliated with F1</h3>
                <p>The creators and developers of this App are independent enthusiasts and are not officially connected with the FIA Formula One World Championship or any of its affiliates. The App is operated independently and is not endorsed, sponsored, or approved by Formula One World Championship Limited, Formula 1, or any related entities.</p>
                <h3>Accuracy of Information</h3>
                <p>While every effort is made to ensure the accuracy of the information provided, the creators and developers of the App cannot guarantee the accuracy of the information presented. The App is not responsible for any errors or omissions in the content provided and does not accept any liability for any losses or damages arising from the use of the App or the information contained within it.</p>
                <h3>Limitation of Liability</h3>
                <p>The creators and developers of the App shall not be held liable for any damages or losses arising from the use of the App, including but not limited to direct, indirect, incidental, or consequential damages. Users access and use the App at their own risk.</p>
                <h3>Copyright Notice</h3>
                <p>All content, including but not limited to text, images, logos, and trademarks, contained within the App are the property of their respective owners. Use of such content is protected by copyright and other intellectual property laws and is used within the App under the principles of fair use.</p>
                <h3>Contact Us</h3>
                <p>If you have any questions or concerns about the App, please contact us at <a href="mailto:gridlock.contact@gmail.com">gridlock.contact@gmail.com</a>. We will make every effort to address your concerns and provide any necessary information.</p>
            </div>
        </section>
    )
}