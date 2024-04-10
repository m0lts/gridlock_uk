// Dependencies
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Components
import { RightChevronIcon } from '../../components/Icons/Icons';
import { LoaderWhite } from '../../components/Loader/Loader';
import { NextEventCalendar } from '../../components/NextEventBox/NextEventCalendar';
// Utils
import { getCountryFlag } from '../../utils/getCountryFlag';
// Styles
import './calendar.styles.css'


export const Calendar = ({ seasonData }) => {

    const [nextEvent, setNextEvent] = useState([]);
    const [previousEvents, setPreviousEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [roundNumber, setRoundNumber] = useState(0);

    useEffect(() => {
        const findNextEvent = () => {
            const scheduledEvent = seasonData.find(event => event.status === 'Scheduled');
            const previousEventsCollection = seasonData.filter(event => event.status === 'Completed');
            const upcomingEventsCollection = seasonData.filter(event => event.status === 'Scheduled' && event !== scheduledEvent);
            
            if (scheduledEvent && previousEventsCollection && upcomingEventsCollection) {
                setRoundNumber(seasonData.indexOf(scheduledEvent) + 1);
                setNextEvent([scheduledEvent]);
                setPreviousEvents(previousEventsCollection);
                setUpcomingEvents(upcomingEventsCollection);
            } else {
                setNextEvent([]);
            }
        };
        findNextEvent();
    }, [seasonData]);

    return (
        <section className="calendar">
            {(seasonData.length > 0 && nextEvent.length > 0) ? (
                <>
                    <div className="next-event">
                        <NextEventCalendar
                            nextEvent={nextEvent}
                            roundNumber={roundNumber}
                        />
                    </div>
                    <div className="events">
                        <div className="previous">
                            <h3 className='subtitle'>Previous Rounds</h3>
                            <div className="other-events">
                                {previousEvents.map((event, index) => (
                                    <Link key={index} className='item link' to={`/event/${event.competitionId}`} state={{event: event, round: index + 1}}>
                                        <div className='left'>
                                            <h3>R{index + 1}</h3>
                                            <figure className="circular-flag">
                                                <img src={getCountryFlag(event.competitionCountry)} alt={`${event.competitionCountry} flag`} />
                                            </figure>
                                            <h3>{event.competitionCountry}</h3>
                                        </div>
                                        <RightChevronIcon />
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="upcoming">
                            <h3 className='subtitle'>Upcoming Rounds</h3>
                            <div className="other-events">
                                {upcomingEvents.map((event, index) => (
                                    <Link key={index} className='item link' to={`/event/${event.competitionId}`} state={{event: event, round: index + 2 + previousEvents.length}}>
                                        <div className='left'>
                                            <h3>R{index + 2 + previousEvents.length}</h3>
                                            <figure className="circular-flag">
                                                <img src={getCountryFlag(event.competitionCountry)} alt={`${event.competitionCountry} flag`} />
                                            </figure>
                                            <h3>{event.competitionCountry}</h3>
                                        </div>
                                        <RightChevronIcon />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="whole-page-loader">
                    <LoaderWhite />
                </div>
            )}
        </section>
    )
}