// Dependencies
import { useLocation } from "react-router-dom"
// Components
import { NextEventCalendar } from "../../components/NextEventBox/NextEventCalendar";
import { LeftChevronIcon } from "../../components/Icons/Icons";

export const EventPage = () => {

    const location = useLocation();
    const inheritedState = location.state;

    const handleGoBack = () => {
        window.history.back();
    }

    console.log(inheritedState)
    return (
        <section className="calendar">
            <div className="back-button" onClick={handleGoBack}>
                <LeftChevronIcon />
                Back
            </div>
            <div className="next-event">
                <NextEventCalendar
                    nextEvent={[inheritedState.event]}
                    roundNumber={inheritedState.round}
                />
            </div>
        </section>
    )
}