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


export const Standings = ({ user }) => {
    
    // Sort standings and league data
    const standingsData = sessionStorage.getItem('standingsData');
    const leaguesData = sessionStorage.getItem('leaguesData');
    const [standings, setStandings] = useState(standingsData ? JSON.parse(standingsData) : []);
    const [leagues, setLeagues] = useState(leaguesData ? JSON.parse(leaguesData) : []);
    const [loadingPrivateLeagues, setLoadingPrivateLeagues] = useState(false);
    const [standingsUpdateTime, setStandingsUpdateTime] = useState(sessionStorage.getItem('standingsUpdateTime') ? sessionStorage.getItem('leaguesUpdateTime') : '');
    const [leaguesUpdateTime, setLeaguesUpdateTime] = useState(sessionStorage.getItem('leaguesUpdateTime') ? sessionStorage.getItem('leaguesUpdateTime') : '');

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
                            body: JSON.stringify({ user: user.username }),
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

        if (user) {
            fetchStandingsAndLeagues();
        } else {
            fetchStandingsOnly();
        }

    }, [user]);

    const configUserPosition = (array) => {
        const userIndex = array.findIndex(entry => entry.username === user.username);
        return userIndex !== -1 ? userIndex + 1 : 0
    }


    // League creation and joining functionality
    const [showCreateLeague, setShowCreateLeague] = useState(false);
    const [showJoinLeague, setShowJoinLeague] = useState(false);

    return (
        <section className='standings'>

            {/* User's Gridlock stats */}
            {user ? (
                <AccountStats 
                    username={user.username}
                />
            ) : (
                <AccountStats
                    username={null}
                />
            )}

            {/* Check if user is logge in */}
            {user && (
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
                            <h3 className='position-box'>{standings.length > 0 && user ? configUserPosition(standings) : '-'}</h3>
                            <p>Global</p>
                        </div>
                        <RightChevronIcon />
                    </Link>
                </div>
                {user && (
                    <>
                        <div className="subtitle">
                            <h3>Private Leagues</h3>
                            <p className='last-updated-msg'>Last updated: {leaguesUpdateTime}</p>
                        </div>
                        <div className="leagues">
                        {(leagues.length > 0 || (sessionStorage.getItem('leaguesData') && JSON.parse(sessionStorage.getItem('leaguesData')).length > 0)) ? (
                            (leagues.length > 0 ? leagues : JSON.parse(sessionStorage.getItem('leaguesData'))).map((league, index) => (
                                <Link key={index} className="league link" to={`/standings/${league.leagueName}`} state={{ name: league.leagueName, standings: league.leagueMembers, admin: league.leagueAdmin, updateTime: leaguesUpdateTime, user: user.username, code: league._id }}>
                                    <div className='left'>
                                        <h3 className='position-box'>{configUserPosition(league.leagueMembers)}</h3>
                                        <p>{league.leagueName}</p>
                                    </div>
                                    <RightChevronIcon />
                                </Link>
                            ))
                        ) : loadingPrivateLeagues ? (
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
            {showCreateLeague && <CreateLeagueModal setShowModal={setShowCreateLeague} showModal={showCreateLeague} userName={user.username} />}
            {showJoinLeague && <JoinLeagueModal setShowModal={setShowJoinLeague} showModal={showJoinLeague} userName={user.username} />}

        </section>
    )
}