import { useState } from 'react';
import { GearIcon } from '../../../components/Icons/Icons';
import './predictor-grid.styles.css'

export const PredictorGrid = () => {

    

    const [drivers, setDrivers] = useState([
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
    ])

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

    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [selectedGridIndex, setSelectedGridIndex] = useState(null);
    const [selectedDrivers, setSelectedDrivers] = useState(Array(10).fill(null));

    const handleGridItemClick = (index) => {
        if (selectedDrivers[index]) {
            // If a selected grid item is clicked, put the driver back in the drivers array
            setDrivers(prevDrivers => [...prevDrivers, selectedDrivers[index]]);
            
            // Reset the selected driver to null
            setSelectedDrivers(prevSelectedDrivers => {
                const updatedSelectedDrivers = [...prevSelectedDrivers];
                updatedSelectedDrivers[index] = null;
                return updatedSelectedDrivers;
            });
        } else {
            // Otherwise, show the selection modal
            setSelectedGridIndex(index);
            setShowSelectionModal(true);
        }
    }

    const handleDriverSelection = (selectedDriver) => {
        // Remove the selected driver from the drivers array
        const updatedDrivers = drivers.filter(driver => driver !== selectedDriver);
        setDrivers(updatedDrivers);

        // Update the selectedDrivers array for the relevant grid place
        setSelectedDrivers(prevSelectedDrivers => {
            const updatedSelectedDrivers = [...prevSelectedDrivers];
            updatedSelectedDrivers[selectedGridIndex] = selectedDriver;
            return updatedSelectedDrivers;
        });

        // Close the selection modal and reset the selectedGridIndex
        setShowSelectionModal(false);
        setSelectedGridIndex(null);
    }

    const gridItems = Array.from({ length: 10 }, (_, index) => (
        <div key={index} className="grid-item" onClick={() => handleGridItemClick(index)}>
            {selectedDrivers[index] ? (
                <div className='selected-grid-item'>
                    <h1 style={{ color: `${getTeamColour(selectedDrivers[index].team)}` }}>{selectedDrivers[index].number}</h1>
                    <div className="name">
                        <p>{selectedDrivers[index].firstName}</p>
                        <h4>{selectedDrivers[index].lastName}</h4>
                    </div>
                </div>
            ) : (
                <>
                    <div className="name">
                        <p>Select</p>
                        <h4>P{index + 1}</h4>
                    </div>
                </>
            )}
        </div>
    ));

    return (
        <section className="predictor-grid">
            {gridItems}
            {showSelectionModal && (
                <div className="selection-modal">
                    {drivers.map((driver, index) => (
                        <div
                            key={index}
                            className="driver"
                            style={{ border: `1px solid ${getTeamColour(driver.team)}`, boxShadow: `1px 1px 3px ${getTeamColour(driver.team)}` }}
                            onClick={() => handleDriverSelection(driver)}
                        >
                            <h1>{driver.number}</h1>
                            <div className="name">
                                <p>{driver.firstName}</p>
                                <h4>{driver.lastName}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};