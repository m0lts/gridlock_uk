// Dependencies
import { useState } from 'react';
// Components
import { CloseIcon, CopyIcon } from '../Icons/Icons'
import { LoaderWhite } from '../Loader/Loader';
// Styles
import './league-options.styles.css'

export const CreateLeagueModal = ({ setShowModal, showModal, userName }) => {

    const [creatingLeague, setCreatingLeague] = useState(false);
    const [createdLeague, setCreatedLeague] = useState(false);
    const [error, setError] = useState('');
    const [leagueName, setLeagueName] = useState('');
    const [leagueCode, setLeagueCode] = useState('');
    const [copied, setCopied] = useState(false);

    const handleCreateLeague = async (e) => {
        setCreatingLeague(true);
        setError('');
        setCopied(false);
        e.preventDefault();

        const leagueData = {
            leagueName: leagueName,
            leagueAdmin: userName,
            leagueMembers: [userName],
        }

        try {
            const response = await fetch('/api/leagues/handleCreateLeague', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leagueData),
            });

            if (response.status === 201) {
                const responseData = await response.json();
                setLeagueCode(responseData.leagueCode);
                setCreatingLeague(false);
                setCreatedLeague(true);
            } else if (response.status === 400) {
                setError('League name already taken.');
                setCreatingLeague(false);
                setCreatedLeague(false);
            }
        } catch (error) {
            console.error('Error creating league:', error);
            setError('Error creating league. Please try again.');
            setCreatingLeague(false);
            setCreatedLeague(false);
        }
    }


    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => setCopied(true))
            .catch((err) => console.error('Failed to copy:', err));
    };

    return (
        <div className="league-options-modal">

            {/* If processing league creation */}
            {creatingLeague ? (
                <div className="modal-content">
                    <LoaderWhite />
                    <h2>Creating League...</h2>
                </div>
            )
            
            // If league is created
            : createdLeague ? (
                <div className="modal-content">
                    <button className='close-modal-btn' onClick={() => {setShowModal(!showModal); window.location.reload()}}><CloseIcon /></button>
                    <div className="modal-header">
                        <h2>League Created!</h2>
                        <p>Invite your friends to join your league using the code below.</p>
                    </div>
                    <div className="modal-form">
                        <div className="input-cont">
                            <label htmlFor="league-code">Your League Code:</label>
                            <div className="input-flex">
                                <input type="text" value={leagueCode} readOnly />
                                <span onClick={() => copyToClipboard(leagueCode)}>
                                    <CopyIcon />
                                </span>
                            </div>
                        </div>
                        <button className='btn black' onClick={() => copyToClipboard(leagueCode)}>{copied ? 'Copied!' : 'Copy Code'}</button>
                    </div>
                </div>
            )
            
            // Default
            : (
                <div className="modal-content">
                    <button className='close-modal-btn' onClick={() => setShowModal(!showModal)}><CloseIcon /></button>
                    <div className="modal-header">
                        <h2>Create a League</h2>
                        <p>Create your own private league that you can invite your friends to.</p>
                    </div>
                    <form className="modal-form" onSubmit={handleCreateLeague}>
                        <div className="input-cont">
                            <label htmlFor="league-name">League Name</label>
                            <input type="text" id="league-name" name="league-name" onChange={(e) => setLeagueName(e.target.value)} style={{ border: error && '1px solid var(--red)'}} />
                        </div>
                        <button className='btn black'>Create League</button>
                        {error && <p className="error">*{error}</p>}
                    </form>
                </div>
            )}
        </div>
    )
}