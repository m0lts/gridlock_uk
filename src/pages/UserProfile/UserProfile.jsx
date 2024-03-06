import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import './user-profile.styles.css';
import { LoaderWhite } from "../../components/Loader/Loader";
import { PrimaryHeading } from "../../components/Typography/Titles/Titles";
import { CloseIcon, ExpandIcon } from "../../components/Icons/Icons";
import { getCountryFlag } from "../../utils/getCountryFlag";
import { PreviousPredictions } from "../../components/PreviousPredictions/PreviousPredictions";

export const UserProfile = ({ seasonData }) => {

    // Get user data logic
    const { user } = useParams();
    const [userAccount, setUserAccount] = useState();
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
        const fetchUserRecord = async () => {
            try {
                const response = await fetch('/api/accounts/handleFindUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user }),
                });
                if (response.status === 200) {
                    const responseData = await response.json();
                    setUserAccount(responseData);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }

        const fetchStandings = async () => {
            setFetchingUserData(true);
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
                        const userIndex = sortedStandings.findIndex(entry => entry.username === user);
                        setUserPosition(configPosition(userIndex !== -1 ? userIndex + 1 : 0));
                    
                        const userPoints = userIndex !== -1 ? sortedStandings[userIndex].totalPoints : 0;
                        setUserPoints(userPoints);
                    
                        const userWeekends = rawStandings.filter(entry => entry.userName === user);
                        const userWeekendPoints = userWeekends.flatMap(weekend => weekend.points.map(point => point.points));
                        const averagePoints = userWeekendPoints.reduce((a, b) => a + b, 0) / userWeekendPoints.length;
                        setUserAveragePoints(averagePoints);

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
        
        fetchUserRecord();
        fetchStandings();

    }, [user])


    return (
        <section className="user page-padding bckgrd-black">
            <Link to="/standings" className="link">
                Back to standings
            </Link>
            <header className="header" style={{ borderBottom: !userAccount && '1px solid var(--white)' }}>
                <div className="profile-picture">
                    {userAccount && userAccount.profilePicture ? (
                        <img src={userAccount.profilePicture} alt="Profile" className="image" />
                    ) : (
                        <div className="image">
                            <p>?</p>
                        </div>
                    )}
                </div>
                <h1>{user}</h1>
            </header>
            {userAccount ? (
                <>
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
                    <PreviousPredictions
                        userEmail={userAccount.email}
                        seasonData={seasonData}
                        color="yellow"
                        padding={false}
                    />
                </>
            ) : (
                <LoaderWhite />
            )}
        </section>
    )
}