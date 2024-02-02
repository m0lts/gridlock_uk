import { useState, useEffect } from 'react'
import { PrimaryHeading } from '../../components/Typography/Titles/Titles'
import { useAuth0 } from '@auth0/auth0-react'
import './account.styles.css'

export const Account = () => {

    const { loginWithRedirect, logout, isAuthenticated, user, getAccessTokenSilently } = useAuth0()
    const [userMetadata, setUserMetadata] = useState(null)


    const userLoggedIn = isAuthenticated;

    console.log(user, isAuthenticated)

    useEffect(() => {
        const getUserMetadata = async () => {
          const domain = "dev-48tip6fhw83ez2y0.us.auth0.com";
      
          try {
            const accessToken = await getAccessTokenSilently({
              authorizationParams: {
                audience: `https://${domain}/api/v2/`,
                scope: "read:current_user",
              },
            });
      
            const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
      
            const metadataResponse = await fetch(userDetailsByIdUrl, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
      
            const { user_metadata } = await metadataResponse.json();
      
            setUserMetadata(user_metadata);

            console.log(user_metadata)
          } catch (e) {
            console.log(e.message);
          }
        };
      
        getUserMetadata();
      }, [getAccessTokenSilently, user?.sub]);

    
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
                                <h3>User Metadata</h3>
                                    {userMetadata ? (
                                    <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
                                    ) : (
                                    "No user metadata defined"
                                    )}
                            </div>
                            <div className="two-buttons">
                                <button className="btn btn-white" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log Out</button>
                                <button className="btn btn-red">Delete Account</button>
                            </div>
                        </>
                    ) : (
                        <button className="btn btn-white" onClick={() => loginWithRedirect()}>Login</button>
                    )}
                </div>
            </div>
            <div className="how-to-play bckgrd-white page-padding">
                <PrimaryHeading
                    title="How to play"
                    accentColour="blue"
                    backgroundColour="black"
                    textColour="white"
                />
                <div className="info">
                    <div className="sec1">
                        <h3>Overview:</h3>
                        <p>Gridlock is a F1 prediction app. Each weekend users predict which drivers they think will finish in what position.</p>
                    </div>
                    <div className="sec2">
                        <h3>How to play:</h3>
                        <p>Each weekend users predict which top 10 drivers they think will finish in what position. For each correct prediction, the user will be awarded points. The user with the most points at the end of the season will be crowned the winner.</p>
                    </div>
                    <div className="sec3">
                        <h3>Format:</h3>
                        <div className='grid'>
                            <h1>01</h1>
                            <p>Fill in your prediction for the top 10 drivers for each round.</p>
                        </div>
                        <div className='grid'>
                            <h1>02</h1>
                            <p>Submit your prediction before qualifying starts. If you fail to submit a prediction, your previous prediction will be automatically submitted.</p>
                        </div>
                    </div>
                    <div className="sec4">
                        <h3>Points:</h3>
                        <div className="grid">
                            <h1>1 point</h1>
                            <p>For predicting a driver to finish in the top 10.</p>
                        </div>
                        <div className="grid">
                            <h1>3 points</h1>
                            <p>For predicting a driver in the correct position.</p>
                        </div>
                        <div className="grid">
                            <h1>10 points</h1>
                            <p>For getting all 10 drivers in the correct position.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}