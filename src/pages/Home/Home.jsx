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
import { CookieConsentModal } from '../../components/CookieModal/CookieModal'


export const Home = ({ seasonData, driverData, user }) => {

    const [nextEvent, setNextEvent] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showCookieModal, setShowCookieModal] = useState(false);
    const [roundNumber, setRoundNumber] = useState(0);

    useEffect(() => {
        const checkForUpdateModal = () => {
            localStorage.removeItem('updateModal');
            localStorage.removeItem('updateModalv2');
            const updateModal = localStorage.getItem('updateModalv2.0.1');
            if (!updateModal) {
                setShowUpdateModal(true);
            }
        }
        const checkForCookieModal = () => {
            const cookieConsent = localStorage.getItem('cookieConsent');
            if (!cookieConsent) {
                setShowCookieModal(true);
            }
        }
        checkForUpdateModal();
        checkForCookieModal();
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
            {showCookieModal && (
                <CookieConsentModal
                    showCookieModal={showCookieModal}
                    setShowCookieModal={setShowCookieModal}
                />
            )}
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
        </section>
    )
}