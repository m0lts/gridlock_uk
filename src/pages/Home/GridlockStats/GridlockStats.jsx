import { DriverGrid } from "../../../components/DriverGrid/DriverGrid"
import { HowToPlay } from "../../../components/HowToPlay/HowToPlay"
import { Loader } from "../../../components/Loader/Loader"
import { PrimaryHeading } from "../../../components/Typography/Titles/Titles"
import './gridlock-stats.styles.css'

export const GridlockStats = ({ nextEvent }) => {

    return (
        <section className="gridlock-stats page-padding">
            {nextEvent.length > 0 ? (
                nextEvent[0].competitionName === "Bahrain Grand Prix" ? (
                    <HowToPlay
                        backgroundColour="black"
                        textColour="white"
                        accentColour="red"
                    />
                ) : (
                    <>
                        <PrimaryHeading
                            title="Gridlock Stats"
                            textColour="black"
                            accentColour="red"
                            backgroundColour="white"
                        />
                        <div className="best-prediction section">
                            <h2>Best Prediction</h2>
                            <div className="details">
                                <h3>m0lts</h3>
                                <h3>Bahrain</h3>
                                <h3>18 points</h3>
                            </div>
                            <DriverGrid
                                numberOfDrivers={10}
                            />
                        </div>
                        <div className="gridlock-points section">
                            <h2>Total points scored on Gridlock</h2>
                            <div className="details">
                                <h1>1,000</h1>
                            </div>
                        </div>
                        <div className="most-popular-prediction section">
                            <h2>Most Popular Prediction</h2>
                            <DriverGrid
                                numberOfDrivers={10}
                            />
                        </div>
                    </>
                )
            ) : (
                <p className="loading-text white">Loading...</p>
            )}
        </section>
    )
}