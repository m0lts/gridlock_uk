// Components
import { DefaultLogo } from "../Logos/Logos"
// Styles
import './update-modal.styles.css'


export const UpdateModal = ({ showUpdateModal, setShowUpdateModal }) => {

    const handleModalClose = () => {
        localStorage.setItem('updateModalv2', 'closed');
        setShowUpdateModal(false);
    }

    return (
        <div className="update-modal">
            <div className="modal-content">
                <DefaultLogo />
                <h1 className="title">Gridlock v2</h1>
                <div className="updates">
                    <div className="update">
                        <h3>Site-wide:</h3>
                        <ul>
                            <li>Updated the user interface and experience.</li>
                            <li>Previous predictions now include the points scored for each position to make it clear to users how the points system works.</li>
                        </ul>
                    </div>
                    <br />
                    <div className="update">
                        <h3>Home page:</h3>
                        <ul>
                            <li>Added best prediction from previous round. Credit to jaydonbiggs76 for the suggestion.</li>
                        </ul>
                    </div>
                    <br />
                    <div className="update">
                        <h3>Standings page:</h3>
                        <ul>
                            <li>Updated how users view their public and private leagues</li>
                            <li>'Last updated' feature reduces loading times and notifies users how recently the standings data has been pulled from the database.</li>
                        </ul>
                    </div>
                    <br />
                    <div className="update">
                        <h3>Help page:</h3>
                        <ul>
                            <li>Accounts page has been changed to 'help' page. Users can make bug reports and suggestions here and update themselves on how the App works.</li>
                        </ul>
                    </div>
                    <br />
                    <div className="update">
                        <h3>Account icon:</h3>
                        <ul>
                            <li>Users can log out by clicking the account icon at the top of the page.</li>
                            <li>New account features will be added in future updates.</li>
                        </ul>
                    </div>
                </div>
                <button className="btn white" onClick={handleModalClose}>Close</button>
            </div>
        </div>
    )
}