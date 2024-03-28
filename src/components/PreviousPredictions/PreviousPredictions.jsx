import { useState, useEffect } from 'react';
import { PrimaryHeading } from '../Typography/Titles/Titles';
import { getCountryFlag } from '../../utils/getCountryFlag';
import { ExpandIcon, CloseIcon, DownChevronIcon, UpChevronIcon } from '../Icons/Icons';
import { LoaderWhite } from '../Loader/Loader';
import { getTeamColour } from '../../utils/getTeamColour';
import './previous-predictions.styles.css';

export const PreviousPredictions = ({ seasonData, userEmail }) => {

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