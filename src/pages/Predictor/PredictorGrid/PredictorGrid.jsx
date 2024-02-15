import { useEffect, useState } from 'react';
import { GearIcon, LockIcon } from '../../../components/Icons/Icons';
import './predictor-grid.styles.css'
import { Loader } from '../../../components/Loader/Loader';

export const PredictorGrid = ({ driverData, userEmail, userName, nextEvent, qualiTime }) => {

    const [drivers, setDrivers] = useState([])

    useEffect(() => {
        setDrivers(driverData);
    }, [driverData]);

    const getTeamColour = (team) => {
        switch (team) {
            case 'Red Bull Racing':
                return '#0600EF';
                break;
            case 'Mercedes-AMG Petronas':
                return '#00D2BE';
                break;
            case 'McLaren Racing':
                return '#FF8700';
                break;
            case 'Scuderia Ferrari':
                return '#DC0000';
                break;
            case 'Scuderia AlphaTauri Honda':
                return '#1130F5';
                break;
            case 'Aston Martin F1 Team':
                return '#006F62';
                break;
            case 'Alpine F1 Team':
                return '#F54EF2';
                break;
            case 'Williams F1 Team':
                return '#005AFF';
                break;
            case 'Alfa Romeo':
                return '#08ff08';
                break;
            case 'Haas F1 Team':
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
                    <h1 style={{ color: `${getTeamColour(selectedDrivers[index].driverTeam)}` }}>{selectedDrivers[index].driverNumber}</h1>
                    <div className="name">
                        <p>{selectedDrivers[index].driverFirstName}</p>
                        <h4>{selectedDrivers[index].driverLastName}</h4>
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

    
    // Send user prediction to database and handle errors
    const [showError, setShowError] = useState(false);
    const [disableSubmitButton, setDisableSubmitButton] = useState(true);
    const [submitButtonText, setSubmitButtonText] = useState('Lock it in');

    useEffect(() => {
        if (!selectedDrivers.includes(null)) {
            setDisableSubmitButton(false);
        }
    }, [selectedDrivers]);


    const handleUserPrediction = async () => {

        setSubmitButtonText('Submitting...');

        if (selectedDrivers.includes(null)) {
            setShowError(true);
            setSubmitButtonText('Lock it in');
            return;
        }

        try {
            const payload = {
                prediction: selectedDrivers,
                userEmail,
                userName,
                competition: nextEvent[0].competitionName,
                country: nextEvent[0].competitionCountry,
                competitionId: nextEvent[0].competitionId,
                qualiTime: new Date(qualiTime),
                submittedAt: new Date(),
            }

            const response = await fetch('/api/predictions/handleAddUserPrediction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.status === 200 || response.status === 201) {
                setSubmitButtonText('Prediction submitted!');
                setTimeout(() => {
                    setSubmitButtonText('Update prediction');
                }, 2000);
            } else if (response.status === 401) {
                setSubmitButtonText('Predictions locked');
            }
            
        } catch (error) {
            console.error(error);
        }
        
    }

    const [updateDriversArray, setUpdateDriversArray] = useState(false);

    // Fetch user prediction from database
    useEffect(() => {
        const fetchPrediction = async () => {
            if (nextEvent.length > 0) {
                try {
                    const payload = {
                        userEmail,
                        competitionId: nextEvent[0].competitionId,
                    };
                    const response = await fetch('/api/predictions/handleFindUserPrediction', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    });
                    if (response.status === 200) {
                        const responseData = await response.json();
                        const dbPrediction = responseData.dbPrediction;
                        setSelectedDrivers(dbPrediction.prediction);
                        setUpdateDriversArray(true);
                        setSubmitButtonText('Update prediction');
                    }
                } catch (error) {
                console.error('Error submitting form:', error);
                }
                }   
            }   
        if (nextEvent.length > 0) {
            fetchPrediction();
        }
    }, [nextEvent])

    // Remove drivers already selected from the 'drivers' array
    useEffect(() => {
        const updateDriversArrayWithDbPrediction = () => {
            if (updateDriversArray) {
                const updatedDrivers = drivers.filter(driver => {
                    return !selectedDrivers.some(selectedDriver => selectedDriver.driverId === driver.driverId);
                });
                setDrivers(updatedDrivers);
            }
        }
        if (drivers.length > 0 && updateDriversArray) {
            updateDriversArrayWithDbPrediction();
        }
    }, [updateDriversArray])

    return (
                <section className="predictor-grid">
                    {drivers.length === 0 ? (
                        <p className="loading-text white">Loading...</p>   
                    ) : (
                        <>
                            {gridItems}
                        </>
                    )}
                    {showSelectionModal && (
                        <div className="selection-modal">
                            {drivers.map((driver, index) => (
                                <div
                                    key={index}
                                    className="driver"
                                    style={{ border: `1px solid ${getTeamColour(driver.driverTeam)}`, boxShadow: `1px 1px 3px ${getTeamColour(driver.driverTeam)}` }}
                                    onClick={() => {handleDriverSelection(driver); setShowError(false)}}
                                >
                                    <h1>{driver.driverNumber}</h1>
                                    <div className="name">
                                        <p>{driver.driverFirstName}</p>
                                        <h4>{driver.driverLastName}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {qualiTime > Date.now() ? (
                        <div className="submit-prediction">
                                {/* <button className="btn btn-white">Use Previous Prediction</button> */}
                                <button 
                                    className="btn btn-purple" 
                                    style={{ opacity: disableSubmitButton ? '0.5' : '1' }}
                                    onClick={handleUserPrediction}
                                    disabled={disableSubmitButton}
                                >
                                    {submitButtonText}
                                </button>
                                <p className='error-msg' style={{ display: showError ? 'block' : 'none' }}>You must select a driver for all positions.</p>
                        </div>
                    ) : (
                        <div className="predictor-grid-locked">
                            <div className="locked">
                                <LockIcon />
                                <p>Predictor is locked - qualifying has started. An automatic random prediction has been submitted for you.</p>
                            </div>
                        </div>
                    )}
                </section>
    )
};