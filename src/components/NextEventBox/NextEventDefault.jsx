// Dependencies
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
// Components
import { CountdownTimer } from "../Countdown/CountdownTimer"
import { RightChevronIcon } from "../Icons/Icons"
// Utils
import { getCountryFlag } from "../../utils/getCountryFlag"
import { getEventDatesOverview } from "../../utils/getEventDates"
// Styles
import './next-event-box.styles.css'


export const NextEventDefault = ({ nextEvent, roundNumber }) => {

    const [qualifyingTime, setQualifyingTime] = useState('00:00:00:00');
    const [raceTime, setRaceTime] = useState('00:00:00:00');
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

            const race = nextEvent[0].events.find(event => event.type === 'Race');
            if (!race) {
                return;
            }
            const raceTime = new Date(race.date).getTime();
            setRaceTime(raceTime); 

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
                <h3>Round {roundNumber}</h3>
                <h4>{getEventDatesOverview(nextEvent[0].events)}</h4>
            </div>
            <Link to={`/event/${nextEvent[0].competitionId}`} className="middle link" state={{event: nextEvent[0], round: roundNumber}}>
                <div className="left">
                    <figure className="circular-flag large">
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
                    <div className="upper closed">
                        <h3>Predictions Closed</h3>
                        <RightChevronIcon />
                    </div>
                    <Link to={'/predictor'} className="lower closed link">
                        <h3>Quali boost closes in:</h3>
                        <CountdownTimer
                            qualiTime={raceTime}
                         />
                         <RightChevronIcon />
                    </Link>
                </div>
            ) : (
                <div className="bottom">
                    <div className="upper">
                        <h3>Predictions Deadline:</h3>
                        <div className="timer">
                            <CountdownTimer 
                                qualiTime={qualifyingTime}
                            />
                        </div>
                    </div>
                    <Link to={'/predictor'} className="lower link">
                        <h3>Make your prediction</h3>
                        <RightChevronIcon />
                    </Link>
                </div>
            )}
        </section>
    )
}