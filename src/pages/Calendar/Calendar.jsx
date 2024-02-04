import { useState } from 'react';
import { PrimaryHeading, UpperCaseTitle } from '../../components/Typography/Titles/Titles'
import './calendar.styles.css'
import { getCountryFlag } from '../../utils/getCountryFlag';
import { getEventDates } from '../../utils/getEventDates';

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
                        <img src={getCountryFlag(event.competitionCountry)} alt={`${event.competitionCountry} Flag`} />
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
                            {getEventDates(event.events).map((event, index) => (
                                <p key={index} className="session">
                                    {Object.keys(event)[0]}:
                                </p>
                            ))}
                        </div>
                        <div className="times">
                            {getEventDates(event.events).map((event, index) => (
                                <p key={index} className="time">
                                    {Object.values(event)[0]}
                                </p>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <UpperCaseTitle
                        title={index + 1}
                        colour="white"
                    />
                    <img src={getCountryFlag(event.competitionCountry)} alt="placeholder" />
                    <h3>{event.competitionCountry}</h3>
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