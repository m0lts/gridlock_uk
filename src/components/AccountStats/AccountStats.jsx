import { Link } from "react-router-dom";
import { LockIcon, RightChevronIcon } from "../Icons/Icons";
import { PrimaryHeading } from "../Typography/Titles/Titles"
import './account-stats.styles.css'
import { useEffect, useState } from 'react'
import { LoaderBlack } from "../Loader/Loader";


export const AccountStats = ({ userName }) => {

    const [fetchingUserData, setFetchingUserData] = useState(false);
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
                        const userIndex = sortedStandings.findIndex(entry => entry.username === userName);
                        setUserPosition(configPosition(userIndex !== -1 ? userIndex + 1 : 0));
                    
                        const userPoints = userIndex !== -1 ? sortedStandings[userIndex].totalPoints : 0;
                        setUserPoints(userPoints);
                    
                        const userWeekends = rawStandings.filter(entry => entry.userName === userName);
                        const userWeekendPoints = userWeekends.flatMap(weekend => weekend.points.map(point => point.points));
                        const averagePoints = userWeekendPoints.reduce((a, b) => a + b, 0) / userWeekendPoints.length;
                        const formattedAveragePoints = averagePoints % 1 === 0 ? averagePoints.toFixed(0) : averagePoints.toFixed(2);
                        setUserAveragePoints(formattedAveragePoints);

                        setFetchingUserData(false);
                    } catch (error) {
                        console.error('Error fetching or processing data:', error);
                        setUserPosition(0);
                        setUserPoints(0);
                        setUserAveragePoints(0);
                        setFetchingUserData(false);
                    }
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                setFetchingUserData(false);
            }
        }   
        if (userName) {
            fetchStandings();
            setFetchingUserData(true);
        }

    }, [])
    

    return (
        <section className="account-stats">
            {userName ? (
                <>
                    <h5>{userName}</h5>
                    {fetchingUserData ? (
                        <LoaderBlack />
                    ) : (
                        <>
                        <div className="stat-box">
                            <h3>Your Global Rank</h3>
                            <h1>{userPosition ? userPosition : '0'}</h1>
                        </div>
                        <div className="stat-box">
                            <h3>Points Scored This Season</h3>
                            <h1>{userPoints ? userPoints : '0'}</h1>
                        </div>
                        <div className="stat-box">
                            <h3>Average Points Per Prediction</h3>
                            <h1>{userAveragePoints ? userAveragePoints : '0'}</h1>
                        </div>
                        </>
                    )}                   
                </>
            ) : (
                <Link to={'/login'} className="link locked">
                    <h3>Login here to view your stats</h3>
                    <RightChevronIcon />
                </Link>
            )}
        </section>
    )
}