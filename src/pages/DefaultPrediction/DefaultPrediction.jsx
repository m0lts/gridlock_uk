import { useEffect, useState } from 'react';
import { LeftChevronIcon } from '../../components/Icons/Icons';
import './default-prediction.styles.css'
import { useNavigate } from 'react-router-dom';
import { LoaderWhite } from '../../components/Loader/Loader';
import { getTeamColour } from '../../utils/getTeamColour';

export const DefaultPrediction = ({ user, driverData }) => {

    const navigate = useNavigate();
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [selectedGridIndex, setSelectedGridIndex] = useState(null);
    const [selectedDrivers, setSelectedDrivers] = useState(Array(10).fill(null));        

    const handleGoBack = () => {
        window.history.back();
    }

    // Prediction logic
    // Filter out any drivers from the driverData array
    const [drivers, setDrivers] = useState([])

    useEffect(() => {
        const filterDriverData = () => {
            const oliBearmanId = 101;
            const filteredDrivers = driverData.filter(driver => driver.driverId !== oliBearmanId)
            setDrivers(filteredDrivers);
        }
        if (driverData.length > 0) {
            filterDriverData();
        }
    }, [driverData]);
    
    const handleGridItemClick = (index) => {
        if (selectedDrivers[index]) {
            setDrivers(prevDrivers => [...prevDrivers, selectedDrivers[index]]);
            setSelectedDrivers(prevSelectedDrivers => {
                const updatedSelectedDrivers = [...prevSelectedDrivers];
                updatedSelectedDrivers[index] = null;
                return updatedSelectedDrivers;
            });
        } else {
            setSelectedGridIndex(index);
            setShowSelectionModal(true);
        }
    }
    
    const handleDriverSelection = (selectedDriver) => {
        const updatedDrivers = drivers.filter(driver => driver !== selectedDriver);
        setDrivers(updatedDrivers);
        setSelectedDrivers(prevSelectedDrivers => {
            const updatedSelectedDrivers = [...prevSelectedDrivers];
            updatedSelectedDrivers[selectedGridIndex] = selectedDriver;
            return updatedSelectedDrivers;
        });
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
    const [showPredictionModal, setShowPredictionModal] = useState(false);
    const [submittingPredictionMsg, setSubmittingPredictionMsg] = useState('Submitting...');
    const [updateDriversArray, setUpdateDriversArray] = useState(false);
    const [fetchingPrediction, setFetchingPrediction] = useState(true);
    const [showError, setShowError] = useState(false);
    const [disableSubmitButton, setDisableSubmitButton] = useState(true);
    const [submitButtonText, setSubmitButtonText] = useState('Lock it in');
    
    useEffect(() => {
        if (!selectedDrivers.includes(null)) {
            setDisableSubmitButton(false);
        }
    }, [selectedDrivers]);

    // NEW

    const handleUserPrediction = async () => {

        setSubmitButtonText('Submitting...');
        setShowPredictionModal(true);
        setSubmittingPredictionMsg('Submitting...');

        if (selectedDrivers.includes(null)) {
            setShowError(true);
            setSubmitButtonText('Lock it in');
            setShowPredictionModal(false);
            return;
        }

        try {
            const payload = {
                prediction: selectedDrivers,
                userEmail: user.email,
                userName: user.username,
                competition: 'Default',
                country: 'Default',
                competitionId: 'Default',
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
                setSubmitButtonText('Update prediction');
                setShowPredictionModal(false);
            } else {
                setShowPredictionModal(false);
            }
            
        } catch (error) {
            console.error(error);
            setShowPredictionModal(false);
        }
        
    }

    useEffect(() => {
        const fetchPrediction = async () => {
            try {
                const payload = {
                    userEmail: user.email,
                    competitionId: 'Default',
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
                    if (dbPrediction) {
                        setSelectedDrivers(dbPrediction.prediction);
                        setUpdateDriversArray(true);
                        setSubmitButtonText('Update prediction');
                    }
                    setFetchingPrediction(false);
                } else {
                    setFetchingPrediction(false);
                }
            } catch (error) {
                console.error('Error fetching prediction:', error);
                setFetchingPrediction(false);
            }
        }   

        if (!user) {
            navigate('/');
        } else {
            fetchPrediction();
            setFetchingPrediction(true);
        }

    }, [user])

    useEffect(() => {
        const updateDriversArrayWithDbPrediction = () => {
            const updatedDrivers = drivers.filter(driver => {
                return !selectedDrivers.some(selectedDriver => selectedDriver && selectedDriver.driverId === driver.driverId);
            });
            setDrivers(updatedDrivers);
        }
        if (drivers.length > 0 && updateDriversArray) {
            updateDriversArrayWithDbPrediction();
        }
    }, [updateDriversArray])

    return (
        <section className="default-prediction">

            {/* Back button */}
            <div className="back-button" onClick={handleGoBack}>
                <LeftChevronIcon />
                Back
            </div>

            <h1>Default Prediction</h1>
            <p>This prediction will be used if you fail to submit a prediction for a race.</p>
            

            <div className="predictor-grid">
                {fetchingPrediction ? (
                    <LoaderWhite />
                ) : (
                    <>
                        {gridItems}
                    </>
                )}
            </div>

            {/* Overlay when user clicks a predictor slot */}
            {showSelectionModal && (
                <div className="selection-modal">
                    {drivers.map((driver, index) => (
                        <div
                            key={index}
                            className="driver"
                            style={{ border: `1px solid ${getTeamColour(driver.driverTeam)}`, borderLeft: `5px solid ${getTeamColour(driver.driverTeam)}`  }}
                            onClick={() => {handleDriverSelection(driver)}}
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


            {/* Show when user submits prediction */}
            {showPredictionModal && (
                <div className="prediction-modal">
                    <div className="modal-msg">
                        <LoaderWhite />
                        <h3>{submittingPredictionMsg}</h3>
                        <button className='btn white' onClick={() => setShowPredictionModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* Submit button */}
            {!fetchingPrediction && (
                <div className="submit-prediction">
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
            )}
        </section>
    )
}


