export const getEventDates = (events) => {
    const eventDates = [];

    events.forEach(event => {
        const date = new Date(event.date);
        let competition = event.type;

        if (competition === 'qualification') {
            competition = 'Qualifying';
        }

        // Format the date to the desired format
        const formattedDate = date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        // Push the desired result into the eventDates array
        eventDates.push({
            [competition]: formattedDate
        });
    });

    // Return the final array of event dates
    return eventDates;

}

export const getEventDatesOverview = (events) => {
    if (!events || events.length === 0) {
        return ''; // Return an empty string if there are no events
    }

    // Sort events based on date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    const startDate = new Date(events[0].date);
    const endDate = new Date(events[events.length - 1].date);

    // Format the start and end dates
    const formattedStartDate = startDate.toLocaleString('en-GB', {
        day: 'numeric',
    });

    const formattedEndDate = endDate.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return `${formattedStartDate}-${formattedEndDate}`;
}
