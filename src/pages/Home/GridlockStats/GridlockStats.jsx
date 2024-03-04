import { DriverGrid } from "../../../components/DriverGrid/DriverGrid"
import { HowToPlay } from "../../../components/HowToPlay/HowToPlay"
import { PrimaryHeading } from "../../../components/Typography/Titles/Titles"
import { LoaderWhite } from "../../../components/Loader/Loader"
import './gridlock-stats.styles.css'
import { useEffect, useState } from "react"

export const GridlockStats = ({ nextEvent, driverData }) => {

    const [bestPrediction, setBestPrediction] = useState();
    const [totalGridlockPoints, setTotalGridlockPoints] = useState();
    const [mostPopularPrediction, setMostPopularPrediction] = useState();

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

        const fetchMostPopularPrediction = async () => {
            try {
                const response = await fetch('/api/predictions/handleMostPopularPrediction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();
                const cleanedData = data.map(item => {
                    const { position, ...rest } = item;
                    const driverDetails = driverData.find(driver => driver.driverId === parseInt(rest.driver));
                    if (driverDetails) {
                        rest.driver = {
                            driverFirstName: driverDetails.driverFirstName,
                            driverLastName: driverDetails.driverLastName,
                            driverNumber: driverDetails.driverNumber,
                            driverTeam: driverDetails.driverTeam,
                            driverAbbr: driverDetails.driverAbbr,
                            driverImage: driverDetails.driverImage
                        };
                    }
                    return rest;
                });
                
                setMostPopularPrediction(cleanedData);
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }

        fetchBestPrediction();
        fetchTotalGridlockPoints();
        if (driverData.length > 0) {
            fetchMostPopularPrediction();
        }
    }, [driverData])


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
                    <div className="most-popular-prediction section">
                        {mostPopularPrediction ? (
                            <>
                                <h2>Most Picked Driver in Each Position</h2>
                                <div className="driver-flex">
                                    {mostPopularPrediction.map((driver, index) => (
                                        <div className="driver" key={index} >
                                            <div className="left">
                                                <p className="position">P{index + 1}</p>
                                                <div className="details">
                                                    <div className="color-block" style={{ backgroundColor : `${getTeamColour(driver.driver.driverTeam)}` }}></div>
                                                    <p className="name">{driver.driver.driverLastName}</p>
                                                </div>
                                            </div>
                                            <p className="percentage">{driver.percentage}%</p>
                                        </div>
                                    ))}
                                </div>
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