import { useState, useEffect } from 'react';
import { PrimaryHeading } from '../Typography/Titles/Titles';
import { getCountryFlag } from '../../utils/getCountryFlag';
import { ExpandIcon, CloseIcon, DownChevronIcon, UpChevronIcon } from '../Icons/Icons';
import { LoaderWhite } from '../Loader/Loader';
import { getTeamColour } from '../../utils/getTeamColour';
import './previous-predictions.styles.css';
import { DriverListSmall } from '../DriverGrid/DriverGrid';

export const PreviousPredictionsv1 = ({ seasonData, userEmail }) => {

    const [noPreviousPrediction, setNoPreviousPrediction] = useState(false);
    const [previousEvents, setPreviousEvents] = useState([]);
    const [previousPrediction, setPreviousPrediction] = useState(Array(previousEvents.length).fill(null));
    const [previousPoints, setPreviousPoints] = useState();
    const [expandedEvents, setExpandedEvents] = useState(Array(previousEvents.length).fill(false));

    // When the season data has been set, find the next event
    useEffect(() => {
        const findEventData = () => {
            const previousEvents = seasonData.filter(event => event.status === 'Completed');
            if (previousEvents) {
                setPreviousEvents(previousEvents);
            } else {
                setPreviousEvents([]);
            }
        };
        findEventData();
    }, [seasonData]);

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
        setNoPreviousPrediction(false);
        setPreviousPrediction([]);
        setPreviousPoints();
        if (!previousPrediction[index]) {
            const response = await fetch('/api/predictions/handleFindUserPrediction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail: userEmail, competitionId }),
            });

            if (response.status === 200) {
                const data = await response.json();
                setPreviousPrediction(data.dbPrediction.prediction);

                try {
                    const response = await fetch('/api/points/handleFindCompetitionPoints', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userEmail: userEmail, competitionId }),
                    });
    
                    if (response.ok) {
                        const data = await response.json();
                        setPreviousPoints(data);
                    } else {
                        setPreviousPoints();
                    }
                    
                } catch (error) {
                    setPreviousPoints();
                }

            } else {
                setNoPreviousPrediction(true);
            }

        } else {
            setPreviousPrediction([]);
            setPreviousPoints();
            setNoPreviousPrediction(true);
        }
        
    }

    return (
        <div className="previous-predictions">
            {previousEvents.length > 0 ? (
                previousEvents.map((event, index) => (
                    <div className={`event ${expandedEvents[index] && 'expanded'}`} key={index} onClick={() => handleClick(index, event.competitionId)}>
                        <div className="competition-bar">
                            <div className='left'>
                                <h3>R{index + 1}</h3>
                                <figure className="circular-flag">
                                    <img src={getCountryFlag(event.competitionCountry)} alt={`${event.competitionCountry} flag`} />
                                </figure>
                                <h3>{event.competitionCountry}</h3>
                            </div>
                            {expandedEvents[index] ? <UpChevronIcon /> : <DownChevronIcon />}
                        </div>
                        {expandedEvents[index] && previousPrediction.length > 0 ? (
                                <div className="prediction-details">
                                    {previousPrediction.map((prediction, index) => (
                                        <div key={index} className="driver-row">
                                            <h3 className='position'>P{index + 1}</h3>
                                                <div className='driver-details' style={{ border: `1px solid ${getTeamColour(prediction.driverTeam)}`, borderLeft: `5px solid ${getTeamColour(prediction.driverTeam)}` }}>
                                                    <h6>{prediction.driverNumber}</h6>
                                                    <div className="image">
                                                        <img src={prediction.driverImage} alt={prediction.driverLastName} />
                                                    </div>
                                                    <div className="name">
                                                        <p>{prediction.driverFirstName}</p>
                                                        <h3>{prediction.driverLastName}</h3>
                                                    </div>
                                                </div>
                                        </div>
                                    ))}
                                    <div className="previous-points">
                                        <h3>{previousPoints ? previousPoints : '...'} points scored</h3>
                                    </div>
                                </div>
                        ) : expandedEvents[index] && previousPrediction.length === 0 ? (
                            noPreviousPrediction ? (
                                <div className="prediction-details">
                                    <p style={{ color: 'white', paddingBottom: '0.5rem' }}>Prediction doesn't exist.</p>
                                </div>
                            ) : (
                                <div className="prediction-details">
                                    <LoaderWhite />
                                </div>
                            )
                        ) : (
                            null
                        )}
                    </div>
                ))
            ) : (
                <LoaderWhite />
            )}
        </div>
    )
}


export const PreviousPredictions = ({ seasonData, userEmail }) => {

    const [expandedEvents, setExpandedEvents] = useState(Array(seasonData.length).fill(false));
    const [userPoints, setUserPoints] = useState([]);
    const [noPreviousPrediction, setNoPreviousPrediction] = useState(false);
    const [previousPrediction, setPreviousPrediction] = useState([]);
    const [raceResultData, setRaceResultData] = useState();

    useEffect(() => {
        const findUserPointsForEachCompetition = async () => {
            try {
                const response = await fetch('/api/points/handleReturnAllUserPoints', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userEmail: userEmail }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserPoints(data);
                } else {
                    console.log(response);
                }
                
            } catch (error) {
                console.error(error);
            }
        }        

        if (userEmail) {
            findUserPointsForEachCompetition();
        }

    }, [userEmail, seasonData])


    // When a previous event is clicked, get the user's predictions for those events
    const handleClick = async (index, competitionId, raceId) => {
        const newExpandedEvents = [...expandedEvents];
        const expandedIndex = expandedEvents.findIndex(expanded => expanded && expanded !== index);
        if (expandedIndex !== -1) {
            newExpandedEvents[expandedIndex] = false;
            setExpandedEvents(newExpandedEvents);
        } else {
            newExpandedEvents[index] = !newExpandedEvents[index];
            setExpandedEvents(newExpandedEvents);

        }

        setNoPreviousPrediction(false);
        setPreviousPrediction([]);
        setRaceResultData();

        if (!previousPrediction[index]) {
            const response = await fetch('/api/predictions/handleFindUserPrediction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail: userEmail, competitionId }),
            });

            if (response.status === 200) {
                const data = await response.json();
                setPreviousPrediction(data.dbPrediction.prediction);

                try {
                    const response = await fetch('/api/externalData/CallApi.js', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(`/rankings/races?race=${raceId}`),
                    });
                  
                    if (response.ok) {
                        const responseData = await response.json();
                        const dataArray = responseData.result.response;
                        const cleanData =  dataArray.slice(0, 10);
                        setRaceResultData(cleanData);
                    } else {
                        console.log('failure');
                    }
                    
                } catch (error) {
                    setRaceResultData();
                }

            } else {
                setNoPreviousPrediction(true);
            }

        } else {
            setPreviousPrediction([]);
            setNoPreviousPrediction(true);
            setRaceResultData();
        }
        
    }

    const matchUserPointsToSeasonData = (competitionId) => {
        const userPointsForEvent = userPoints.find(i => i.competitionId === competitionId);
        if (!userPointsForEvent) return null;
        const points = userPointsForEvent.points;
        return points;
    }

    return (
        <div className="previous-predictions">
            {(seasonData.length > 0 && userPoints.length > 0) ? (
                seasonData.map((event, index) => (
                    <div className={`event ${expandedEvents[index] && 'expanded'} ${event.status === 'Scheduled' && 'unavailable'}`} key={index} onClick={() => handleClick(index, event.competitionId, event.events.find(e => e.type === 'Race').id)}>
                        <div className="competition-bar">
                            <div className='left'>
                                <h3>R{index + 1}</h3>
                                <figure className="circular-flag">
                                    <img src={getCountryFlag(event.competitionCountry)} alt={`${event.competitionCountry} flag`} />
                                </figure>
                                <h3>{event.competitionCountry}</h3>
                            </div>
                            <div className="right">
                                <h3 style={{ color: 'white'}} >{matchUserPointsToSeasonData(event.competitionId)}</h3>
                                {expandedEvents[index] ? <UpChevronIcon /> : <DownChevronIcon />}
                            </div>
                        </div>
                        {(expandedEvents[index] && previousPrediction.length > 0 && raceResultData) ? (
                                <div className="prediction-details">
                                    <DriverListSmall 
                                        prediction={previousPrediction}
                                        result={raceResultData}
                                    />
                                </div>
                        ) : (expandedEvents[index] && previousPrediction.length === 0 && !noPreviousPrediction) ? (
                                <div className="prediction-details">
                                    <LoaderWhite />
                                </div>
                        ) : (expandedEvents[index] && previousPrediction.length === 0 && !noPreviousPrediction) && (
                            <div className="prediction-details">
                                <h3 style={{ paddingBottom: '0.5rem' }}>No prediction available</h3>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <LoaderWhite />
            )}
        </div>
    )
}