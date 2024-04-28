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
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    

    const handleGoBack = () => {
        window.history.back();
    }

    // Get user default prediction
    useEffect(() => {
        const fetchDefaultPrediction = async () => {
            setLoading(true);
            const response = await fetch('/api/predictions/handleFindUserPrediction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail: user.email, competitionId: 'Default' }),
            });

            if (response.status === 200) {
                const data = await response.json();
                setSelectedDrivers(data.dbPrediction.prediction);
                setAlreadySubmitted(true);
                setLoading(false);
            } else {
                setAlreadySubmitted(false);
                setLoading(false);
            }
        }
        
        if (!user) {
            navigate('/');
        } else {
            fetchDefaultPrediction();
        }
    }, [user])

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

        if (alreadySubmitted) {
            return;
        }

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
    const [showError, setShowError] = useState(false);

    const handleUserPrediction = async () => {
        setShowPredictionModal(true);
        setSubmittingPredictionMsg('Submitting...');

        if (selectedDrivers.includes(null)) {
            setShowError(true);
            setShowPredictionModal(false);
            return;
        }

        if (alreadySubmitted) {
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
                setShowPredictionModal(false);
                setAlreadySubmitted(true);
            } else {
                setShowPredictionModal(false);
            }
            
        } catch (error) {
            console.error(error);
        }
        
    }

    return (
        <section className="default-prediction">

            {/* Back button */}
            <div className="back-button" onClick={handleGoBack}>
                <LeftChevronIcon />
                Back
            </div>

            <h1>Default Prediction</h1>
            {alreadySubmitted ? (
                <p>Your default prediction is below. You cannot change your default prediction.</p>
            ) : (
                <p>You have not submitted a default prediction yet. This prediction will be used if you fail to submit a prediction for a race. Once submitted, you cannot change your default prediction.</p>
            )}

            <div className="predictor-grid">
                {loading ? (
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
            {!alreadySubmitted && !loading && (
                <div className="submit-prediction">
                    <button 
                        className="btn white" 
                        onClick={handleUserPrediction}
                    >
                        Submit Default Prediction
                    </button>
                    <p className='error-msg' style={{ display: showError ? 'block' : 'none' }}>You must select a driver for all positions.</p>
                </div>
            )}
        </section>
    )
}