// Dependencies
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Components
import { RightChevronIcon } from '../../components/Icons/Icons';
import { PredictorGrid } from './PredictorGrid/PredictorGrid';
import { LoaderWhite } from '../../components/Loader/Loader';
import { PreviousPredictions } from '../../components/PreviousPredictions/PreviousPredictions';
import { NextEventPredictor } from '../../components/NextEventBox/NextEventPredictor';
import { CircuitInformation } from '../../components/CircuitInformation/CircuitInformation';
// Styles
import './predictor.styles.css'


export const Predictor = ({ seasonData, driverData, user }) => {

    // Grid and track stats data
    const [nextEvent, setNextEvent] = useState([]);
    const [roundNumber, setRoundNumber] = useState(0);
    const [qualiTime, setQualiTime] = useState();


    // When the season data has loaded, find the next event and previous events and set relevant states
    useEffect(() => {
        const findEventData = () => {
            const scheduledEvent = seasonData.find(event => event.status === 'Scheduled');

            if (scheduledEvent) {
                setRoundNumber(seasonData.indexOf(scheduledEvent) + 1);
                setNextEvent([scheduledEvent]);
                const quali = scheduledEvent.events.filter(event => event.type === 'Qualifying');
                setQualiTime(new Date(quali[0].date).getTime());
            } else {
                setNextEvent([]);
            }

        };

        if (seasonData.length > 0) {
            findEventData();
        }

    }, [seasonData]);


    return (
        <section className="predictor">
            {(seasonData.length > 0 && nextEvent.length > 0) ? (
                <>
                    <NextEventPredictor 
                        nextEvent={nextEvent}
                        roundNumber={roundNumber}
                    />

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
        </section>
    )
}