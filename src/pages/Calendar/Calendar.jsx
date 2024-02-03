import { useState } from 'react';
import { PrimaryHeading, UpperCaseTitle } from '../../components/Typography/Titles/Titles'
import './calendar.styles.css'

export const Calendar = ({ seasonData }) => {

    const [expandedItem, setExpandedItem] = useState(null);

    const handleGridItemClick = (index) => {
        setExpandedItem((prevExpandedItem) => (prevExpandedItem === index ? null : index));
    };

    const gridItems = seasonData.map((event, index) => (
        <div 
            key={index} 
            className={`grid-item ${expandedItem === index ? 'expanded' : ''}`}
            onClick={() => handleGridItemClick(index)}
        >
            {expandedItem === index ? (
                <>
                    <h3>Round {index + 1}</h3>
                    <div className="location">
                        <img src="https://via.placeholder.com/150" alt="placeholder" />
                        <UpperCaseTitle
                            title={event.competitionCountry}
                            colour="white"
                        />
                    </div>
                    <div className="track">
                        <img src={event.competitionCircuit} alt="placeholder" />
                    </div>
                    <div className="program">
                        <div className="sessions">
                            <p className="session">Practice 1:</p>
                            <p className="session">Practice 2:</p>
                            <p className="session">Practice 3:</p>
                            <p className="session">Qualifying:</p>
                            <p className="session">Race:</p>
                        </div>
                        <div className="times">
                            <p className="time">19/05/2024 10:00 (GMT)</p>
                            <p className="time">19/05/2024 14:00 (GMT)</p>
                            <p className="time">19/05/2024 11:00 (GMT)</p>
                            <p className="time">19/05/2024 14:00 (GMT)</p>
                            <p className="time">19/05/2024 14:00 (GMT)</p>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <UpperCaseTitle
                        title={index + 1}
                        colour="white"
                    />
                    <img src="https://via.placeholder.com/150" alt="placeholder" />
                    <UpperCaseTitle
                        title={event.competitionCountry}
                        colour="white"
                    />
                </>
            )}
        </div>
    ));

    return (
        <section className="calendar bckgrd-black page-padding">
            <PrimaryHeading
                title="Calendar"
                textColour="black"
                accentColour="green"
                backgroundColour="white"
            />
            <div className="grid">
                {gridItems}
            </div>
        </section>
    )
}