// Dependencies
import { useEffect, useState } from "react"
// Components
import { DriverListSmall } from "../DriverGrid/DriverGrid"
import { LoaderWhite } from "../Loader/Loader"
// Utils
import { getCountryFlag } from "../../utils/getCountryFlag"
// Styles
import './gridlock-stats.styles.css'

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
            fetchLastRoundBestPrediction();
            fetchBestPrediction();
            fetchTotalGridlockPoints();
        }

    }, [nextEvent, seasonData, driverData])

    return (
        <section className="gridlock-stats">
            <h2>Gridlock Stats</h2>
            {(bestPrediction && bestPredictionLastRound && totalGridlockPoints && bestPredictionLastRoundResultData && bestPredictionLastRoundResultData.length > 0 && bestPredictionResultData && bestPredictionResultData.length > 0) ? (
                <>
                    <div className="best-prediction-last-round section">
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
                        <DriverListSmall
                            prediction={bestPredictionLastRound.userPrediction}
                            result={bestPredictionLastRoundResultData}
                        />
                    </div>
                    <div className="gridlock-points section">
                        <h3>Total points scored on Gridlock</h3>
                        <div className="details">
                            <h1>{totalGridlockPoints}</h1>
                        </div>
                    </div>
                    <div className="best-prediction section">
                        <div className="subtitle">
                            <h3>Best Prediction 2024</h3>
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
                        <DriverListSmall
                            prediction={bestPrediction.userPrediction}
                            result={bestPredictionResultData}
                        />
                    </div>
                </>   
            ) : (
                <div style={{ width: '100%' }}>
                    <LoaderWhite />
                </div>
            )}
        </section>
    )
}