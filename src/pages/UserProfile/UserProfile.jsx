// Dependencies
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// Components
import { LoaderWhite } from "../../components/Loader/Loader";
import { LeftChevronIcon } from "../../components/Icons/Icons";
import { PreviousPredictions } from "../../components/PreviousPredictions/PreviousPredictions";
import { AccountStats } from "../../components/AccountStats/AccountStats";
// Styles
import './user-profile.styles.css';


export const UserProfile = ({ seasonData }) => {

    // Get user data logic
    const { user } = useParams();
    const [userAccount, setUserAccount] = useState();

    useEffect(() => {
        const fetchUserRecord = async () => {
            try {
                const response = await fetch('/api/accounts/handleFindUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user }),
                });
                if (response.status === 200) {
                    const responseData = await response.json();
                    setUserAccount(responseData);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
    
        fetchUserRecord();
    }, [user])

    const handleGoBack = () => {
        window.history.back();
    }

    return (
        <section className="user">
            <div className="back-button" onClick={handleGoBack}>
                <LeftChevronIcon />
                Back
            </div>
            <AccountStats
                username={user}
            />
            <div className="previous-predictions-section">
                <h3>Previous Predictions</h3>
                {userAccount ? (
                    <PreviousPredictions
                        userEmail={userAccount.email}
                        seasonData={seasonData}
                    />
                ) : (
                    <LoaderWhite />
                )}
            </div>
            <div className="bottom-filler"></div>
        </section>
    )
}