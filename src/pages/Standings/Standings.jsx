import { useEffect, useState } from 'react'
import { PrimaryHeading } from '../../components/Typography/Titles/Titles'
import { DownChevronIcon, GearIcon, LockIcon, PlusIcon, RightChevronIcon, UpChevronIcon } from '../../components/Icons/Icons'
import { Link } from 'react-router-dom'
import './standings.styles.css'
import { LoaderBlack, LoaderWhite } from '../../components/Loader/Loader'
import { AccountStats } from '../../components/AccountStats/AccountStats'

export const Standings = () => {
    
    const userLoggedIn = localStorage.getItem('user');
    const user = JSON.parse(userLoggedIn);
    const userVerified = user ? user.verified : false;
    const userName = user.username;

    // Save standings and league data to session storage
    const standingsData = sessionStorage.getItem('standingsData');
    const leaguesData = sessionStorage.getItem('leaguesData');

    const [standings, setStandings] = useState(standingsData ? JSON.parse(standingsData) : []);
    const [leagues, setLeagues] = useState(leaguesData ? JSON.parse(leaguesData) : []);
    const [standingsUpdateTime, setStandingsUpdateTime] = useState(sessionStorage.getItem('standingsUpdateTime') ? new Date(sessionStorage.getItem('standingsUpdateTime')).toLocaleString() : '');
    const [leaguesUpdateTime, setLeaguesUpdateTime] = useState(sessionStorage.getItem('leaguesUpdateTime') ? new Date(sessionStorage.getItem('leaguesUpdateTime')).toLocaleString() : '');

    useEffect(() => {
        const fetchStandingsAndLeagues = async () => {
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
                        }
                        
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (userName) {
            fetchStandingsAndLeagues();
        }

    }, [userName]);

    
    const configUserPosition = (array) => {
        const userIndex = array.findIndex(entry => entry.username === userName);
        return userIndex !== -1 ? userIndex + 1 : 0
    }


    // League creation and joining code
    const [showCreateLeague, setShowCreateLeague] = useState(false);
    const [showJoinLeague, setShowJoinLeague] = useState(false);
    const [creatingLeague, setCreatingLeague] = useState(false);
    const [createdLeague, setCreatedLeague] = useState(false);
    const [joiningLeague, setJoiningLeague] = useState(false);
    const [joinedLeague, setJoinedLeague] = useState(false);
    const [error, setError] = useState('');


    const [leagueName, setLeagueName] = useState('');
    const [leagueCode, setLeagueCode] = useState('');


    const handleCreateLeague = async (e) => {
        setCreatingLeague(true);
        e.preventDefault();

        const leagueData = {
            leagueName: leagueName,
            leagueAdmin: user.username,
            leagueMembers: [user.username],
        }

        try {
            const response = await fetch('/api/leagues/handleCreateLeague', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leagueData),
            });

            if (response.status === 201) {
                const responseData = await response.json();
                setLeagueCode(responseData.leagueCode);
                setCreatingLeague(false);
                setCreatedLeague(true);
            } else if (response.status === 400) {
                setError('League name already taken.');
                setCreatingLeague(false);
                setCreatedLeague(false);
            }
        } catch (error) {
            console.error('Error creating league:', error);
            setError('Error creating league. Please try again.');
        }
    }

    const handleJoinLeague = async (e) => {
        setJoiningLeague(true);
        e.preventDefault();

        const leagueData = {
            leagueCode: leagueCode,
            user: user.username,
        }

        try {
            const response = await fetch('/api/leagues/handleJoinLeague', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leagueData),
            });

            if (response.status === 201) {
                setJoiningLeague(false);
                setJoinedLeague(true);
                window.location.reload();
            } else if (response.status === 400) {
                setError('League details incorrect.');
                setJoiningLeague(false);
                setJoinedLeague(false);
            } else if (response.status === 401) {
                setError('You have already joined this league.');
                setJoiningLeague(false);
                setJoinedLeague(false);
            } else {
                setError('Error joining league. Please try again.');
                setJoiningLeague(false);
                setJoinedLeague(false);
            }
        } catch (error) {
            console.error('Error joining league:', error);
            setError('Error joining league. Please try again.');
        }
    }

    const handleDeleteLeague = async (leagueToDelete) => {
        const response = await fetch('/api/leagues/handleDeleteLeague', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ leagueName: leagueToDelete }),
        });

        if (response.status === 201) {
            window.location.reload();
        } else {
            console.error('Error deleting league.');
        }
    }


    const [verifyButtonText, setVerifyButtonText] = useState('Re-send verification link');

    // Resend verification link
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
            setVerifyButtonText('Verification link sent.');
        } else if (response.status === 401) {
            setVerifyButtonText('Error sending verification link.');
        }
    }

    // Copy league code to clipboard
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => setCopied(true))
            .catch((err) => console.error('Failed to copy:', err));
    };

    // Show league details
    const [selectedLeague, setSelectedLeague] = useState(null);

    const toggleLeagueDetails = (index) => {
        setSelectedLeague(selectedLeague === index ? null : index);
    };

    return (
        <section className='standings bckgrd-black'>
            <AccountStats 
                userName={userName}
            />
            <div className="two-buttons">
                <button className="btn black">
                    <PlusIcon />
                    Join a league
                </button>
                <button className="btn white">
                    <GearIcon />
                    Create a league
                </button>
            </div>
            <div className="leagues-section">
                <h2>Standings</h2>
                <div className="subtitle">
                    <h3>Public Leagues</h3>
                    <p className='last-updated-msg'>Last updated: {standingsUpdateTime}</p>
                </div>
                <div className="leagues">
                    <Link className="league link" to={'/standings/global'} state={{ name: 'Global', standings: standings, admin: null, updateTime: standingsUpdateTime }}>
                        <div className='left'>
                            <h3 className='position-box'>{standings.length > 0 ? configUserPosition(standings) : '-'}</h3>
                            <p>Global</p>
                        </div>
                        <RightChevronIcon />
                    </Link>
                </div>
                <div className="subtitle">
                    <h3>Private Leagues</h3>
                    <p className='last-updated-msg'>Last updated: {leaguesUpdateTime}</p>
                </div>
                <div className="leagues">
                    {leagues.length > 0 ? (
                        leagues.map((league, index) => (
                            <Link key={index} className="league link" to={`/standings/${league.leagueName}`} state={{ name: league.leagueName, standings: league.leagueMembers, admin: league.leagueAdmin, updateTime: leaguesUpdateTime }}>
                                <div className='left'>
                                    <h3 className='position-box'>{configUserPosition(league.leagueMembers)}</h3>
                                    <p>{league.leagueName}</p>
                                </div>
                                <RightChevronIcon />
                            </Link>
                        ))
                    ) : (
                        <LoaderWhite />
                    )}
                </div>
            </div>
            <div className="bottom-filler">

            </div>

            {/* <div className="global-table page-padding bckgrd-white">
                <PrimaryHeading
                    title="Global Standings"
                    accentColour="yellow"
                    backgroundColour="black"
                    textColour="white"
                />
                <table className="table">
                    <thead className='head'>
                        <tr>
                            <th className='col1'>Position</th>
                            <th className='col2'>Username</th>
                            <th className='col3'>Points</th>
                        </tr>
                    </thead>
                    <tbody 
                        className="body"
                    >
                        {loading ? (
                            <tr>
                                <td colSpan="3"><LoaderBlack /></td>
                            </tr>
                        ) : (
                            standings.length === 0 ? (
                                <tr>
                                    <td colSpan="3">No standings available.</td>
                                </tr>
                            ) : (
                                standings.map((user, index) => (
                                    <tr key={index}>
                                        <td className='col1'>{index + 1}</td>
                                        <td className="col2">
                                            <Link to={{ pathname: `/user/${user.username}`, state: { user } }} className='link'>
                                                {user.username}
                                            </Link>
                                        </td>
                                        <td className='col3'>{user.totalPoints}</td>
                                    </tr>
                                ))
                            )
                        )}
                    </tbody>
                </table>
            </div>
            <div className="league-tables page-padding bckgrd-black">
                {leagues.length > 0 && (
                    leagues.map((league, index) => {
                        return (
                            <div key={index} className='user-leagues'>
                                <div className="league-title">
                                    <PrimaryHeading 
                                        title={league.leagueName}
                                        accentColour="yellow"
                                        backgroundColour="white"
                                        textColour="black"
                                    />
                                    {league.leagueAdmin === user.username && (
                                        <button className='btn btn-black' onClick={() => toggleLeagueDetails(index)}>
                                            Details {selectedLeague === index ? <UpChevronIcon /> : <DownChevronIcon />}
                                        </button>
                                    )}
                                    </div>
                                    {selectedLeague === index && (
                                        <div className="league-details">
                                            <p>Code: {league._id}</p>
                                            <p className='delete-league' onClick={() => handleDeleteLeague(league.leagueName)}>Delete League</p>
                                        </div>
                                    )}
                                <table className="table black">
                                    <thead className='head'>
                                        <tr>
                                            <th className='col1'>Position</th>
                                            <th className='col2'>Username</th>
                                            <th className='col3'>Points</th>
                                        </tr>
                                    </thead>
                                    <tbody 
                                        className="body"
                                    >
                                        {leaguesLoading ? (
                                            <tr>
                                                <td colSpan="3">Loading...</td>
                                            </tr>
                                        ) : (
                                            standings.length === 0 && Object.keys(leagueStandings).length === 0 ? (
                                                league.leagueMembers.map((member, index) => (
                                                    <tr key={index}>
                                                        <td className='col1'>-</td>
                                                        <td className='col2'>{member}</td>
                                                        <td className='col3'>0</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                sortStandings(leagueStandings[league.leagueName])
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )
                    })
                )}
            </div>
            <div className="league-section">
                {!userLoggedIn ? (
                    <Link to="/login" className='link not-logged-in'>
                        <button className="btn btn-white center">
                            <LockIcon />
                            <h3>Login to create or join a league</h3>
                        </button>
                    </Link>
                ) : userLoggedIn && userVerified === false ? (
                    <div className='verify-account-box yellow'>
                        <LockIcon />
                        <h3>You must verify your account before creating or joining a league.</h3>
                        <button className="predictor-locked btn btn-white center" onClick={handleSendVerificationLink}>
                            <h3>{verifyButtonText}</h3>
                        </button>
                    </div>
                ) : (
                    <div className="two-buttons">
                        <button className="btn btn-white" onClick={() => {
                            setShowCreateLeague(!showCreateLeague);
                            setShowJoinLeague(false);
                            setLeagueCode('');
                            setLeagueName('');
                            setCopied(false);
                            setError('');
                            setCreatedLeague(false);
                            setJoinedLeague(false);
                        }}>Create a League</button>
                        <button className="btn btn-black" onClick={() => {
                            setShowCreateLeague(false);
                            setShowJoinLeague(!showJoinLeague);
                            setLeagueCode('');
                            setLeagueName('');
                            setCopied(false);
                            setError('');
                            setCreatedLeague(false);
                            setJoinedLeague(false);
                        }}>Join a League</button>
                    </div>
                )}
                <div className="create-league-modal" style={{ display: showCreateLeague && !showJoinLeague ? 'block' : 'none'}}>
                    <form className="league-form" onSubmit={handleCreateLeague}>
                        <div className="input-group">
                            <label htmlFor="league-name">League Name:</label>
                            <input type="text" id="league-name" name="league-name" value={leagueName} onChange={(e) => {setLeagueName(e.target.value); setError('')}} />
                        </div>
                        {error && <p className='error-message'>{error}</p>}
                        {leagueCode && !creatingLeague && (
                            <div className="league-code">
                                <p className='label'>League Code:</p>
                                <div className="code">
                                    <p>{leagueCode}</p>
                                    <p className='copy' onClick={() => copyToClipboard(leagueCode)}>Copy</p>
                                </div>
                            </div>
                        )}
                        {createdLeague ? (
                            <div className="league-created">
                                {copied && <p>Copied to clipboard.</p>}
                                <h3>League created!</h3>
                                <p>Send the league code to your friends so that they can join your league.</p>
                            </div>
                        ) : (
                            <button className="btn btn-white" type="submit">{creatingLeague ? 'Creating...' : 'Create League'}</button>
                        )}
                    </form>
                </div>
                <div className="join-league-modal" style={{ display: showJoinLeague && !showCreateLeague ? 'block' : 'none'}}>
                    {joinedLeague ? (
                        <div className="league-created">
                            <p>Joining league...</p>
                        </div>
                    ) : (
                        <form className="league-form" onSubmit={handleJoinLeague}>
                            <div className="input-group">
                                <label htmlFor="league-code">League Code:</label>
                                <input type="text" id="league-code" name="league-code" value={leagueCode} onChange={(e) => {setLeagueCode(e.target.value); setError('')}} />
                            </div>
                            {error && <p className='error-message'>{error}</p>}
                            <button className="btn btn-black" type="submit">{joiningLeague ? 'Joining...' : 'Join League'}</button>
                        </form>
                    )}
                </div>
            </div> */}
        </section>
    )
}