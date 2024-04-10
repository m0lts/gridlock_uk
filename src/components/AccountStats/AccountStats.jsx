// Dependencies
import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
// Components
import { RightChevronIcon } from "../Icons/Icons";
import { LoaderWhite } from "../Loader/Loader";
// Styles
import './account-stats.styles.css'

export const AccountStats = ({ userName }) => {

    // Get user data from local storage
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const storedUsername = user ? user.username : null;

    // Get data from session storage
    const storedUserPosition = sessionStorage.getItem('userPosition');
    const storedUserPoints = sessionStorage.getItem('userPoints');
    const storedUserAveragePoints = sessionStorage.getItem('userAveragePoints');

    const [fetchingUserData, setFetchingUserData] = useState(false);
    const [userPosition, setUserPosition] = useState((storedUserPosition && storedUsername === userName) ? storedUserPosition : '-');
    const [userPoints, setUserPoints] = useState((storedUserPoints && storedUsername === userName) ? storedUserPoints : '-');
    const [userAveragePoints, setUserAveragePoints] = useState((storedUserAveragePoints && storedUsername === userName) ? storedUserAveragePoints : '-');


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
                    
                        const sortedStandings = usersWithTotalPoints.sort((a, b) => {
                            if (b.totalPoints !== a.totalPoints) {
                                return b.totalPoints - a.totalPoints;
                            }
                            return a.username.localeCompare(b.username);
                        });
                        const userIndex = sortedStandings.findIndex(entry => entry.username === userName);
                        setUserPosition(configPosition(userIndex !== -1 ? userIndex + 1 : 0));
                        
                        const userPoints = userIndex !== -1 ? sortedStandings[userIndex].totalPoints : 0;
                        setUserPoints(userPoints);
                        
                        const userWeekends = rawStandings.filter(entry => entry.userName === userName);
                        const userWeekendPoints = userWeekends.flatMap(weekend => weekend.points.map(point => point.points));
                        const averagePoints = userWeekendPoints.reduce((a, b) => a + b, 0) / userWeekendPoints.length;
                        const formattedAveragePoints = averagePoints % 1 === 0 ? averagePoints.toFixed(0) : averagePoints.toFixed(2);
                        setUserAveragePoints(formattedAveragePoints);
                        
                        if (storedUsername === userName) {
                            sessionStorage.setItem('userPosition', configPosition(userIndex !== -1 ? userIndex + 1 : 0));
                            sessionStorage.setItem('userPoints', userPoints);
                            sessionStorage.setItem('userAveragePoints', formattedAveragePoints);
                        }
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
            if (!storedUserPosition || !storedUserPoints || !storedUserAveragePoints) {
                setFetchingUserData(true);
            } else {
                setFetchingUserData(false);
            }
        }

    }, [])
    

    return (
        <section className="account-stats">
            {userName ? (
                <>
                    <h5>{userName}</h5>
                    {fetchingUserData ? (
                        <LoaderWhite />
                    ) : (
                        <>
                        <div className="stat-box">
                            <h3>Global Rank</h3>
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
                <Link to={'/login'} className="link feature-locked">
                    <h3>Login to view your stats</h3>
                    <RightChevronIcon />
                </Link>
            )}
        </section>
    )
}