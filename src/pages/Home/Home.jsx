// Dependencies
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// Components
import { GridlockStats } from '../../components/GridlockStats/GridlockStats'
import { UpdateModal } from '../../components/UpdateModal/UpdateModal'
import { NextEventDefault } from '../../components/NextEventBox/NextEventDefault'
import { AccountStats } from '../../components/AccountStats/AccountStats'
import { GearIcon, StatsIcon } from '../../components/Icons/Icons'
import { LoaderWhite } from '../../components/Loader/Loader'
// Utils
import { getTokenFromCookie } from '../../utils/cookieFunctions'
// Styles
import './home.styles.css'


export const Home = ({ seasonData, driverData }) => {

    const [nextEvent, setNextEvent] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [roundNumber, setRoundNumber] = useState(0);

    const userLoggedIn = localStorage.getItem('user');
    const user = JSON.parse(userLoggedIn);
    const userName = user ? user.username : null;

    useEffect(() => {
        const checkForUpdateModal = () => {
            localStorage.removeItem('updateModal');
            const updateModal = localStorage.getItem('updateModalv2');
            if (!updateModal) {
                setShowUpdateModal(true);
            }
        }
        checkForUpdateModal();
    }, [])


    useEffect(() => {
        const findNextEvent = () => {
            const scheduledEvent = seasonData.find(event => event.status === 'Scheduled');

            if (scheduledEvent) {
                setRoundNumber(seasonData.indexOf(scheduledEvent) + 1);
                setNextEvent([scheduledEvent]);
            } else {
                setNextEvent([]);
            }
        };
        findNextEvent();
    }, [seasonData]);

    return (
        <section className="home">
            {showUpdateModal && (
                <UpdateModal
                    showUpdateModal={showUpdateModal}
                    setShowUpdateModal={setShowUpdateModal}
                />
            )}
            {(seasonData.length > 0 && nextEvent.length > 0) ? (
                <>
                    <NextEventDefault
                        nextEvent={nextEvent}
                        roundNumber={roundNumber}
                    />
                    <AccountStats
                        userName={userName}
                    />
                    {userName && (
                        <div className="middle-section">
                            <div className="two-buttons">
                                <button className="btn black">
                                    <Link to={'/help'} className="link">
                                        <GearIcon />
                                        How to Play
                                    </Link>
                                </button>
                                <button className="btn white">
                                    <Link to={{ pathname: `/user/${user.username}`, state: { user } }} className='link'>
                                        <StatsIcon />
                                        View your stats
                                    </Link>
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="lower-section">
                        <GridlockStats
                            nextEvent={nextEvent}
                            driverData={driverData}
                            seasonData={seasonData}
                        />
                    </div>
                </>
            ) : (
                <div className="whole-page-loader">
                    <LoaderWhite />
                </div>
            )}
        </section>
    )
}