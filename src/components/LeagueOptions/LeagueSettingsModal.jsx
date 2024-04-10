// Dependencies
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
// Components
import { CloseIcon } from '../Icons/Icons'
// Styles
import './league-options.styles.css'

export const LeagueSettingsModal = ({ setShowModal, showModal, leagueCode, leagueName }) => {

    const [showBufferModal, setShowBufferModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const navigate = useNavigate();

    const handleDeleteLeague = async (leagueToDelete) => {
        const response = await fetch('/api/leagues/handleDeleteLeague', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ leagueName: leagueToDelete }),
        });

        if (response.status === 201) {
            navigate('/standings')
        } else {
            console.error('Error deleting league.');
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => setCopied(true))
            .catch((err) => console.error('Failed to copy:', err));
    };

    return (
        <div className="league-options-modal">
            <div className="modal-content">
                <button className='close-modal-btn' onClick={() => setShowModal(!showModal)}><CloseIcon /></button>
                <div className="modal-header">
                    <h2>Private League Settings</h2>
                    <div className="modal-section">
                        <h3>League Code:</h3>
                        <p>{leagueCode}</p>
                        <button className="btn white" onClick={() => copyToClipboard(leagueCode)}>{copied ? 'Copied!' : 'Copy code'}</button>
                    </div>
                    <div className="modal-section">
                        <button className='btn red' onClick={() => setShowBufferModal(true)}>Delete league</button>
                    </div>
                </div>
            </div>
            {showBufferModal && (
                <div className="buffer-modal">
                    <div className="buffer-modal-content">
                        <h2>Are you sure you want to delete this league?</h2>
                        <div className="two-buttons">
                            <button className="btn white" onClick={() => setShowBufferModal(false)}>No</button>
                            <button className="btn red" onClick={() => handleDeleteLeague(leagueName)}>Yes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )


}