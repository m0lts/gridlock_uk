// Dependencies
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Components
import { PredictorIcon, RightArrowIcon, RightChevronIcon, RocketIcon, StopwatchIcon } from '../../components/Icons/Icons';
import { PredictorGrid } from './PredictorGrid/PredictorGrid';
import { LoaderWhite } from '../../components/Loader/Loader';
import { PreviousPredictions } from '../../components/PreviousPredictions/PreviousPredictions';
import { NextEventPredictor } from '../../components/NextEventBox/NextEventPredictor';
import { CircuitInformation } from '../../components/CircuitInformation/CircuitInformation';
// Styles
import './predictor.styles.css'
import { QualiBoostModal } from '../../components/BoostModals/QualiBoostModal';
import { GridBoostModal } from '../../components/BoostModals/GridBoostModal';


export const Predictor = ({ seasonData, driverData, user }) => {

    // Grid and track stats data
    const [nextEvent, setNextEvent] = useState([]);
    const [roundNumber, setRoundNumber] = useState(0);
    const [qualiTime, setQualiTime] = useState();
    const [raceTime, setRaceTime] = useState();

    // When the season data has loaded, find the next event and previous events and set relevant states
    useEffect(() => {
        const findEventData = () => {
            const scheduledEvent = seasonData.find(event => event.status === 'Scheduled');

            if (scheduledEvent) {
                setRoundNumber(seasonData.indexOf(scheduledEvent) + 1);
                setNextEvent([scheduledEvent]);
                const quali = scheduledEvent.events.filter(event => event.type === 'Qualifying');
                setQualiTime(new Date(quali[0].date).getTime());
                const race = scheduledEvent.events.filter(event => event.type === 'Race');
                setRaceTime(new Date(race[0].date).getTime());
            } else {
                setNextEvent([]);
            }

        };

        if (seasonData.length > 0) {
            findEventData();
        }

    }, [seasonData]);

    // Boost options functions
    const [showQualiBoostModal, setShowQualiBoostModal] = useState(false);
    const [showGridBoostModal, setShowGridBoostModal] = useState(false);
    const [qualiBoost, setQualiBoost] = useState(false);
    const [gridBoost, setGridBoost] = useState(false);
    const [qualiBoostUsed, setQualiBoostUsed] = useState(false);
    const [gridBoostUsed, setGridBoostUsed] = useState(false);

    useEffect(() => {
        const fetchUserBoosts = async () => {
            try {
                const response = await fetch('/api/predictions/handleGetUserBoosts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userEmail: user.email })
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.qualiBoost) {
                        setQualiBoostUsed(true);
                    }
                    if (data.gridBoost) {
                        setGridBoostUsed(true);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (user) {
            fetchUserBoosts();
        }
    }, [user]);
    

    return (
        <section className="predictor">
            {(seasonData.length > 0 && nextEvent.length > 0) ? (
                <>
                    <NextEventPredictor 
                        nextEvent={nextEvent}
                        roundNumber={roundNumber}
                    />

                    {user && (
                        <div className="bonus-options">
                            <Link to={'/default-prediction'} className='link'>
                                <button className="btn black">
                                    Default Prediction
                                    <RightArrowIcon />
                                </button>
                            </Link>
                            <div className="two-buttons">
                                <button 
                                    className={`btn white ${qualiBoost && 'disabled'}`}
                                    onClick={() => setShowQualiBoostModal(true)} 
                                    style={{ backgroundColor: qualiBoost && 'var(--purple)', color: qualiBoost && 'white'}}
                                    disabled={qualiBoost || gridBoost || raceTime < Date.now() || qualiBoostUsed}
                                >
                                    {qualiBoost ? (
                                        <>
                                            Quali Boost Active
                                        </>
                                    ) : (
                                        <>
                                            <StopwatchIcon />
                                            Quali Boost
                                        </>
                                    )}
                                </button>
                                <button 
                                    className={`btn white ${gridBoost && 'disabled'}`}
                                    onClick={() => setShowGridBoostModal(true)} 
                                    style={{ backgroundColor: gridBoost && 'var(--purple)', color: gridBoost && 'white'}}
                                    disabled={qualiBoost || gridBoost || qualiTime < Date.now() || gridBoostUsed}
                                >
                                    {gridBoost ? (
                                        <>
                                            Grid Boost Active
                                        </>
                                    ) : (
                                        <>
                                            <RocketIcon />
                                            Grid Boost
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Check if user is logged in */}
                    {user ? (
                        <>
                            <div className="predictions">
                                <PredictorGrid
                                    qualiTime={qualiTime}
                                    driverData={driverData}
                                    userEmail={user.email}
                                    userName={user.username}
                                    nextEvent={nextEvent}
                                    qualiBoost={qualiBoost}
                                    gridBoost={gridBoost}
                                    setQualiBoost={setQualiBoost}
                                    setGridBoost={setGridBoost}
                                    raceTime={raceTime}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="feature-locked-cont">
                            <Link to={"/login"} className='link feature-locked'>
                                <h3>Login to make a prediction</h3>
                                <RightChevronIcon />
                            </Link>
                        </div>
                    )}

                    <div className='middle-section'>
                        <h2>Track Info</h2>
                        <CircuitInformation
                            circuitName={nextEvent[0].competitionCircuitName}
                            circuitImage={nextEvent[0].competitionCircuit}
                        />
                    </div>

                    {/* Only show previous predictions if user logged in */}
                    {user ? (
                        <div className="bottom-section">
                            <h2 style={{ marginBottom: '0.5em' }}>Your Previous Predictions</h2>
                            <PreviousPredictions
                                seasonData={seasonData}
                                userEmail={user.email}
                            />
                        </div>
                    ) : (
                        <div className="bottom-section"></div>
                    )}
                </>
            ) : (
                <div className="whole-page-loader">
                    <LoaderWhite />
                </div>
            )}

            {/* Quali and Grid boost modals */}
            {showQualiBoostModal && <QualiBoostModal setShowModal={setShowQualiBoostModal} showModal={showQualiBoostModal} setQualiBoost={setQualiBoost} user={user} nextEvent={nextEvent} />}
            {showGridBoostModal && <GridBoostModal setShowModal={setShowGridBoostModal} showModal={showGridBoostModal} setGridBoost={setGridBoost} user={user} nextEvent={nextEvent} />}
        </section>
    )
}