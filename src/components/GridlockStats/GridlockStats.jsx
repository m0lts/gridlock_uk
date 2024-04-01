import { DriverListSmall } from "../DriverGrid/DriverGrid"
import { PrimaryHeading } from "../Typography/Titles/Titles"
import { LoaderWhite } from "../Loader/Loader"
import './gridlock-stats.styles.css'
import { useEffect, useState } from "react"
import { getCountryFlag } from "../../utils/getCountryFlag"

export const GridlockStats = ({ nextEvent, driverData, seasonData }) => {

    const [bestPrediction, setBestPrediction] = useState();
    const [bestPredictionResultData, setBestPredictionResultData] = useState();
    const [totalGridlockPoints, setTotalGridlockPoints] = useState();
    const [bestPredictionLastRound, setBestPredictionLastRound] = useState();
    const [bestPredictionLastRoundResultData, setBestPredictionLastRoundResultData] = useState();


    useEffect(() => {
        const fetchBestPrediction = async () => {
            try {
                const response = await fetch('/api/points/handleBestPrediction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();
                setBestPrediction(data);
                const competitionData = seasonData.find(event => event.competitionId === data.competitionId);
                const raceData = competitionData.events.find(event => event.type === 'Race');
                const raceId = raceData.id;
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
                        setBestPredictionResultData(cleanData);
                    } else {
                        console.log('failure');
                    }
                } catch (error) {
                    console.error('Error collecting data:', error);
                }

            } catch (error) {
                console.error('Error collecting data:', error);
            }
        }

        const fetchLastRoundBestPrediction = async () => {
            const competitionData = seasonData.filter(event => event.status === 'Completed').reverse();
            const lastRound = competitionData[0];
            const lastRoundId = lastRound.competitionId;
            const raceData = lastRound.events.find(event => event.type === 'Race');
            const raceId = raceData.id;
            try {
                const response = await fetch('/api/predictions/handleLastRoundBestPrediction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(lastRoundId),
                });
                const data = await response.json();
                setBestPredictionLastRound(data);
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
                        setBestPredictionLastRoundResultData(cleanData);
                    } else {
                        console.log('failure');
                    }
                } catch (error) {
                    console.error('Error collecting data:', error);
                }

            } catch (error) {
                console.error('Error collecting data:', error);
            }
        }

        const fetchTotalGridlockPoints = async () => {
            try {
                const response = await fetch('/api/points/handleTotalGridlockPoints', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();
                setTotalGridlockPoints(data);

            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }

        if (nextEvent.length > 0 && seasonData.length > 0) {
            fetchBestPrediction();
            fetchLastRoundBestPrediction();
        }
        fetchTotalGridlockPoints();

    }, [nextEvent, seasonData, driverData])


    const getTeamColour = (team) => {
        switch (team) {
            case 'Red Bull Racing':
                return '#3671C6';
                break;
            case 'Mercedes-AMG Petronas':
                return '#29F4D2';
                break;
            case 'McLaren Racing':
                return '#FF8001';
                break;
            case 'Scuderia Ferrari':
                return '#E8022D';
                break;
            case 'Scuderia Ferrari ':
                return '#E8022D';
                break;
            case 'Scuderia Ferrari\n':
                return '#E8022D';
                break;
            case 'Visa Cash App RB Formula One Team':
                return '#6592FF';
                break;
            case 'Scuderia AlphaTauri Honda':
                return '#6592FF';
                break;
            case 'Aston Martin F1 Team':
                return '#239971';
                break;
            case 'Alpine F1 Team':
                return '#FF87BC';
                break;
            case 'Williams F1 Team':
                return '#63C4FF';
                break;
            case 'Stake F1 Team Kick Sauber':
                return '#52E252';
                break;
            case 'Alfa Romeo':
                return '#52E252';
                break;
            case 'Haas F1 Team':
                return '#B6BABD';
                break;
            default:
                return '#FFFFFF';
                break;
        }
    }


    return (
        <section className="gridlock-stats">
            {nextEvent.length > 0 ? (
                <>
                    <h2>Gridlock Stats</h2>
                    <div className="best-prediction-last-round section">
                        {bestPredictionLastRound ? (
                            <>
                                <div className="subtitle">
                                    <h3>Last Round's Best Prediction</h3>
                                    <figure className="circular-flag">
                                        <img src={getCountryFlag(bestPredictionLastRound.competitionCountry)} alt={`${bestPredictionLastRound.competitionCountry} flag`} />
                                    </figure>
                                </div>
                                <div className="details">
                                    <h3>{bestPredictionLastRound.userName}</h3>
                                    <h3>
                                        {bestPredictionLastRound.totalPoints} points
                                    </h3>
                                </div>
                                {bestPredictionLastRoundResultData && bestPredictionLastRoundResultData.length > 0 && (
                                <DriverListSmall
                                    prediction={bestPredictionLastRound.userPrediction}
                                    result={bestPredictionLastRoundResultData}
                                />
                                )}
                            </>
                        ) : (
                            <LoaderWhite />
                        )}
                    </div>
                    <div className="gridlock-points section">
                        {totalGridlockPoints ? (
                            <>
                                <h3>Total points scored on Gridlock</h3>
                                <div className="details">
                                    <h1>{totalGridlockPoints}</h1>
                                </div>
                            </>
                        ) : (
                            <LoaderWhite />
                        )}
                    </div>
                    <div className="best-prediction section">
                        {bestPrediction ? (
                            <>
                                <div className="subtitle">
                                    <h3>Best Prediction</h3>
                                    <figure className="circular-flag">
                                        <img src={getCountryFlag(bestPrediction.competitionCountry)} alt={`${bestPrediction.competitionCountry} flag`} />
                                    </figure>
                                </div>
                                <div className="details">
                                    <h3>{bestPrediction.userName}</h3>
                                    <h3>
                                        {bestPrediction.totalPoints} points
                                    </h3>
                                </div>
                                {bestPredictionResultData && bestPredictionResultData.length > 0 && (
                                <DriverListSmall
                                    prediction={bestPrediction.userPrediction}
                                    result={bestPredictionResultData}
                                />
                                )}
                            </>
                        ) : (
                            <LoaderWhite />
                        )}
                    </div>
                </>
            ) : (
                <LoaderWhite />
            )}
        </section>
    )
}