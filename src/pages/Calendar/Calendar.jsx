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

    const [expandedItem, setExpandedItem] = useState(null);

    const handleItemClick = (index) => {
        setExpandedItem((prevExpandedItem) => (prevExpandedItem === index ? null : index));
    };

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
                            <h3 className='subtitle'>Previous Rounds</h3>
                            <div className="other-events">
                                {previousEvents.map((event, index) => (
                                    <div key={index} className={`item ${expandedItem === index ? 'expanded' : ''}`} onClick={() => handleItemClick(index)}>
                                        {expandedItem === index ? (
                                            <NextEventCalendar
                                                nextEvent={[event]}
                                                roundNumber={index + 1}
                                                expanded={true}
                                            />
                                        ) : (
                                            <>
                                                <div className='left'>
                                                    <h3>R{index + 1}</h3>
                                                    <figure className="circular-flag">
                                                        <img src={getCountryFlag(event.competitionCountry)} alt={`${event.competitionCountry} flag`} />
                                                    </figure>
                                                    <h3>{event.competitionCountry}</h3>
                                                </div>
                                                <DownChevronIcon />
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="upcoming">
                            <h3 className='subtitle'>Upcoming Rounds</h3>
                            <div className="other-events">
                                {upcomingEvents.map((event, index) => (
                                    <div key={index} className={`item ${expandedItem === index + previousEvents.length ? 'expanded' : ''}`} onClick={() => handleItemClick(index + previousEvents.length)}>
                                        {expandedItem === index + previousEvents.length ? (
                                            <NextEventCalendar
                                                nextEvent={[event]}
                                                roundNumber={index + 2 + previousEvents.length}
                                                expanded={true}
                                            />
                                        ) : (
                                            <>
                                                <div className='left'>
                                                    <h3>R{index + 2 + previousEvents.length}</h3>
                                                    <figure className="circular-flag">
                                                        <img src={getCountryFlag(event.competitionCountry)} alt={`${event.competitionCountry} flag`} />
                                                    </figure>
                                                    <h3>{event.competitionCountry}</h3>
                                                </div>
                                                <DownChevronIcon />
                                            </>
                                        )}
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