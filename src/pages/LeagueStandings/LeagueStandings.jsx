import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import './league-standings.styles.css';
import { LeftChevronIcon, RightChevronIcon } from "../../components/Icons/Icons";

export const LeagueStandings = () => {

    const location = useLocation();
    const inheritedState = location.state;
    const updateTime = inheritedState.updateTime;
    const formattedUpdateTime = new Date(updateTime).toLocaleString();

    const params = useParams();
    const pageParams = params.leagueName;

    const handleGoBack = () => {
        window.history.back();
    }

    return (
        <section className="league-standings">
            <div className="back-button" onClick={handleGoBack}>
                <LeftChevronIcon />
                Back
            </div>
            <h1>League Standings</h1>
            <div className="subtitle">
                <h2>{inheritedState.name}</h2>
                <p className="last-updated-msg">Last updated: {formattedUpdateTime}</p>
            </div>
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
        </section>
    )
    }