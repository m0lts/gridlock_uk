// Dependencies
import { useState, useEffect } from "react"
// Components
import { getCountryFlag } from "../../utils/getCountryFlag"
import { getCompetitionDate, getCompetitionMonth, getCompetitionTime, getEventDates, getEventDatesOverview } from "../../utils/getEventDates"
// Styles
import './next-event-box.styles.css'
import { CircuitInformation } from "../CircuitInformation/CircuitInformation"

export const NextEventCalendar = ({ nextEvent, roundNumber }) => {


    return (
        <section className="next-event-box">
            <div className="top">
                <h3>Round {roundNumber}</h3>
                <h4>{getEventDatesOverview(nextEvent[0].events)}</h4>
            </div>
            <div className="middle centered">
                <figure className="flag">
                    <img src={getCountryFlag(nextEvent[0].competitionCountry)} alt={`${nextEvent[0].competitionCountry} flag`} />
                </figure>
                <h1>{nextEvent[0].competitionCountry}</h1>
            </div>
            <CircuitInformation
                circuitName={nextEvent[0].competitionCircuitName}
                circuitImage={nextEvent[0].competitionCircuit}
            />
            <div className="competitions">
                {nextEvent[0].events.map((event, index) => (
                    <div key={index} className="item">
                        <div className="date">
                            <h3>{getCompetitionDate(event)}</h3>
                            <h4>{getCompetitionMonth(event)}</h4>
                        </div>
                        <div className="name-and-time">
                            <h2>{event.type}</h2>
                            <p>{getCompetitionTime(event)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}