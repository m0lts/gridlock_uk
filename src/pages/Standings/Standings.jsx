// Dependencies
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// Components
import { AccountStats } from '../../components/AccountStats/AccountStats'
import { GearIcon, PlusIcon, RightChevronIcon } from '../../components/Icons/Icons'
import { LoaderWhite } from '../../components/Loader/Loader'
import { JoinLeagueModal } from '../../components/LeagueOptions/JoinLeagueModal'
import { CreateLeagueModal } from '../../components/LeagueOptions/CreateLeagueModal'
// Styles
import './standings.styles.css'


export const Standings = () => {
    
    const userLoggedIn = localStorage.getItem('user');
    const user = JSON.parse(userLoggedIn);
    const userVerified = user ? user.verified : false;
    const userName = user ? user.username : null;

    // Sort standings and league data
    const standingsData = sessionStorage.getItem('standingsData');
    const leaguesData = sessionStorage.getItem('leaguesData');
    const [standings, setStandings] = useState(standingsData ? JSON.parse(standingsData) : []);
    const [leagues, setLeagues] = useState(leaguesData ? JSON.parse(leaguesData) : []);
    const [loadingPrivateLeagues, setLoadingPrivateLeagues] = useState(false);
    const [standingsUpdateTime, setStandingsUpdateTime] = useState(sessionStorage.getItem('standingsUpdateTime') ? new Date(sessionStorage.getItem('standingsUpdateTime')).toLocaleString() : '');
    const [leaguesUpdateTime, setLeaguesUpdateTime] = useState(sessionStorage.getItem('leaguesUpdateTime') ? new Date(sessionStorage.getItem('leaguesUpdateTime')).toLocaleString() : '');

    useEffect(() => {
        const fetchStandingsAndLeagues = async () => {
            setLoadingPrivateLeagues(true);
            try {
                const standingsResponse = await fetch('/api/points/handlePointsCollection', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (standingsResponse.status === 200) {
                    const standingsData = await standingsResponse.json();
                    const sortedStandings = [...standingsData.usersWithTotalPoints].sort((a, b) => {
                        if (b.totalPoints !== a.totalPoints) {
                            return b.totalPoints - a.totalPoints;
                        }
                        return a.username.localeCompare(b.username);
                    });
                    setStandings(sortedStandings);
                    sessionStorage.setItem('standingsData', JSON.stringify(sortedStandings));
                    setStandingsUpdateTime(new Date().toLocaleString());
                    sessionStorage.setItem('standingsUpdateTime', new Date().toLocaleString());

                    try {
                        const leaguesResponse = await fetch('/api/leagues/handleFindLeagues', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ user: userName }),
                        });
                        if (leaguesResponse.status === 200) {
                            const leaguesData = await leaguesResponse.json();
                            const updatedLeagues = leaguesData.leagues.map(league => {
                                const updatedLeagueMembers = league.leagueMembers.map(member => {
                                    const memberStandings = sortedStandings.find(user => user.username === member);
                                    return memberStandings ? { username: member, totalPoints: memberStandings.totalPoints } : member;
                                });
                                const sortedLeagueMembers = updatedLeagueMembers.sort((a, b) => {
                                    if (b.totalPoints !== a.totalPoints) {
                                        return b.totalPoints - a.totalPoints;
                                    }
                                    return a.username.localeCompare(b.username);
                                });
                                return { ...league, leagueMembers: sortedLeagueMembers };
                            });
                            setLeagues(updatedLeagues);
                            sessionStorage.setItem('leaguesData', JSON.stringify(updatedLeagues));
                            setLeaguesUpdateTime(new Date().toLocaleString());
                            sessionStorage.setItem('leaguesUpdateTime', new Date().toLocaleString());
                            setLoadingPrivateLeagues(false);
                        }
                        
                    } catch (error) {
                        console.error('Error fetching data:', error);
                        setLoadingPrivateLeagues(false);
                    }
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                setLoadingPrivateLeagues(false);
            }
        };

        const fetchStandingsOnly = async () => {
            try {
                const standingsResponse = await fetch('/api/points/handlePointsCollection', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (standingsResponse.status === 200) {
                    const standingsData = await standingsResponse.json();
                    const sortedStandings = [...standingsData.usersWithTotalPoints].sort((a, b) => {
                        if (b.totalPoints !== a.totalPoints) {
                            return b.totalPoints - a.totalPoints;
                        }
                        return a.username.localeCompare(b.username);
                    });
                    setStandings(sortedStandings);
                    sessionStorage.setItem('standingsData', JSON.stringify(sortedStandings));
                    setStandingsUpdateTime(new Date().toLocaleString());
                    sessionStorage.setItem('standingsUpdateTime', new Date().toLocaleString());
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (userName) {
            fetchStandingsAndLeagues();
        } else {
            fetchStandingsOnly();
        }

    }, [userName]);

    const configUserPosition = (array) => {
        const userIndex = array.findIndex(entry => entry.username === userName);
        return userIndex !== -1 ? userIndex + 1 : 0
    }


    // League creation and joining functionality
    const [showCreateLeague, setShowCreateLeague] = useState(false);
    const [showJoinLeague, setShowJoinLeague] = useState(false);
    const [verifyButtonText, setVerifyButtonText] = useState('Please verify your account before creating or joining a league');

    const handleSendVerificationLink = async () => {
        setVerifyButtonText('Sending Link...');
        const response = await fetch('/api/accounts/handleResendVerification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: user.email }),
        });

        if (response.ok) {
            setVerifyButtonText('Verification link sent - please check your emails');
        } else if (response.status === 401) {
            setVerifyButtonText('Error sending verification link');
        }
    }

    return (
        <section className='standings'>

            {/* User's Gridlock stats */}
            <AccountStats 
                userName={userName}
            />

            {/* Check if user is verified before showing league options buttons */}
            {userVerified && userLoggedIn ? (
                <div className="two-buttons">
                    <button className="btn black" onClick={() => setShowJoinLeague(!showJoinLeague)}>
                        <PlusIcon />
                        Join a league
                    </button>
                    <button className="btn white" onClick={() => setShowCreateLeague(!showCreateLeague)}>
                        <GearIcon />
                        Create a league
                    </button>
                </div>
            ) : userLoggedIn && !userVerified ? (
                <div className="two-buttons">
                    <button className="btn white" style={{ width: '100%' }} onClick={handleSendVerificationLink}>
                        {verifyButtonText}
                        {verifyButtonText === 'Please verify your account before creating or joining a league' && (
                            <RightChevronIcon />
                        )}
                    </button>
                </div>
            ) : (
                null
            )}

            {/* Show league names and the user's positions in them. User can click on a league to see the full standings */}
            <div className="leagues-section">
                <h2>Standings</h2>
                <div className="subtitle">
                    <h3>Public Leagues</h3>
                    <p className='last-updated-msg'>Last updated: {standingsUpdateTime}</p>
                </div>
                <div className="leagues">
                    <Link className="league link" to={'/standings/global'} state={{ name: 'Global', standings: standings, admin: null, updateTime: standingsUpdateTime }}>
                        <div className='left'>
                            <h3 className='position-box'>{standings.length > 0 && userLoggedIn ? configUserPosition(standings) : '-'}</h3>
                            <p>Global</p>
                        </div>
                        <RightChevronIcon />
                    </Link>
                </div>
                {userLoggedIn && userVerified && (
                    <>
                        <div className="subtitle">
                            <h3>Private Leagues</h3>
                            <p className='last-updated-msg'>Last updated: {leaguesUpdateTime}</p>
                        </div>
                        <div className="leagues">
                            {(leagues.length > 0 && !loadingPrivateLeagues) ? (
                                leagues.map((league, index) => (
                                    <Link key={index} className="league link" to={`/standings/${league.leagueName}`} state={{ name: league.leagueName, standings: league.leagueMembers, admin: league.leagueAdmin, updateTime: leaguesUpdateTime, user: userName, code: league._id }}>
                                        <div className='left'>
                                            <h3 className='position-box'>{configUserPosition(league.leagueMembers)}</h3>
                                            <p>{league.leagueName}</p>
                                        </div>
                                        <RightChevronIcon />
                                    </Link>
                                ))
                            ) : leagues.length === 0 && loadingPrivateLeagues ? (
                                <LoaderWhite />
                            ) : (
                                <p className='no-leagues-msg' style={{ color: 'var(--white)', fontSize: '12px' }}>Your private leagues will appear here if you create or join one.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
            <div className="bottom-filler"></div>

            {/* Modals for creating and joining a league */}
            {showCreateLeague && <CreateLeagueModal setShowModal={setShowCreateLeague} showModal={showCreateLeague} userName={userName} />}
            {showJoinLeague && <JoinLeagueModal setShowModal={setShowJoinLeague} showModal={showJoinLeague} userName={userName} />}

        </section>
    )
}