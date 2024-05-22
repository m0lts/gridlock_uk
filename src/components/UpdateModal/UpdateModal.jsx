// Components
import { DefaultLogo } from "../Logos/Logos"
// Styles
import './update-modal.styles.css'


export const UpdateModal = ({ showUpdateModal, setShowUpdateModal }) => {

    const handleModalClose = () => {
        localStorage.setItem('updateModalv3', 'closed');
        setShowUpdateModal(false);
    }

    return (
        <div className="update-modal">
            <div className="modal-content">
                <DefaultLogo />
                <h1 className="title">Gridlock v3</h1>
                <p>We’ve added some major upgrades to Gridlock!</p>
                <div className="updates">
                    <div className="update">
                        <h3>Predictor:</h3>
                        <ul>
                            <li>Added default predictions. Users can now submit a default prediction that will automatically be used if they miss a race weekend.</li>
                            <li>Added Quali and Grid Boosts. Each boost can only be used once a season and only one can be used per weekend.</li>
                        </ul>
                    </div>
                    <div className="update">
                        <h3>Standings:</h3>
                        <ul>
                            <li>Users can now compete against similar fans in public leagues.</li>
                        </ul>
                    </div>
                    <div className="update">
                        <h3>Settings:</h3>
                        <ul>
                            <li>The settings page allows users to change their account data, fan data, email consent etc.</li>
                        </ul>
                    </div>
                    <div className="update">
                        <h3>Site-wide:</h3>
                        <ul>
                            <li>Improved site load times.</li>
                            <li>Updated site security.</li>
                        </ul>
                    </div>
                    <div className="update">
                        <h3>Bug fixes:</h3>
                        <ul>
                            <li>Fixed a bug where the qualifying result is shown under previous predictions before the race result.</li>
                        </ul>
                    </div>
                </div>
                <button className="btn white" onClick={handleModalClose}>Close</button>
            </div>
        </div>
    )
}