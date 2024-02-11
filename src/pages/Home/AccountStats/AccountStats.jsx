import { Link } from "react-router-dom";
import { LockIcon } from "../../../components/Icons/Icons";
import { PrimaryHeading } from "../../../components/Typography/Titles/Titles"
import './account-stats.styles.css'


export const AccountStats = () => {

    // Check if user is logged in
    const userLoggedIn = sessionStorage.getItem('user');
    const user = JSON.parse(userLoggedIn);
    

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
                <Link to='/login' className="link">
                    <button className="stats-locked btn btn-black center">
                        <LockIcon />
                        <h3>Login to view your stats</h3>
                    </button>
                </Link>
            )}
        </section>
    )
}