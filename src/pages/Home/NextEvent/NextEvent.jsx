import { useState, useEffect } from "react"
import { PrimaryDate } from "../../../components/Typography/Dates/Dates"
import { PrimaryHeading, UpperCaseTitle } from "../../../components/Typography/Titles/Titles"
import MonacoFlag from '../../../assets/flags/monaco_flag.svg'
import MonacoTrack from '../../../assets/circuits/monaco_track.png'
import { Loader } from "../../../components/Loader/Loader"
import './next-event.styles.css'
import { Link } from "react-router-dom"
import { getCountryFlag } from "../../../utils/getCountryFlag"
import { getEventDates, getEventDatesOverview } from "../../../utils/getEventDates"

export const NextEvent = ({ nextEvent }) => {

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
            {nextEvent.length === 0 ? (
                <div className="body">
                    <p className="loading-text white">Loading...</p>
                </div>
            ) : (
                <>
                    <div className="body">
                        <div className="event-details">
                            <img src={getCountryFlag(nextEvent[0].competitionCountry)} alt="" className="flag" />
                            <UpperCaseTitle
                                title={nextEvent[0].competitionCountry}
                                colour="white"
                            />
                            <PrimaryDate 
                                date={getEventDatesOverview(nextEvent[0].events)}
                                colour="grey"
                            />
                        </div>
                        <div className="event-circuit">
                            <img src={nextEvent[0].competitionCircuit} alt="" className="circuit" />
                        </div>
                    </div>
                    {showMoreInfo && (
                        <>
                            <div className="event-title">
                                <h1>{nextEvent[0].events[0].circuit.name}</h1>
                            </div>
                            <div className="more-info">
                                <div className="event-sessions">
                                {getEventDates(nextEvent[0].events).map((event, index) => (
                                    <p key={index} className="session">
                                        {Object.keys(event)[0]}:
                                    </p>
                                ))}
                                </div>
                                <div className="event-times">
                                {getEventDates(nextEvent[0].events).map((event, index) => (
                                    <p key={index} className="time">
                                        {Object.values(event)[0]}
                                    </p>
                                ))}
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
                </>
            )}
        </section>
    )
}