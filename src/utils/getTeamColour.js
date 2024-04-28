export const getTeamColour = (team) => {
    switch (team) {
        case 'Red Bull Racing':
            return '#3671C6';
            break;
        case 'Mercedes-AMG Petronas':
            return '#29F4D2';
            break;
        case 'McLaren Racing':
            return '#FF8001';
            break;
        case 'Scuderia Ferrari':
            return '#E8022D';
            break;
        case 'Scuderia Ferrari ':
            return '#E8022D';
            break;
        case 'Scuderia Ferrari\n':
            return '#E8022D';
            break;
        case 'Visa Cash App RB Formula One Team':
            return '#6592FF';
            break;
        case 'Scuderia AlphaTauri Honda':
            return '#6592FF';
            break;
        case 'Aston Martin F1 Team':
            return '#239971';
            break;
        case 'Alpine F1 Team':
            return '#FF87BC';
            break;
        case 'Williams F1 Team':
            return '#63C4FF';
            break;
        case 'Stake F1 Team Kick Sauber':
            return '#52E252';
            break;
        case 'Sauber F1 Team':
            return '#52E252';
            break;
        case 'Alfa Romeo':
            return '#52E252';
            break;
        case 'Haas F1 Team':
            return '#B6BABD';
            break;
        default:
            return '#FFFFFF';
            break;
    }
}