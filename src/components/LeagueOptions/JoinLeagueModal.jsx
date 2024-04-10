// Dependencies
import { useState } from 'react';
// Components
import { CloseIcon } from '../Icons/Icons'
import { LoaderWhite } from '../Loader/Loader';
// Styles
import './league-options.styles.css'

export const JoinLeagueModal = ({ setShowModal, showModal, userName }) => {

    const [joiningLeague, setJoiningLeague] = useState(false);
    const [error, setError] = useState('');
    const [leagueCode, setLeagueCode] = useState('');

    const handleJoinLeague = async (e) => {
        setJoiningLeague(true);
        e.preventDefault();

        const leagueData = {
            leagueCode: leagueCode,
            user: userName,
        }

        try {
            const response = await fetch('/api/leagues/handleJoinLeague', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leagueData),
            });

            if (response.status === 201) {
                setJoiningLeague(false);
                window.location.reload();
            } else if (response.status === 400) {
                setError('League details incorrect.');
                setJoiningLeague(false);
            } else if (response.status === 401) {
                setError('You have already joined this league.');
                setJoiningLeague(false);
            } else {
                setError('Error joining league. Please try again.');
                setJoiningLeague(false);
            }
        } catch (error) {
            console.error('Error joining league:', error);
            setJoiningLeague(false);
            setError('Error joining league. Please try again.');
        }
    }

    return (
        <div className="league-options-modal">
            {joiningLeague ? (
                <div className="modal-content">
                    <LoaderWhite />
                    <h2>Joining League...</h2>
                </div>
            ) : (
                <div className="modal-content">
                    <button className='close-modal-btn' onClick={() => setShowModal(!showModal)}><CloseIcon /></button>
                    <div className="modal-header">
                        <h2>Join a League</h2>
                        <p>Join a private league and play against your friends.</p>
                    </div>
                    <form className="modal-form" onSubmit={handleJoinLeague}>
                        <div className="input-cont">
                            <label htmlFor="league-name">League Code</label>
                            <input type="text" id="league-code" name="league-code" onChange={(e) => setLeagueCode(e.target.value)} />
                        </div>
                        <button className='btn black'>Join League</button>
                        {error && <p className='error'>*{error}</p>}
                    </form>
                </div>
            )}
        </div>
    )
}