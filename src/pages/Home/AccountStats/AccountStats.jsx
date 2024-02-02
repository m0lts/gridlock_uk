import { LockIcon } from "../../../components/Icons/Icons";
import { PrimaryHeading } from "../../../components/Typography/Titles/Titles"
import './account-stats.styles.css'

export const AccountStats = () => {

    const userLoggedIn = true;

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
                <div className="stats-locked">
                    <LockIcon />
                    <h3>Login to view your stats</h3>
                </div>
            )}
        </section>
    )
}