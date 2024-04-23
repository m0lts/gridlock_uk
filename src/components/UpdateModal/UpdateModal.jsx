// Components
import { DefaultLogo } from "../Logos/Logos"
// Styles
import './update-modal.styles.css'


export const UpdateModal = ({ showUpdateModal, setShowUpdateModal }) => {

    const handleModalClose = () => {
        localStorage.setItem('updateModalv2.0.1', 'closed');
        setShowUpdateModal(false);
    }

    return (
        <div className="update-modal">
            <div className="modal-content">
                <DefaultLogo />
                <h1 className="title">Gridlock v2.0.1</h1>
                <div className="updates">
                    <div className="update">
                        <h3>Site-wide:</h3>
                        <ul>
                            <li>Updated site security</li>
                            <li>Implemented cookie use to further protect user data from bad actors.</li>
                        </ul>
                    </div>
                </div>
                <button className="btn white" onClick={handleModalClose}>Close</button>
            </div>
        </div>
    )
}