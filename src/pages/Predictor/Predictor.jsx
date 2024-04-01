import { PrimaryHeading, UpperCaseTitle } from '../../components/Typography/Titles/Titles'
import MonacoFlag from '../../assets/flags/monaco_flag.svg'
import { useState, useEffect } from 'react';
import './predictor.styles.css'
import { Parallelograms } from '../../components/Typography/Shapes/Shapes';
import { RainIcon, SunIcon, LockIcon, ExpandIcon, CloseIcon } from '../../components/Icons/Icons';
import { PredictorGrid } from './PredictorGrid/PredictorGrid';
import { CountdownTimer } from './Countdown/CountdownTimer';
import { getCircuitInfo } from '../../utils/getCircuitInfo';
import { Link, useNavigate } from 'react-router-dom';
import { LoaderBlack, LoaderWhite } from '../../components/Loader/Loader';
import { PreviousPredictions } from '../../components/PreviousPredictions/PreviousPredictions';
import { getCountryFlag } from '../../utils/getCountryFlag';
import { NextEventPredictor } from '../../components/NextEventBox/NextEventPredictor';
import { CircuitInformation } from '../../components/CircuitInformation/CircuitInformation';

export const Predictor = ({ seasonData, driverData }) => {

    // Check if user is logged in
    const userLoggedIn = localStorage.getItem('user');
    const user = JSON.parse(userLoggedIn);
    const [userVerified, setUserVerified] = useState(true);
    const [verifyButtonText, setVerifyButtonText] = useState('Re-send verification link');

    const navigate = useNavigate();

    // Grid and track stats data
    const [nextEvent, setNextEvent] = useState([]);
    const [roundNumber, setRoundNumber] = useState(0);
    const [qualiTime, setQualiTime] = useState();
    const [circuitInfo, setCircuitInfo] = useState();

    // Previous predictions data
    const [previousEvents, setPreviousEvents] = useState([]);
    const [previousPrediction, setPreviousPrediction] = useState(Array(previousEvents.length).fill(null));
    const [previousPoints, setPreviousPoints] = useState();
    const [expandedEvents, setExpandedEvents] = useState(Array(previousEvents.length).fill(false));

    // On page load, check if user is verified
    useEffect(() => {
        if (userLoggedIn) {
            if (!user.verified) {
                setUserVerified(false);
            }
        }
    }, [userLoggedIn])

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


    // When the season data has been set, find the next event
    useEffect(() => {
        const findEventData = () => {
            const scheduledEvent = seasonData.find(event => event.status === 'Scheduled');
            const previousEvents = seasonData.filter(event => event.status === 'Completed');

            if (scheduledEvent) {
                setRoundNumber(seasonData.indexOf(scheduledEvent) + 1);
                setNextEvent([scheduledEvent]);
            } else {
                setNextEvent([]);
            }

            if (previousEvents) {
                // setPreviousEvents(previousEvents);
                setPreviousEvents(previousEvents);

            } else {
                setPreviousEvents([]);
            }
        };

        findEventData();
    }, [seasonData]);


    // When next event state has been set, get the countdown to qualifying and the circuit information
    useEffect(() => {
        const getQualiTime = () => {
            const quali = nextEvent[0].events.filter(event => event.type === 'Qualifying');
            setQualiTime(new Date(quali[0].date).getTime());
        }
        if (nextEvent.length > 0) {
            getQualiTime();
            setCircuitInfo(getCircuitInfo[nextEvent[0].competitionCircuitName]);
        }
    }, [nextEvent])


    // When a previous event is clicked, get the user's predictions for those events
    const handleClick = async (index, competitionId) => {
        const newExpandedEvents = [...expandedEvents];
        const expandedIndex = expandedEvents.findIndex(expanded => expanded && expanded !== index);
        if (expandedIndex !== -1) {
            newExpandedEvents[expandedIndex] = false;
            setExpandedEvents(newExpandedEvents);
        } else {
            newExpandedEvents[index] = !newExpandedEvents[index];
            setExpandedEvents(newExpandedEvents);

        }

        setPreviousPrediction([]);
        setPreviousPoints();
        if (!previousPrediction[index]) {
            const response = await fetch('/api/predictions/handleFindUserPrediction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail: user.email, competitionId }),
            });

            if (response.ok) {
                const data = await response.json();
                setPreviousPrediction(data.dbPrediction.prediction);

                try {
                    const response = await fetch('/api/points/handleFindCompetitionPoints', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userEmail: user.email, competitionId }),
                    });
    
                    if (response.ok) {
                        const data = await response.json();
                        setPreviousPoints(data);
                    }
                    
                } catch (error) {
                    console.error(error);
                }

            } else {
                console.log('Error fetching points from database.');
            }

        } else {
            setPreviousPrediction([]);
            setPreviousPoints();
        }
        
    }


    return (
        <section className="predictor">
            {(seasonData.length > 0 && nextEvent.length > 0) && (
                <NextEventPredictor 
                    nextEvent={nextEvent}
                    roundNumber={roundNumber}
                />
            )}
            {userLoggedIn && userVerified ? (
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
            ) : !userVerified && userLoggedIn ? (
                <div className='verify-account-box'>
                    <LockIcon />
                    <h3>You must verify your account before submitting a prediction.</h3>
                    <button className="predictor-locked btn white center" onClick={handleSendVerificationLink}>
                        <h3>{verifyButtonText}</h3>
                    </button>
                </div>
            ) : !userLoggedIn && (
                <Link to="/login" className='link'>
                    <button className="predictor-locked btn white center">
                        <LockIcon />
                        <h3>Login to make a prediction</h3>
                    </button>
                </Link>
            )}
            <div className="middle-section">
                <h2>Track Info</h2>
                {(seasonData.length > 0 && nextEvent.length > 0) && (
                    <CircuitInformation
                        circuitName={nextEvent[0].competitionCircuitName}
                        circuitImage={nextEvent[0].competitionCircuit}
                    />
                )}
            </div>
            <div className="bottom-section">
                <h2 style={{ marginBottom: '0.5em' }}>Your Previous Predictions</h2>
                {userLoggedIn && (
                    <PreviousPredictions
                        seasonData={seasonData}
                        userEmail={user.email}
                    />
                )}
            </div>
        </section>
    )
}