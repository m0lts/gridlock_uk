import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

export const Settings = ({ user }) => {

    console.log(user)

    const navigate = useNavigate();
    const [fanData, setFanData] = useState();
    const [marketingPreferences, setMarketingPreferences] = useState();

    useEffect(() => {
        if (!user) {
            navigate('/');
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/accounts/handleGetUserData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user.user_id }),
                });
                if (response.status === 200) {
                    const responseData = await response.json();
                    setFanData(responseData)
                }
            } catch (error) {
                console.error(error)
            }
            try {
                const response = await fetch('/api/accounts/handleFindUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user: user.username }),
                });
                if (response.status === 200) {
                    const responseData = await response.json();
                    setMarketingPreferences(responseData.emailConsent ? responseData.emailConsent : true)
                }
            } catch (error) {
                console.error(error)
            }
        }

        fetchUserData()

    }, [])

    return (
        <section className="settings">
            <h1>Settings</h1>
            <div className="info">
                <h2>Account</h2>
                <div className="details">
                    <h3>Email address:</h3>
                    <p>{user.email}</p>
                </div>
                <div className="details">
                    <h3>Username:</h3>
                    <p>{user.username}</p>
                </div>
                <button className="btn red">
                    Change Password
                </button>
            </div>
            {fanData && (
                <div className="info">
                    <h2>F1 Fan Data</h2>
                    <div className="details">
                        <h3>Favourite Driver:</h3>
                        <p>{fanData.favouriteDriver}</p>
                    </div>
                    <div className="details">
                        <h3>Favourite Team:</h3>
                        <p>{fanData.favouriteTeam}</p>
                    </div>
                    <div className="details">
                        <h3>Favourite Grand Prix:</h3>
                        <p>{fanData.favouriteGrandPrix}</p>
                    </div>
                    <div className="details">
                        <h3>Nationality:</h3>
                        <p>{fanData.nationality}</p>
                    </div>
                    <div className="details">
                        <h3>F1 Engagement:</h3>
                        <p>{fanData.f1Engagement}</p>
                    </div>
                </div>
            )}
            {marketingPreferences && (
                <div className="info">
                    <h2>Marketing Preferences</h2>
                    <div className="details">
                        <h3>Non-Essential Emails:</h3>
                        <p>
                            {marketingPreferences === 'true' ? (
                                'Allowed'
                            ) : (
                                'Not allowed'
                            )}
                        </p>
                    </div>
                </div>
            )}
        </section>
    )
}