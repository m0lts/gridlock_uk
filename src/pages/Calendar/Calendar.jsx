import { useState, useEffect } from 'react';
import { PrimaryHeading, UpperCaseTitle } from '../../components/Typography/Titles/Titles'
import './calendar.styles.css'
import { getCountryFlag } from '../../utils/getCountryFlag';
import { getCompetitionDate, getCompetitionMonth, getEventDates, getEventDatesOverview } from '../../utils/getEventDates';
import { LoaderWhite } from '../../components/Loader/Loader';
import { NextEventCalendar } from '../../components/NextEventBox/NextEventCalendar';
import { DownChevronIcon } from '../../components/Icons/Icons';

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
            {(seasonData.length > 0 && nextEvent.length > 0) && (
                <>
                    <NextEventCalendar
                        nextEvent={nextEvent}
                        roundNumber={roundNumber}
                    />
                    <div className="events">
                        <div className="previous">
                            <h3>Previous Rounds</h3>
                            <div className="list">
                                {previousEvents.map((event, index) => (
                                    <div key={index} className="item">
                                        <div className="round">
                                            <h2>{index + 1}</h2>
                                        </div>
                                        <div className="name-and-flag" style={{ backgroundImage: `url(${getCountryFlag(event.competitionCountry)})` }}>
                                            <h2>{event.competitionCountry}</h2>
                                            <div className="opaque-layer"></div>
                                            <DownChevronIcon />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="upcoming">
                            <h3>Upcoming Rounds</h3>
                            <div className="list">
                                {upcomingEvents.map((event, index) => (
                                    <div key={index} className="item">
                                        <div className="round">
                                            <h2>{index + 2 + previousEvents.length}</h2>
                                        </div>
                                        <div className="name-and-flag" style={{ backgroundImage: `url(${getCountryFlag(event.competitionCountry)})` }}>
                                            <h2>{event.competitionCountry}</h2>
                                            <div className="opaque-layer"></div>
                                            <DownChevronIcon />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </section>
    )
}