import { LockIcon } from "../../../components/Icons/Icons";
import { PrimaryHeading } from "../../../components/Typography/Titles/Titles"
import './account-stats.styles.css'
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';

export const AccountStats = () => {

    // Check if user is logged in
    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

    const [userLoggedIn, setUserLoggedIn] = useState(isAuthenticated);
    

    return (
        <section className="account-stats page-padding">
            <PrimaryHeading 
                title="Account Stats"
                textColour="white"
                accentColour="red"
                backgroundColour="black"
            />
            {userLoggedIn ? (
                <div className="stats">
                    <div className="stats-item">
                        <p>Global Rank</p>
                        <h1>1st</h1>
                    </div>
                    <div className="stats-item">
                        <p>Points</p>
                        <h1>165</h1>
                    </div>
                    <div className="stats-item">
                        <p>Average points per weekend</p>
                        <h1>15.6</h1>
                    </div>
                </div>
            ) : (
                <button className="stats-locked btn btn-black center"  onClick={() => loginWithRedirect()}>
                    <LockIcon />
                    <h3>Login to view your stats</h3>
                </button>
            )}
        </section>
    )
}