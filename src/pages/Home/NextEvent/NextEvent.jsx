import { useState } from "react"
import { PrimaryDate } from "../../../components/Typography/Dates/Dates"
import { PrimaryHeading, UpperCaseTitle } from "../../../components/Typography/Titles/Titles"
import MonacoFlag from '../../../assets/flags/monaco_flag.svg'
import MonacoTrack from '../../../assets/circuits/monaco_track.png'

import './next-event.styles.css'
import { Link } from "react-router-dom"

export const NextEvent = () => {

    const [showMoreInfo, setShowMoreInfo] = useState(false);

    const handleShowMoreInfo = () => {
        setShowMoreInfo(!showMoreInfo);
    }

    return (
        <section className="next-event page-padding">
            <PrimaryHeading
                title="Next Event"
                textColour="black"
                accentColour="red"
                backgroundColour="white"
            />
            <div className="body">
                <div className="event-details">
                    <img src={MonacoFlag} alt="" className="flag" />
                    <UpperCaseTitle
                        title="monaco"
                        colour="white"
                    />
                    <PrimaryDate 
                        date="21-23 May 2024"
                        colour="grey"
                    />
                </div>
                <div className="event-circuit">
                    <img src={MonacoTrack} alt="" className="circuit" />
                </div>
            </div>
            {showMoreInfo && (
                <>
                    <div className="event-title">
                        <h1>Formula 1 Monte Carlo Rolex Grand Prix</h1>
                    </div>
                    <div className="more-info">
                        <div className="event-sessions">
                            <p className="session">Practice 1:</p>
                            <p className="session">Practice 2:</p>
                            <p className="session">Practice 3:</p>
                            <p className="session">Qualifying:</p>
                            <p className="session">Race:</p>
                        </div>
                        <div className="event-times">
                            <p className="time">19/05/2024 10:00 (GMT)</p>
                            <p className="time">19/05/2024 14:00 (GMT)</p>
                            <p className="time">19/05/2024 11:00 (GMT)</p>
                            <p className="time">19/05/2024 14:00 (GMT)</p>
                            <p className="time">19/05/2024 14:00 (GMT)</p>
                        </div>
                    </div>
                </>
            )}
            <div className="two-buttons">
                <button className="btn btn-white" onClick={handleShowMoreInfo}>{showMoreInfo ? 'Hide' : 'Show'} More Info</button>
                <button className="btn btn-purple">
                    <Link to="/predictor" className="link">
                        Predictor
                    </Link>
                </button>
            </div>
        </section>
    )
}