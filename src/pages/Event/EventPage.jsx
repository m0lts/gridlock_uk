import { useLocation } from "react-router-dom"
import { NextEventCalendar } from "../../components/NextEventBox/NextEventCalendar";

export const EventPage = () => {

    const location = useLocation();
    const inheritedState = location.state;

    return (
        <section className="calendar">
            <NextEventCalendar
                nextEvent={[inheritedState.event]}
                roundNumber={inheritedState.round}
            />
        </section>
    )
}