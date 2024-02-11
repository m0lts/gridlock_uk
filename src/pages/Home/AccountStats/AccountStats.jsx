import { Link } from "react-router-dom";
import { LockIcon } from "../../../components/Icons/Icons";
import { PrimaryHeading } from "../../../components/Typography/Titles/Titles"
import './account-stats.styles.css'
import { useEffect, useState } from 'react'


export const AccountStats = () => {

    // Check if user is logged in
    const userLoggedIn = sessionStorage.getItem('user');
    const user = JSON.parse(userLoggedIn);

    const [userPosition, setUserPosition] = useState(0);
    const [userPoints, setUserPoints] = useState(0);
    const [userAveragePoints, setUserAveragePoints] = useState(0);

    const configPosition = (position) => {
        if (position === 1) {
            return `${position}st`;
        } else if (position === 2) {
            return `${position}nd`;
        } else if (position === 3) {
            return `${position}rd`;
        } else {
            return `${position}th`;
        }
    }

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const response = await fetch('/api/points/handlePointsCollection', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (response.status === 200) {
                    try {
                        const responseData = await response.json();
                        const usersWithTotalPoints = responseData.usersWithTotalPoints;
                        const rawStandings = responseData.rawStandings;
                    
                        if (!usersWithTotalPoints || !rawStandings) {
                            setUserPosition(0);
                            setUserPoints(0);
                            setUserAveragePoints(0);
                            return;
                        }
                    
                        const sortedStandings = usersWithTotalPoints.sort((a, b) => b.totalPoints - a.totalPoints);
                        const userIndex = sortedStandings.findIndex(entry => entry.username === user.username);
                        setUserPosition(configPosition(userIndex !== -1 ? userIndex + 1 : 0));
                    
                        const userPoints = userIndex !== -1 ? sortedStandings[userIndex].totalPoints : 0;
                        setUserPoints(userPoints);
                    
                        const userWeekends = rawStandings.filter(entry => entry.userName === user.username);
                        const userWeekendPoints = userWeekends.flatMap(weekend => weekend.points.map(point => point.points));
                        const averagePoints = userWeekendPoints.reduce((a, b) => a + b, 0) / userWeekendPoints.length;
                        setUserAveragePoints(averagePoints);
                    } catch (error) {
                        console.error('Error fetching or processing data:', error);
                        setUserPosition(0);
                        setUserPoints(0);
                        setUserAveragePoints(0);
                    }
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }   
        fetchStandings();
    }, [])
    

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
                        <h1>{userPosition ? userPosition : '0'}</h1>
                    </div>
                    <div className="stats-item">
                        <p>Points</p>
                        <h1>{userPoints ? userPoints : '0'}</h1>
                    </div>
                    <div className="stats-item">
                        <p>Average points per weekend</p>
                        <h1>{userAveragePoints ? userAveragePoints : '0'}</h1>
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