import { useState, useEffect } from 'react'
import { NextEvent } from './NextEvent/NextEvent'
import { AccountStats } from './AccountStats/AccountStats'
import { GridlockStats } from './GridlockStats/GridlockStats'
import './home.styles.css'
import { CountdownTimer } from '../Predictor/Countdown/CountdownTimer'


export const Home = ({ seasonData, driverData }) => {

    const [nextEvent, setNextEvent] = useState([]);
    const [qualifyingTime, setQualifyingTime] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        const findNextEvent = () => {
            const scheduledEvent = seasonData.find(event => event.status === 'Scheduled');
            
            if (scheduledEvent) {
                setNextEvent([scheduledEvent]);
            } else {
                setNextEvent([]);
            }
        };
        findNextEvent();
    }, [seasonData]);

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
    
            if (difference >= 0 && difference < 86400000) {
                setShowNotification(true);
            } else {
                setShowNotification(false);
            }

        }
        if (nextEvent.length > 0) {
            getQualiTime();
        }
    }, [nextEvent]);




    return (
        <section className="home">
            {showNotification && (
                <div className="notification">
                    <h4>Qualifying starts soon!</h4>
                    <CountdownTimer 
                        qualiTime={qualifyingTime}
                    />
                </div>
            )}
            <NextEvent
                nextEvent={nextEvent}
            />
            <AccountStats />
            <GridlockStats
                nextEvent={nextEvent}
                driverData={driverData}
            />
        </section>
    )
}