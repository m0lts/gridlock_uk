import { useState, useEffect } from 'react'
import './loader.styles.css'

export const LoaderBlack = () => {
    const [currentStage, setCurrentStage] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStage(prevStage => (prevStage % 15) + 1);
        }, 75); // Change the interval duration as needed

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-animation">
            {[...Array(15)].map((_, index) => (
                <img
                    key={index}
                    src={`/loading-images/black/${index + 1}.svg`}
                    alt=""
                    className={`${currentStage === (index + 1) && 'active'}`}
                    style={{ display: currentStage === (index + 1) ? 'block' : 'none' }}
                />
            ))}
        </div>
    );

}

export const LoaderWhite = () => {
    const [currentStage, setCurrentStage] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStage(prevStage => (prevStage % 15) + 1);
        }, 75); // Change the interval duration as needed

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-animation">
            {[...Array(15)].map((_, index) => (
                <img
                    key={index}
                    src={`/loading-images/white/${index + 1}.svg`}
                    alt=""
                    className={`${currentStage === (index + 1) && 'active'}`}
                    style={{ display: currentStage === (index + 1) ? 'block' : 'none' }}
                />
            ))}
        </div>
    );

}