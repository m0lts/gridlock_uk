// Components
import { CloseIcon, StopwatchIcon } from '../Icons/Icons'
// Styles
import './boost-modals.styles.css'

export const QualiBoostModal = ({ setShowModal, showModal, setQualiBoost, user, nextEvent }) => {

    const handleQualiBoost = async () => {
        try {
            const payload = {
                prediction: [null, null, null, null, null, null, null, null, null, null],
                userEmail: user.email,
                userName: user.username,
                competition: nextEvent[0].competitionName,
                country: nextEvent[0].competitionCountry,
                competitionId: nextEvent[0].competitionId,
                submittedAt: new Date(),
                boost: 'Quali',
            }

            const response = await fetch('/api/predictions/handleAddUserPrediction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setQualiBoost(true);
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
                    <StopwatchIcon />
                    <h2>Qualifying Boost</h2>
                </div>
                <div className="modal-text">
                    <p>The qualifying boost allows you to submit your prediction after qualifying.</p>
                    <br />
                    <p>You can only use this boost once.</p>
                    <p>You can only select one boost per weekend.</p>
                </div>
                <div className="two-buttons">
                    <button className='btn white' onClick={() => setShowModal(!showModal)}>Cancel</button>
                    <button className='btn purple' onClick={() => {setShowModal(!showModal); setQualiBoost(true); handleQualiBoost()}}>Use Boost</button>
                </div>
            </div>
        </div>
    )
}