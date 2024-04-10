// Dependencies
import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
// Components
import { GearIcon, LeftChevronIcon, RightChevronIcon } from "../../components/Icons/Icons";
import { LeagueSettingsModal } from "../../components/LeagueOptions/LeagueSettingsModal";
// Styles
import './league-standings.styles.css';


export const LeagueStandings = () => {

    const [showSettingsModal, setShowSettingsModal] = useState(false);

    // Get received data from location state
    const location = useLocation();
    const navigate = useNavigate();
    const inheritedState = location.state;
    const updateTime = inheritedState && inheritedState.updateTime;
    const formattedUpdateTime = updateTime && new Date(updateTime).toLocaleString();


    const handleGoBack = () => {
        window.history.back();
    }

    // If location state doesnt exist, send user back to standings page
    useEffect(() => {
        if (!inheritedState) {
            navigate('/standings');
        }
    }, [])

    return (
        <section className="league-standings">

            {/* Back button */}
            <div className="back-button" onClick={handleGoBack}>
                <LeftChevronIcon />
                Back
            </div>

            {/* Show the league standings */}
            <h1>League Standings</h1>
            {inheritedState && (
                <>
                    <h2>{inheritedState.name}</h2>

                    {/* If user is an admin, allow them to access league settings */}
                    {inheritedState.admin === inheritedState.user && (
                        <div className="league-admin-options" onClick={() => setShowSettingsModal(true)}>
                            <button className="btn white">
                                <GearIcon />
                                League Settings
                            </button>
                        </div>
                    )}


                    <p className="last-updated-msg">Last updated: {formattedUpdateTime}</p>
                    <table className="standings-table">
                        <thead className="head">
                            <tr className="table-row">
                                <th className="table-position">Pos.</th>
                                <th className="table-username">Username</th>
                                <th className="table-points">Points</th>
                            </tr>
                        </thead>
                        <tbody className="body">
                            {inheritedState.standings.map((user, index) => (
                                <tr key={index} className="table-row">
                                    <td className="table-position">{index + 1}</td>
                                    <td className="table-username">
                                        <Link to={{ pathname: `/user/${user.username}`, state: { user } }} className='link'>
                                            {user.username}
                                        </Link>
                                    </td>
                                    <td className="table-points">{user.totalPoints} <RightChevronIcon /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {/* League settings modal */}
            {showSettingsModal && (
                <LeagueSettingsModal setShowModal={setShowSettingsModal} showModal={showSettingsModal} leagueCode={inheritedState.code} leagueName={inheritedState.name} />
            )}

        </section>
    )
    }