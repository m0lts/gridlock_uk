// Dependencies
import { useState, useEffect } from 'react';
// Components
import { DownChevronIcon, UpChevronIcon } from '../Icons/Icons';
import { LoaderWhite } from '../Loader/Loader';
import { DriverListSmall } from '../DriverGrid/DriverGrid';
// Utils
import { getCountryFlag } from '../../utils/getCountryFlag';
// Styles
import './previous-predictions.styles.css';


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

    const checkQualifyingEvent = (event) => {
        const qualifyingEvent = event.events.find(e => e.type === 'Qualifying');
        const qualifyingCompleted = qualifyingEvent.status === 'Completed' ? true : false;
        return qualifyingCompleted;
    }


    return (
        <div className="previous-predictions">
            {(seasonData.length > 0 && userPoints.length > 0) ? (
                seasonData.map((event, index) => (
                    <div className={`event ${expandedEvents[index] && 'expanded'} ${!checkQualifyingEvent(event) && 'unavailable'}`} key={index} onClick={() => handleClick(index, event.competitionId, event.events.find(e => e.type === 'Race').id)}>
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
            ) : (seasonData.length > 0 && userPoints.message === 'No predictions to display.') ? (
                <div className="no-predictions">
                    <h3>No predictions to display</h3>
                </div>
            ) : (
                <LoaderWhite />
            )}
        </div>
    )
}