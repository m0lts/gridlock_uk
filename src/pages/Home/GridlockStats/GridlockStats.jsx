import { DriverGrid } from "../../../components/DriverGrid/DriverGrid"
import { HowToPlay } from "../../../components/HowToPlay/HowToPlay"
import { PrimaryHeading } from "../../../components/Typography/Titles/Titles"
import { LoaderWhite } from "../../../components/Loader/Loader"
import './gridlock-stats.styles.css'
import { useEffect, useState } from "react"

export const GridlockStats = ({ nextEvent }) => {

    const [bestPrediction, setBestPrediction] = useState();
    const [totalGridlockPoints, setTotalGridlockPoints] = useState();

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

            } catch (error) {
                console.error('Error submitting form:', error);
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

        // const fetchMostPopularPrediction = async () => {
        //     try {
        //         const response = await fetch('/api/predictions/handleMostPopularPrediction', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             }
        //         });
        //         const data = await response.json();
        //         console.log(data);

        //     } catch (error) {
        //         console.error('Error submitting form:', error);
        //     }
        // }

        fetchBestPrediction();
        fetchTotalGridlockPoints();
        // fetchMostPopularPrediction();
    }, [])

    return (
        <section className="gridlock-stats page-padding">
            {nextEvent.length > 0 ? (
                <>
                    <PrimaryHeading
                        title="Gridlock Stats"
                        textColour="black"
                        accentColour="red"
                        backgroundColour="white"
                    />
                    <div className="best-prediction section">
                        {bestPrediction ? (
                            <>
                                <h2>Best Prediction</h2>
                                <div className="details">
                                    <h3>{bestPrediction.userName}</h3>
                                    <h3>{bestPrediction.competitionName}</h3>
                                    <h3>{bestPrediction.totalPoints}</h3>
                                </div>
                                <DriverGrid
                                    drivers={bestPrediction.userPrediction}
                                />
                            </>
                        ) : (
                            <LoaderWhite />
                        )}
                    </div>
                    <div className="gridlock-points section">
                        {totalGridlockPoints ? (
                            <>
                                <h2>Total points scored on Gridlock</h2>
                                <div className="details">
                                    <h1>{totalGridlockPoints}</h1>
                                </div>
                            </>
                        ) : (
                            <LoaderWhite />
                        )}
                    </div>
                    {/* <div className="most-popular-prediction section">
                        <h2>Most Popular Prediction</h2>
                        <DriverGrid
                            numberOfDrivers={10}
                        />
                    </div> */}
                </>
            ) : (
                <LoaderWhite />
            )}
        </section>
    )
}