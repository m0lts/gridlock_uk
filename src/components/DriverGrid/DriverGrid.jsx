import './driver-grid.styles.css'

export const DriverGrid = ({ numberOfDrivers }) => {

    const drivers = [
        {
            firstName: 'Max',
            lastName: 'Verstappen',
            team: 'Red Bull',
            number: 1
        },
        {
            firstName: 'Sergio',
            lastName: 'Perez',
            team: 'Red Bull',
            number: 11
        },
        {
            firstName: 'Lewis',
            lastName: 'Hamilton',
            team: 'Mercedes',
            number: 44
        },
        {
            firstName: 'Valtteri',
            lastName: 'Bottas',
            team: 'Mercedes',
            number: 77
        },
        {
            firstName: 'Lando',
            lastName: 'Norris',
            team: 'McLaren',
            number: 4
        },
        {
            firstName: 'Daniel',
            lastName: 'Ricciardo',
            team: 'McLaren',
            number: 3
        },
        {
            firstName: 'Charles',
            lastName: 'Leclerc',
            team: 'Ferrari',
            number: 16
        },
        {
            firstName: 'Carlos',
            lastName: 'Sainz',
            team: 'Ferrari',
            number: 55
        },
        {
            firstName: 'Pierre',
            lastName: 'Gasly',
            team: 'AlphaTauri',
            number: 10
        },
        {
            firstName: 'Yuki',
            lastName: 'Tsunoda',
            team: 'AlphaTauri',
            number: 22
        },
        {
            firstName: 'Sebastian',
            lastName: 'Vettel',
            team: 'Aston Martin',
            number: 5
        },
        {
            firstName: 'Lance',
            lastName: 'Stroll',
            team: 'Aston Martin',
            number: 18
        },
        {
            firstName: 'Fernando',
            lastName: 'Alonso',
            team: 'Alpine',
            number: 14
        },
        {
            firstName: 'Esteban',
            lastName: 'Ocon',
            team: 'Alpine',
            number: 31
        },
        {
            firstName: 'George',
            lastName: 'Russell',
            team: 'Williams',
            number: 63
        },
        {
            firstName: 'Nicholas',
            lastName: 'Latifi',
            team: 'Williams',
            number: 6
        },
        {
            firstName: 'Kimi',
            lastName: 'Räikkönen',
            team: 'Sauber',
            number: 7
        },
        {
            firstName: 'Antonio',
            lastName: 'Giovinazzi',
            team: 'Sauber',
            number: 99
        },
        {
            firstName: 'Mick',
            lastName: 'Schumacher',
            team: 'Haas',
            number: 47
        },
        {
            firstName: 'Nikita',
            lastName: 'Mazepin',
            team: 'Haas',
            number: 9
        }
    ]

    const getTeamColour = (team) => {
        switch (team) {
            case 'Red Bull':
                return '#0600EF';
                break;
            case 'Mercedes':
                return '#00D2BE';
                break;
            case 'McLaren':
                return '#FF8700';
                break;
            case 'Ferrari':
                return '#DC0000';
                break;
            case 'AlphaTauri':
                return '#2B4562';
                break;
            case 'Aston Martin':
                return '#006F62';
                break;
            case 'Alpine':
                return '#0090FF';
                break;
            case 'Williams':
                return '#005AFF';
                break;
            case 'Sauber':
                return '#900000';
                break;
            case 'Haas':
                return '#FFFFFF';
                break;
            default:
                return 'white';
                break;
        }
    }


    return (
        <section className="driver-grid">
            {drivers.slice(0, numberOfDrivers).map((driver, index) => {
                return (
                    <div className="driver" key={index} >
                        <h1 style={{ color: `${getTeamColour(driver.team)}`}}>{driver.number}</h1>
                        <div className="name">
                            <p>{driver.firstName}</p>
                            <h4>{driver.lastName}</h4>
                        </div>
                    </div>
                )
            })}
        </section>
    )

}