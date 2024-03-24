import { useState, useEffect } from 'react'
import { NextEvent } from './NextEvent/NextEvent'
import { AccountStats } from './AccountStats/AccountStats'
import { GridlockStats } from './GridlockStats/GridlockStats'
import './home.styles.css'
import { CountdownTimer } from '../Predictor/Countdown/CountdownTimer'
import { UpdateModal } from './UpdateModal/UpdateModal'
import { NextEventDefault } from '../../components/NextEventBox/NextEventDefault'


export const Home = ({ seasonData, driverData }) => {

    const [nextEvent, setNextEvent] = useState([]);
    const [qualifyingTime, setQualifyingTime] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [roundNumber, setRoundNumber] = useState(0);

    useEffect(() => {
        const checkForUpdateModal = () => {
            const updateModal = localStorage.getItem('updateModal');
            if (!updateModal) {
                setShowUpdateModal(true);
            }
        }
        checkForUpdateModal();
    }, [])

    useEffect(() => {
        const findNextEvent = () => {
            const scheduledEvent = seasonData.find(event => event.status === 'Scheduled');

            if (scheduledEvent) {
                setRoundNumber(seasonData.indexOf(scheduledEvent) + 1);
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
            {(seasonData.length > 0 && nextEvent.length > 0) &&(
                <NextEventDefault
                    nextEvent={nextEvent}
                    roundNumber={roundNumber}
                />
            )}
            {showUpdateModal && (
                <UpdateModal
                    showUpdateModal={showUpdateModal}
                    setShowUpdateModal={setShowUpdateModal}
                />
            )}
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