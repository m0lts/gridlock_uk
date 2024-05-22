// Components
import { CloseIcon, RocketIcon } from '../Icons/Icons'
// Styles
import './boost-modals.styles.css'

export const GridBoostModal = ({ setShowModal, showModal, setGridBoost, user, nextEvent  }) => {

    const handleGridBoost = async () => {
        try {
            const payload = {
                prediction: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
                userEmail: user.email,
                userName: user.username,
                competition: nextEvent[0].competitionName,
                country: nextEvent[0].competitionCountry,
                competitionId: nextEvent[0].competitionId,
                submittedAt: new Date(),
                boost: 'Grid',
            }

            const response = await fetch('/api/predictions/handleAddUserPrediction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setGridBoost(true);
            } else {
                console.error('Failed to add prediction');
            }
                
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="boost-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <RocketIcon />
                    <h2>Grid Boost</h2>
                </div>
                <div className="modal-text">
                    <p>The grid boost allows you to submit a prediction of all 20 grid places.</p>
                    <br />
                    <p>You can only use this once.</p>
                    <p>You can only select one boost per weekend.</p>
                </div>
                <div className="two-buttons">
                    <button className='btn white' onClick={() => setShowModal(!showModal)}>Cancel</button>
                    <button className='btn purple' onClick={() => {setShowModal(!showModal); setGridBoost(true); handleGridBoost()}}>Use Boost</button>
                </div>
            </div>
        </div>
    )
}