import { PrimaryHeading, UpperCaseTitle } from '../../components/Typography/Titles/Titles'
import MonacoFlag from '../../assets/flags/monaco_flag.svg'
import { useState, useEffect } from 'react';
import './predictor.styles.css'
import { DriverGrid } from '../../components/DriverGrid/DriverGrid';
import { Parallelograms } from '../../components/Typography/Shapes/Shapes';
import { RainIcon, SunIcon, LockIcon, ExpandIcon, CloseIcon } from '../../components/Icons/Icons';
import { PredictorGrid } from './PredictorGrid/PredictorGrid';
import { getCountryFlag } from '../../utils/getCountryFlag';
import { CountdownTimer } from './Countdown/CountdownTimer';
import { getCircuitInfo } from '../../utils/getCircuitInfo';
import { Link, useNavigate } from 'react-router-dom';
import { LoaderBlack, LoaderWhite } from '../../components/Loader/Loader';


export const Predictor = ({ seasonData, driverData }) => {

    // Check if user is logged in
    const userLoggedIn = localStorage.getItem('user');
    const user = JSON.parse(userLoggedIn);
    const [userVerified, setUserVerified] = useState(true);
    const [verifyButtonText, setVerifyButtonText] = useState('Re-send verification link');

    const navigate = useNavigate();

    // Grid and track stats data
    const [nextEvent, setNextEvent] = useState([]);
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
            <div className="page-padding">
                <PrimaryHeading
                    title="Predictor"
                    accentColour="purple"
                    backgroundColour="white"
                    textColour="black"
                />
                <div className="head">
                    {nextEvent.length === 0 ? (
                        null
                    ) : (
                        <div className="event">
                            <div className="info">
                                <UpperCaseTitle
                                    title={nextEvent[0].competitionCountry}
                                    colour="white"
                                />
                                <img src={getCountryFlag(nextEvent[0].competitionCountry)} alt={`${nextEvent[0].competitionCountry} Flag`} className="flag" />
                            </div>
                            <div className="countdown">
                                <CountdownTimer 
                                    qualiTime={qualiTime}
                                    event={nextEvent[0].competitionName}
                                />
                            </div>
                        </div>
                    )}
                </div>
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
                        <button className="predictor-locked btn btn-white center" onClick={handleSendVerificationLink}>
                            <h3>{verifyButtonText}</h3>
                        </button>
                    </div>
                ) : !userLoggedIn && (
                    <Link to="/login" className='link'>
                        <button className="predictor-locked btn btn-white center">
                            <LockIcon />
                            <h3>Login to make a prediction</h3>
                        </button>
                    </Link>
                )}
            </div>
            <div className="track-stats page-padding">
                <PrimaryHeading
                    title="Track Stats"
                    accentColour="purple"
                    backgroundColour="black"
                    textColour="white"
                />
                {circuitInfo ? (
                    <>
                        <h3>{nextEvent[0].competitionCircuitName}</h3>
                        <div className="statistics">
                            <div className="stat">
                                <p>Downforce:</p>
                                <div className="value">
                                    <Parallelograms
                                        number={circuitInfo.downforce}
                                        color="black"
                                    />
                                </div>
                            </div>
                            <div className="stat">
                                <p>Tyre Stress:</p>
                                <div className="value">
                                    <Parallelograms
                                        number={circuitInfo['tyre stress']}
                                        color="black"
                                    />
                                </div>
                            </div>
                            <div className="stat">
                                <p>Grip:</p>
                                <div className="value">
                                    <Parallelograms
                                        number={circuitInfo.traction}
                                        color="black"
                                    />
                                </div>
                            </div>
                            <div className="stat">
                                <p>Track Evolution:</p>
                                <div className="value">
                                    <Parallelograms
                                        number={circuitInfo['track evolution']}
                                        color="black"
                                    />
                                </div>
                            </div>
                            <div className="stat">
                                <p>Braking:</p>
                                <div className="value">
                                    <Parallelograms
                                        number={circuitInfo.braking}
                                        color="black"
                                    />
                                </div>
                            </div>
                            <div className="stat">
                                <p>Asphalt Abrasion:</p>
                                <div className="value">
                                    <Parallelograms
                                        number={circuitInfo['asphalt abrasion']}
                                        color="black"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <LoaderBlack />
                )
                }
            </div>
            <div className="previous-predictions page-padding">
                <PrimaryHeading
                    title="Previous Predictions"
                    accentColour="purple"
                    backgroundColour="white"
                    textColour="black"
                />
                <div className="previous-predictions-flex">
                    {previousEvents.length > 0 ? (
                        previousEvents.map((event, index) => (
                            <div className={`event ${expandedEvents[index] && 'expanded'}`} key={index} onClick={() => handleClick(index, event.competitionId)}>
                                <div className="competition-bar">
                                    <div className="left">
                                        <p className="round">R{index + 1}</p>
                                        <div className="details">
                                            <img src={getCountryFlag(event.competitionCountry)} className="flag" />
                                            <p className="competition">{event.competitionName}</p>
                                        </div>
                                    </div>
                                    {expandedEvents[index] ? <CloseIcon /> : <ExpandIcon />}
                                </div>
                                {expandedEvents[index] && previousPrediction.length > 0 ? (
                                        <div className="prediction-details">
                                            {previousPrediction.map((prediction, index) => (
                                                <div className="prediction" key={index}>
                                                    <div className="left">
                                                        <p className="position">P{index + 1}</p>
                                                        <div className="driver">
                                                            <img src={prediction.driverImage} />
                                                            <p>{prediction.driverFirstName}</p>
                                                            <p className='name'>{prediction.driverLastName}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="previous-points">
                                                <h3>{previousPoints ? previousPoints : '...'} points scored</h3>
                                            </div>
                                        </div>
                                ) : expandedEvents[index] && previousPrediction.length === 0 ? (
                                    <div className="prediction-details">
                                        <LoaderWhite />
                                    </div>
                                ) : (
                                    null
                                )}
                            </div>
                        ))
                    ) : (
                        <LoaderWhite />
                    )}
                </div>
            </div>
            {/* <div className="weather-forecast page-padding">
                <PrimaryHeading
                    title="Weather Forecast"
                    accentColour="purple"
                    backgroundColour="black"
                    textColour="white"
                />
                <div className="weather">
                    <div className="quali">
                        <h3>Qualifying</h3>
                        <RainIcon />
                    </div>
                    <div className="race">
                        <h3>Race</h3>
                        <SunIcon />
                    </div>
                </div>
            </div> */}
        </section>
    )
}