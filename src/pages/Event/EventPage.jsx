import { Link, useLocation } from "react-router-dom"
import { NextEventCalendar } from "../../components/NextEventBox/NextEventCalendar";
import { LeftChevronIcon } from "../../components/Icons/Icons";

export const EventPage = () => {

    const location = useLocation();
    const inheritedState = location.state;

    const handleGoBack = () => {
        window.history.back();
    }

    return (
        <section className="calendar">
            <div className="back-button" onClick={handleGoBack}>
                <LeftChevronIcon />
                Back
            </div>
            <NextEventCalendar
                nextEvent={[inheritedState.event]}
                roundNumber={inheritedState.round}
            />
        </section>
    )
}