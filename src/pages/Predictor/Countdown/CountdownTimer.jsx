import React, { useState, useEffect } from 'react';

export const CountdownTimer = ({ qualiTime }) => {
    const [countdown, setCountdown] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date().getTime();
            const difference = qualiTime - currentTime;
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
                // Add leading zeros for single-digit numbers
                const formattedDays = String(days).padStart(2, '0');
                const formattedHours = String(hours).padStart(2, '0');
                const formattedMinutes = String(minutes).padStart(2, '0');
                const formattedSeconds = String(seconds).padStart(2, '0');
    
                setCountdown(`${formattedDays}d ${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`);
            } else {
                clearInterval(interval);
                setCountdown('00:00:00:00');
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [qualiTime]);

    return (
        <div className="time">
            <h3>Time Left:</h3>
            <h3>{countdown}</h3>
        </div>
    );
};