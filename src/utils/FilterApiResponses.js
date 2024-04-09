export const filterEventResponse = (response) => {
        const groupedCompetitions = [];

        response.forEach(event => {

            if (event.type === '2nd Qualifying' || event.type === '3rd Qualifying' || event.type === '2nd Sprint Shootout' || event.type === '3rd Sprint Shootout') {
                return;
            } else if (event.type === '1st Qualifying') {
                event.type = 'Qualifying';
            } else if (event.type === '1st Sprint Shootout') {
                event.type = 'Sprint Shootout';
            }

            

            const competitionId = event.competition.id;
            const existingCompetition = groupedCompetitions.find(comp => comp.competitionId === competitionId);
            if (existingCompetition) {
                existingCompetition.events.push(event);
            } else {
                groupedCompetitions.push({
                    status: event.status,
                    competitionId,
                    competitionName: event.competition.name,
                    competitionCountry: event.competition.location.country,
                    competitionCircuit: event.circuit.image,
                    competitionCircuitName: event.circuit.name,
                    events: [event],
                });
            }
        });

        return groupedCompetitions;
}

export const filterDriverResponse = (response) => {
    const filteredDrivers = [];

    // Drivers to remove from the list
    const oliBearmanId = 101;

    response.forEach(driver => {
        const spaceIndex = driver.driver.name.indexOf(' ');
        const firstName = driver.driver.name.substring(0, spaceIndex);
        const lastName = driver.driver.name.substring(spaceIndex + 1);
        const driverAbbr = lastName.substring(0, 3).toUpperCase();
        
        const driverAbbrToUse = driver.driver.abbr === null ? driverAbbr : driver.driver.abbr;

        
        // if (!(driver.driver.id === oliBearmanId)) {
            filteredDrivers.push({
                driverId: driver.driver.id,
                driverFirstName: firstName,
                driverLastName: lastName,
                driverAbbr: driverAbbrToUse,
                driverTeam: driver.team.name,
                driverTeamBadge: driver.team.logo,
                driverNumber: driver.driver.number,
                driverImage: driver.driver.image,
            });
        // }
    });
    
    return filteredDrivers;
}
