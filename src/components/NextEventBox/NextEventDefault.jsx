import { Link } from "react-router-dom"
import { CountdownTimer } from "../../pages/Predictor/Countdown/CountdownTimer"
import { getCountryFlag } from "../../utils/getCountryFlag"
import { getEventDatesOverview } from "../../utils/getEventDates"
import { RightChevronIcon } from "../Icons/Icons"
import './next-event-box.styles.css'

export const NextEventDefault = ({ nextEvent, roundNumber }) => {

    return (
        <section className="next-event-box">
            <div className="top">
                <h2>Round {roundNumber}</h2>
                <h4>{getEventDatesOverview(nextEvent[0].events)}</h4>
            </div>
            <Link to={'/'} className="middle link">
                <div className="left">
                    <figure className="flag">
                        <img src={getCountryFlag(nextEvent[0].competitionCountry)} alt={`${nextEvent[0].competitionCountry} flag`} />
                    </figure>
                    <h1>Japan</h1>
                </div>
                <div className="right">
                    <RightChevronIcon />
                </div>
            </Link>
            <div className="bottom">
                <div className="upper">
                    <h3>Predictions Deadline:</h3>
                    <div className="timer">
                        <h2>00:00:05</h2>
                    </div>
                </div>
                <Link to={'/'} className="lower link">
                    <h3>Make your prediction</h3>
                    <RightChevronIcon />
                </Link>
            </div>
        </section>
    )
}