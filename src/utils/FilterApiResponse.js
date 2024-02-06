export const filterApiResponse = (response) => {
        const groupedCompetitions = [];

        response.forEach(event => {
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
