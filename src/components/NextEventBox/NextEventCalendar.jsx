// Dependencies
import { Link } from "react-router-dom"
// Components
import { CircuitInformation } from "../CircuitInformation/CircuitInformation"
import { RightChevronIcon } from "../Icons/Icons"
// Utils
import { getCountryFlag } from "../../utils/getCountryFlag"
import { getCompetitionDate, getCompetitionMonth, getCompetitionTime, getEventDatesOverview } from "../../utils/getEventDates"
// Styles
import './next-event-box.styles.css'


export const NextEventCalendar = ({ nextEvent, roundNumber }) => {

    return (
        <section className="next-event-box">
            <div className="top">
                <h3>Round {roundNumber}</h3>
                <h4>{getEventDatesOverview(nextEvent[0].events)}</h4>
            </div>
            <div className="middle centered">
                <figure className="circular-flag large">
                    <img src={getCountryFlag(nextEvent[0].competitionCountry)} alt={`${nextEvent[0].competitionCountry} flag`} />
                </figure>
                <h1>{nextEvent[0].competitionCountry}</h1>
            </div>
            <CircuitInformation
                circuitName={nextEvent[0].competitionCircuitName}
                circuitImage={nextEvent[0].competitionCircuit}
            />
            <div className="competitions">
                {nextEvent[0].events.slice().reverse().map((event, index) => (
                    <div key={index} className='competition'>
                        <div className="date">
                            <h3>{getCompetitionDate(event)}</h3>
                            <h4>{getCompetitionMonth(event)}</h4>
                        </div>
                        {event.status === 'Scheduled' ? (
                            <div className="name-and-time">
                                <h3>{event.type}</h3>
                                <p>{getCompetitionTime(event)}</p>
                            </div>
                        ) : (
                            <Link className='name-and-time link' to={`/session-result/${event.id}`} state={event}>
                                <h3>{event.type}</h3>
                                <div className="see-results">
                                    <p>Results</p>
                                    <RightChevronIcon />
                                </div>
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}