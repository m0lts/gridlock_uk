import { useEffect, useState } from 'react';
import { GearIcon, LockIcon } from '../../../components/Icons/Icons';
import './predictor-grid.styles.css'
import { LoaderWhite } from '../../../components/Loader/Loader';

export const PredictorGrid = ({ driverData, userEmail, userName, nextEvent, qualiTime }) => {

    const [drivers, setDrivers] = useState([])

    useEffect(() => {
        const filterDriverData = (driverData) => {
            const oliBearmanId = 101;
            const filteredDrivers = driverData.filter(driver => driver.driverId !== oliBearmanId)
            setDrivers(filteredDrivers);
        }
         if (driverData.length > 0) {
            filterDriverData(driverData);
        }
    }, [driverData]);

    const getTeamColour = (team) => {
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

    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [selectedGridIndex, setSelectedGridIndex] = useState(null);
    const [selectedDrivers, setSelectedDrivers] = useState(Array(10).fill(null));
    const [showPredictionModal, setShowPredictionModal] = useState(false);
    const [submittingPredictionMsg, setSubmittingPredictionMsg] = useState('');
    const [fetchingPrediction, setFetchingPrediction] = useState(true);

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
            <h3 className='position'>P{index + 1}</h3>
            {selectedDrivers[index] ? (
                <div className='selected-grid-item' style={{ border: `1px solid ${getTeamColour(selectedDrivers[index].driverTeam)}`, borderLeft: `5px solid ${getTeamColour(selectedDrivers[index].driverTeam)}`  }}>
                    <h6>{selectedDrivers[index].driverNumber}</h6>
                    <div className="image">
                        <img src={selectedDrivers[index].driverImage} alt={selectedDrivers[index].driverLastName} />
                    </div>
                    <div className="name">
                        <p>{selectedDrivers[index].driverFirstName}</p>
                        <h3>{selectedDrivers[index].driverLastName}</h3>
                    </div>
                </div>
            ) : (
                <div className='selected-grid-item'>
                    <h6>--</h6>
                    <div className="name">
                        <p>Select</p>
                        <h3>Driver</h3>
                    </div>
                </div>
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
        } else {
            setDisableSubmitButton(true);
        }
    }, [selectedDrivers]);


    const handleUserPrediction = async () => {

        setSubmitButtonText('Submitting...');
        setShowPredictionModal(true);
        setSubmittingPredictionMsg('Submitting your prediction...');

        if (selectedDrivers.includes(null)) {
            setShowError(true);
            setSubmitButtonText('Lock it in');
            setShowPredictionModal(false);
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
                setSubmittingPredictionMsg('Prediction submitted! You can edit your prediction until qualifying starts.');
                setTimeout(() => {
                    setSubmitButtonText('Update prediction');
                    setShowPredictionModal(false);
                }, 2000);
            } else if (response.status === 401) {
                setSubmitButtonText('Predictions locked');
                setSubmittingPredictionMsg('Qualifying has started - predictions are locked.');
                setTimeout(() => {
                    setShowPredictionModal(false);
                }, 2000);
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
                setFetchingPrediction(true);
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
                        setFetchingPrediction(false);
                    } else {
                        setFetchingPrediction(false);
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

    // Prevent user from submitting prediction after qualifying has started
    useEffect(() => {
        if (qualiTime < Date.now()) {
            setDisableSubmitButton(true);
        }
    }, [qualiTime]);

    return (
        <section className={`predictor-grid ${fetchingPrediction && 'flex'}`}>
            {drivers.length === 0 || fetchingPrediction ? (
                <LoaderWhite />
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
                            style={{ border: `1px solid ${getTeamColour(driver.driverTeam)}`, borderLeft: `5px solid ${getTeamColour(driver.driverTeam)}`  }}
                            onClick={() => {handleDriverSelection(driver); setShowError(false)}}
                        >
                            <h6>{driver.driverNumber}</h6>
                            <div className="image">
                                <img src={driver.driverImage} alt={driver.driverLastName} />
                            </div>
                            <div className="name">
                                <p>{driver.driverFirstName}</p>
                                <h3>{driver.driverLastName}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {showPredictionModal && (
                <div className="prediction-modal">
                    <div className="modal-msg">
                        <LoaderWhite />
                        <h3>{submittingPredictionMsg}</h3>
                        <button className='btn white' onClick={() => setShowPredictionModal(false)}>Close</button>
                    </div>
                </div>
            )}
            {qualiTime > Date.now() && !fetchingPrediction ? (
                <div className="submit-prediction">
                        {/* <button className="btn btn-white">Use Previous Prediction</button> */}
                        <button 
                            className="btn white" 
                            style={{ opacity: disableSubmitButton ? '0.5' : '1' }}
                            onClick={handleUserPrediction}
                            disabled={disableSubmitButton}
                        >
                            {submitButtonText}
                        </button>
                        <p className='error-msg' style={{ display: showError ? 'block' : 'none' }}>You must select a driver for all positions.</p>
                </div>
            ) : qualiTime < Date.now() && !fetchingPrediction ? (
                <div className="predictor-grid-locked">
                    <div className="locked">
                        <LockIcon />
                        <p>Predictions are closed.</p>
                    </div>
                </div>
            ) : qualiTime === Date.now() && !fetchingPrediction ? (
                <div className="predictor-grid-locked">
                    <div className="locked">
                        <LockIcon />
                        <p>Predictions are closed.</p>
                    </div>
                </div>
            ) : null}
        </section>
    )
};