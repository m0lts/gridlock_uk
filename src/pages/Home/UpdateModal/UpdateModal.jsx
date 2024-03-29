import { DefaultLogo } from "../../../components/Logos/Logos"

export const UpdateModal = ({ showUpdateModal, setShowUpdateModal }) => {

    const handleModalClose = () => {
        localStorage.setItem('updateModal', 'closed');
        setShowUpdateModal(false);
    }

    return (
        <div className="update-modal">
            <div className="modal-content">
                <DefaultLogo />
                <h1 className="title">Gridlock v1.1.0</h1>
                <p className="top-text">Firstly, thank you for signing up to Gridlock! There have been some updates to the website that are listed below:</p>
                <div className="updates">
                    <div className="update">
                        <h3>Home page:</h3>
                        <ul>
                            <li>Added 'Gridlock Stats'. Gridlock Stats consists of three sections: the best prediction so far, the total number of points scored on Gridlock and the most picked driver in each grid position.</li>
                        </ul>
                    </div>
                    <br />
                    <div className="update">
                        <h3>Predictor page:</h3>
                        <ul>
                            <li>Users can now see their predictions from previous race weekends at the bottom of the predictor page.</li>
                        </ul>
                    </div>
                    <br />
                    <div className="update">
                        <h3>Standings page:</h3>
                        <ul>
                            <li>Users can now view other user's accounts, their stats and their predictions for each race. Click a user's name on the standings table or on private league tables to view their account.</li>
                        </ul>
                    </div>
                    <br />
                    <div className="update">
                        <h3>Accounts page:</h3>
                        <ul>
                            <li>Accounts have been made more personalisable. Users can now select and save a profile icon from a pre-defined pool of icons. User icons will by default be assigned a question mark until changed.</li>
                            <li>Get in touch section added. If you encounter an issue, it would be greatly appreciated if you could send us a message through the get in touch form with details of the issue. Suggestions on app improvements are also welcome.</li>
                        </ul>
                    </div>
                </div>
                <button className="btn btn-black" onClick={handleModalClose}>Close</button>
            </div>
        </div>
    )
}