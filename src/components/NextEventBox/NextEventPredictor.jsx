// Dependencies
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
// Components
import { CountdownTimer } from "../../pages/Predictor/Countdown/CountdownTimer"
import { getCountryFlag } from "../../utils/getCountryFlag"
import { getEventDatesOverview } from "../../utils/getEventDates"
import { GearIcon, RightChevronIcon } from "../Icons/Icons"
// Styles
import './next-event-box.styles.css'

export const NextEventPredictor = ({ nextEvent, roundNumber }) => {

    const [qualifyingTime, setQualifyingTime] = useState('00:00:00:00');
    const [predictionsClosed, setPredictionsClosed] = useState(false);

    useEffect(() => {
        const getQualiTime = () => {
            if (nextEvent.length === 0) {
                return;
            }
            const quali = nextEvent[0].events.find(event => event.type === 'Qualifying');
            if (!quali) {
                return;
            }
            const qualiTime = new Date(quali.date).getTime();
            setQualifyingTime(qualiTime);    

            const currentTime = new Date().getTime();
            const difference = qualiTime - currentTime;
    
            if (difference < 0) {
                setPredictionsClosed(true);
            } else {
                setPredictionsClosed(false);
            }
        }
        if (nextEvent.length > 0) {
            getQualiTime();
        }
    }, [nextEvent]);


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
                    <h1>{nextEvent[0].competitionCountry}</h1>
                </div>
                <div className="right">
                    <RightChevronIcon />
                </div>
            </Link>
            {predictionsClosed ? (
                <div className="bottom">
                    <Link to={'/predictor'} className="upper closed link">
                        <h3>Predictions Closed</h3>
                        <RightChevronIcon />
                    </Link>
                </div>
            ) : (
                <div className="bottom">
                    <div className="upper red">
                        <h3>Predictions Deadline:</h3>
                        <div className="timer">
                            <CountdownTimer 
                                qualiTime={qualifyingTime}
                            />
                        </div>
                    </div>
                    <div className="two-buttons narrow">
                        <button className="btn black">
                            <GearIcon />
                            How to Play
                        </button>
                        <button className="btn white">prev. prediction</button>
                    </div>
                </div>
            )}
        </section>
    )
}