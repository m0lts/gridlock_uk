import { useEffect, useState } from 'react'
import { PrimaryHeading } from '../../components/Typography/Titles/Titles'
import { LockIcon } from '../../components/Icons/Icons'
import { Link } from 'react-router-dom'
import './standings.styles.css'

export const Standings = () => {

    const userLoggedIn = sessionStorage.getItem('user');
    const user = JSON.parse(userLoggedIn);
    const userVerified = user ? user.verified : false;

    const [standings, setStandings] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [leagueStandings, setLeagueStandings] = useState({});
    const [loading, setLoading] = useState(true);
    const [leaguesLoading, setLeaguesLoading] = useState(true);
    const [showLeagueDetailsModal, setShowLeagueDetailsModal] = useState(false);

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
                    setLoading(false);
                    const responseData = await response.json();
                    setStandings(responseData.usersWithTotalPoints);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }   

        const fetchLeagues = async () => {
            try {
                const response = await fetch('/api/leagues/handleFindLeagues', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user: user.username }),
                });
                if (response.status === 200) {
                    const responseData = await response.json();
                    setLeagues(responseData.leagues);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }

        fetchStandings();

        if (userLoggedIn) {
            fetchLeagues();
        }

    }, [])


    useEffect(() => {
        const fetchLeagueStandings = async (leagues) => {
            const leagueStandingsMap = {}; // Object to store league standings

            // Loop through each league
            for (const league of leagues) {
                const leagueName = league.leagueName;
                const leagueMembers = league.leagueMembers;
                const leagueStandings = [];

                // Loop through each member of the league
                for (const member of leagueMembers) {
                    // Find user points from standings state
                    const userPoints = standings.find(user => user.username === member);
                    leagueStandings.push(userPoints);
                }

                // Store league standings in the leagueStandingsMap
                leagueStandingsMap[leagueName] = leagueStandings;
            }
            
            setLeagueStandings(leagueStandingsMap);
            setLeaguesLoading(false);
        }

        if (standings.length === 0) {
            setLeaguesLoading(false);
        } else if (leagues.length > 0 && standings.length > 0) {
            fetchLeagueStandings(leagues);
            setLeaguesLoading(true);
        }
    }, [leagues, standings])


    const sortStandings = (standings) => {
        if (standings.length < 2) {
            return (
                <tr>
                    <td className='col1'>1</td>
                    <td className='col2'>{standings[0].username}</td>
                    <td className='col3'>{standings[0].totalPoints}</td>
                </tr>
            )
        } else {
            const sortedStandings = [...standings].sort((a, b) => b.totalPoints - a.totalPoints);
            const standingsTable = sortedStandings.map((user, index) => {
                return (
                    <tr key={index}>
                        <td className='col1'>{index + 1}</td>
                        <td className='col2'>{user.username}</td>
                        <td className='col3'>{user.totalPoints}</td>
                    </tr>
                );
            });
            return standingsTable;
        }
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
            leagueName: leagueName,
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
                setTimeout(() => {
                    setShowJoinLeague(false);
                }, 2000);
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


    return (
        <section className='standings bckgrd-black'>
            <div className="global-table page-padding bckgrd-white">
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
                                <td colSpan="3">Loading...</td>
                            </tr>
                        ) : (
                            standings.length === 0 ? (
                                <tr>
                                    <td colSpan="3">No standings available.</td>
                                </tr>
                            ) : (
                                sortStandings(standings)
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
                                    <p>Code: {league._id}</p>
                                    {/* <button className="btn btn-black" onClick={() => setShowLeagueDetailsModal(!showLeagueDetailsModal)}>See Details</button>
                                    <div className="league-details-modal" style={{ display: showLeagueDetailsModal ? 'block' : 'none' }}>
                                        <h2>League Details</h2>
                                        <p>League Name: {league.leagueName}</p>
                                        <p>League Code: {league._id}</p>
                                        <button className="btn btn-white" onClick={() => setShowLeagueDetailsModal(!showLeagueDetailsModal)}>Close</button>
                                    </div> */}
                                </div>
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
                                            standings.length === 0 ? (
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
                        }}>Create a League</button>
                        <button className="btn btn-black" onClick={() => {
                            setShowCreateLeague(false);
                            setShowJoinLeague(!showJoinLeague);
                            setLeagueCode('');
                            setLeagueName('');
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
                                <p className='code'>{leagueCode}</p>
                            </div>
                        )}
                        {createdLeague ? (
                            <div className="league-created">
                                <p>League created!</p>
                                <p>Send the league name and league code to your friends so that they can join your league.</p>
                            </div>
                        ) : (
                            <button className="btn btn-white" type="submit">{creatingLeague ? 'Creating...' : 'Create League'}</button>
                        )}
                    </form>
                </div>
                <div className="join-league-modal" style={{ display: showJoinLeague && !showCreateLeague ? 'block' : 'none'}}>
                    {joinedLeague ? (
                        <div className="league-created">
                            <p>You've joined {leagueName}!</p>
                        </div>
                    ) : (
                        <form className="league-form" onSubmit={handleJoinLeague}>
                            <div className="input-group">
                                <label htmlFor="league-name">League Name:</label>
                                <input type="text" id="league-name" name="league-name" value={leagueName} onChange={(e) => {setLeagueName(e.target.value); setError('')}} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="league-code">League Code:</label>
                                <input type="text" id="league-code" name="league-code" value={leagueCode} onChange={(e) => {setLeagueCode(e.target.value); setError('')}} />
                            </div>
                            {error && <p className='error-message'>{error}</p>}
                            <button className="btn btn-black" type="submit">{joiningLeague ? 'Joining...' : 'Join League'}</button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}