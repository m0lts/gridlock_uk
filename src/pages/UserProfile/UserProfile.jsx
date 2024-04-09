import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import './user-profile.styles.css';
import { LoaderWhite } from "../../components/Loader/Loader";
import { PrimaryHeading } from "../../components/Typography/Titles/Titles";
import { CloseIcon, ExpandIcon, LeftChevronIcon } from "../../components/Icons/Icons";
import { getCountryFlag } from "../../utils/getCountryFlag";
import { PreviousPredictions } from "../../components/PreviousPredictions/PreviousPredictions";
import { AccountStats } from "../../components/AccountStats/AccountStats";

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
                userName={user}
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