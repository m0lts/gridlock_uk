// Dependencies
import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
// Components
import { RightChevronIcon } from "../Icons/Icons";
import { LoaderWhite } from "../Loader/Loader";
// Utils
import { decodeToken, getTokenFromCookie } from '../../utils/cookieFunctions';
// Styles
import './account-stats.styles.css'

export const AccountStats = ({ username }) => {

    const [storedUsername, setStoredUsername] = useState(null);

    useEffect(() => {
        // Retrieve JWT token from cookie
        const token = getTokenFromCookie();
        if (!token) {
            return;
        }
    
        // Decode JWT token to get user information
        const decodedToken = decodeToken(token);
        if (decodedToken) {
            setStoredUsername(decodedToken.username);
        }
    }, []);

    // Get data from session storage
    const storedUserPosition = sessionStorage.getItem('userPosition');
    const storedUserPoints = sessionStorage.getItem('userPoints');
    const storedUserAveragePoints = sessionStorage.getItem('userAveragePoints');

    const [fetchingUserData, setFetchingUserData] = useState(false);
    const [userPosition, setUserPosition] = useState((storedUserPosition && storedUsername === username) ? storedUserPosition : '-');
    const [userPoints, setUserPoints] = useState((storedUserPoints && storedUsername === username) ? storedUserPoints : '-');
    const [userAveragePoints, setUserAveragePoints] = useState((storedUserAveragePoints && storedUsername === username) ? storedUserAveragePoints : '-');


    const configPosition = (position) => {
        if (position === 0) {
            return '-';
        } else if (position === 1) {
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
                        const userIndex = sortedStandings.findIndex(entry => entry.username === username);
                        setUserPosition(configPosition(userIndex !== -1 ? userIndex + 1 : 0));
                        
                        const userPoints = userIndex !== -1 ? sortedStandings[userIndex].totalPoints : 0;
                        setUserPoints(userPoints);
                        
                        const userWeekends = rawStandings.filter(entry => entry.userName === username);
                        const userWeekendPoints = userWeekends.flatMap(weekend => weekend.points.map(point => point.points));
                        let averagePoints;
                        if (userWeekendPoints.length === 0) {
                            averagePoints = 0;
                        } else {
                            averagePoints = userWeekendPoints.reduce((a, b) => a + b, 0) / userWeekendPoints.length;
                        }                        
                        const formattedAveragePoints = averagePoints % 1 === 0 ? averagePoints.toFixed(0) : averagePoints.toFixed(2);
                        setUserAveragePoints(formattedAveragePoints);
                        
                        if (storedUsername === username) {
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
        if (username) {
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
            {username ? (
                <>
                    <h5>{username}</h5>
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