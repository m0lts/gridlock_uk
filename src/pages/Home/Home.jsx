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
// Styles
import './home.styles.css'
import { VerificationModal } from '../../components/VerificationModal/VerificationModal'


export const Home = ({ seasonData, driverData, user }) => {

    const [nextEvent, setNextEvent] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [roundNumber, setRoundNumber] = useState(0);

    useEffect(() => {
        const checkForUpdateModal = () => {
            localStorage.removeItem('updateModal');
            const updateModal = localStorage.getItem('updateModalv2');
            if (!updateModal) {
                setShowUpdateModal(true);
            }
        }
        const checkForVerificationModal = () => {
            if (user.verified === false) {
                setShowVerificationModal(true);
            }
        }
        checkForVerificationModal();
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
                        username={user ? user.username : null}
                    />
                    {user && (
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
            {showVerificationModal && (
                <VerificationModal
                    user={user}
                    setShowModal={setShowVerificationModal}
                    showModal={showVerificationModal}
                />
            )}
        </section>
    )
}