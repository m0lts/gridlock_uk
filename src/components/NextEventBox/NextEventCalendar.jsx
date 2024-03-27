// Dependencies
import { useState, useEffect } from "react"
// Components
import { getCountryFlag } from "../../utils/getCountryFlag"
import { getCompetitionDate, getCompetitionMonth, getCompetitionTime, getEventDates, getEventDatesOverview } from "../../utils/getEventDates"
// Styles
import './next-event-box.styles.css'
import { CircuitInformation } from "../CircuitInformation/CircuitInformation"
import { DownChevronIcon, UpChevronIcon } from "../Icons/Icons"

export const NextEventCalendar = ({ nextEvent, roundNumber, expanded }) => {

    const fetchEventResult = async (event) => {
        console.log(event)
        try {
            const response = await fetch('/api/externalData/CallApi.js', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(`https://v1.formula-1.api-sports.io/rankings/races?race=${event.id}`),
            });
          
            // Receive returned data and set state with data.
            if (response.ok) {
                  const responseData = await response.json();
                  console.log(responseData);
                //   const data = responseData.result.response;
    
                } else {
                  console.log('failure');
                }
            } catch (error) {
              console.error('Error submitting form:', error);
            }
    }

    return (
        <section className="next-event-box">
            <div className="top">
                <h3>Round {roundNumber}</h3>
                {expanded ? (
                    <div className="right" style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
                        <h4>{getEventDatesOverview(nextEvent[0].events)}</h4>
                        <UpChevronIcon />   
                    </div>
                ) : (
                    <h4>{getEventDatesOverview(nextEvent[0].events)}</h4>
                )}
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
                    <div key={index} className="competition">
                        <div className="date">
                            <h3>{getCompetitionDate(event)}</h3>
                            <h4>{getCompetitionMonth(event)}</h4>
                        </div>
                        <div className="name-and-time">
                            {event.status === 'Scheduled' ? (
                                <>
                                    <h3>{event.type}</h3>
                                    <p>{getCompetitionTime(event)}</p>
                                </>
                            ) : (
                                <>
                                    <h3>{event.type}</h3>
                                    <div className="see-results" onClick={() => fetchEventResult(event)}>
                                        <p>Results</p>
                                        <DownChevronIcon />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}