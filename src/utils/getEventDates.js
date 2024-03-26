export const getEventDates = (events) => {
    const eventDates = [];

    events.forEach(event => {
        const date = new Date(event.date);
        let competition = event.type;
        const timeZone = event.timezone;

        if (competition === 'qualification') {
            competition = 'Qualifying';
        }

        const formattedDate = date.toLocaleString('en-GB', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timeZone,
            timeZoneName: 'short'
        });

        

        // Push the desired result into the eventDates array
        eventDates.push({
            [competition]: formattedDate,
            originalDate: date,
        });
    });

    // Sort the eventDates array based on the original dates
    eventDates.sort((a, b) => b.originalDate - a.originalDate);

    // Remove the originalDate property from each object
    eventDates.forEach(date => delete date.originalDate);


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
        month: 'long',
    });

    return `${formattedStartDate}-${formattedEndDate}`;
}

export const getCompetitionDate = (competition) => {
    const date = new Date(competition.date);

    return date.toLocaleString('en-GB', {
        day: '2-digit',
    });
}

export const getCompetitionMonth = (competition) => {
    const date = new Date(competition.date);

    return date.toLocaleString('en-GB', {
        month: 'short',
    });
}

export const getCompetitionTime = (competition) => {
    const date = new Date(competition.date);
    const timeZone = competition.timezone;

    if (competition.type === 'Race' || competition.type === 'Sprint') {
        return date.toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timeZone,
            timeZoneName: 'short'
        });
    } else if (competition.type === 'Sprint Shootout') {
        const startTime = date.toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timeZone,
            timeZoneName: 'short'
        });
        const finishTime = new Date(date);
        finishTime.setHours(finishTime.getMinutes() + 44);

        return `${startTime} - ${finishTime.toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timeZone,
            timeZoneName: 'short'
        })}`;
    } else {
        const startTime = date.toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timeZone,
            timeZoneName: 'short'
        });
        const finishTime = new Date(date);
        finishTime.setHours(finishTime.getHours() + 1);

        return `${startTime} - ${finishTime.toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timeZone,
            timeZoneName: 'short'
        })}`;
    }
}
