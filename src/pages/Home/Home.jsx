import { useState, useEffect } from 'react'
import { NextEvent } from './NextEvent/NextEvent'
import { AccountStats } from './AccountStats/AccountStats'
import { GridlockStats } from './GridlockStats/GridlockStats'
import './home.styles.css'

export const Home = ({ seasonData }) => {

    const [nextEvent, setNextEvent] = useState([])

    useEffect(() => {
        const findNextEvent = () => {
            const scheduledEvent = seasonData.find(event => event.status === 'Scheduled');
            
            // Check if a scheduled event was found
            if (scheduledEvent) {
                setNextEvent([scheduledEvent]);
            } else {
                setNextEvent([]);
            }
        };

        findNextEvent();
    }, [seasonData]);

    return (
        <section className="home">
            <NextEvent
                nextEvent={nextEvent}
            />
            <AccountStats />
            <GridlockStats
                nextEvent={nextEvent}
            />
        </section>
    )
}