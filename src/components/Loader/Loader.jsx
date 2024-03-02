import LoaderStage1 from '../../assets/loading-images/black/1.svg'
import LoaderStage2 from '../../assets/loading-images/black/2.svg'
import LoaderStage3 from '../../assets/loading-images/black/3.svg'
import LoaderStage4 from '../../assets/loading-images/black/4.svg'
import LoaderStage5 from '../../assets/loading-images/black/5.svg'
import LoaderStage6 from '../../assets/loading-images/black/6.svg'
import LoaderStage7 from '../../assets/loading-images/black/7.svg'
import LoaderStage8 from '../../assets/loading-images/black/8.svg'
import LoaderStage9 from '../../assets/loading-images/black/9.svg'
import LoaderStage10 from '../../assets/loading-images/black/10.svg'
import LoaderStage11 from '../../assets/loading-images/black/11.svg'
import LoaderStage12 from '../../assets/loading-images/black/12.svg'
import LoaderStage13 from '../../assets/loading-images/black/13.svg'
import LoaderStage14 from '../../assets/loading-images/black/14.svg'
import LoaderStage15 from '../../assets/loading-images/black/15.svg'
import LoaderStageWhite1 from '../../assets/loading-images/white/1.svg'
import LoaderStageWhite2 from '../../assets/loading-images/white/2.svg'
import LoaderStageWhite3 from '../../assets/loading-images/white/3.svg'
import LoaderStageWhite4 from '../../assets/loading-images/white/4.svg'
import LoaderStageWhite5 from '../../assets/loading-images/white/5.svg'
import LoaderStageWhite6 from '../../assets/loading-images/white/6.svg'
import LoaderStageWhite7 from '../../assets/loading-images/white/7.svg'
import LoaderStageWhite8 from '../../assets/loading-images/white/8.svg'
import LoaderStageWhite9 from '../../assets/loading-images/white/9.svg'
import LoaderStageWhite10 from '../../assets/loading-images/white/10.svg'
import LoaderStageWhite11 from '../../assets/loading-images/white/11.svg'
import LoaderStageWhite12 from '../../assets/loading-images/white/12.svg'
import LoaderStageWhite13 from '../../assets/loading-images/white/13.svg'
import LoaderStageWhite14 from '../../assets/loading-images/white/14.svg'
import LoaderStageWhite15 from '../../assets/loading-images/white/15.svg'
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
                    src={eval(`LoaderStage${index + 1}`)}
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
                    src={eval(`LoaderStageWhite${index + 1}`)}
                    alt=""
                    className={`${currentStage === (index + 1) && 'active'}`}
                    style={{ display: currentStage === (index + 1) ? 'block' : 'none' }}
                />
            ))}
        </div>
    );

}