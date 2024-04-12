// Dependencies
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom";
// Components
import { LoaderWhite } from "../../components/Loader/Loader";


export const VerifyAccount = () => {

    const [userVerified, setUserVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const userEmail = searchParams.get('email');

    useEffect(() => {

        const verifyUser = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/accounts/handleVerifyUser.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token, userEmail }),
                });

                if (response.ok) {
                    const responseData = await response.json();
                    const updatedUserAccount = responseData.updatedUserAccount;
                    delete updatedUserAccount.password;
                    if (updatedUserAccount) {
                        const userData = JSON.parse(localStorage.getItem('user'));
                        if (userData) {
                            localStorage.setItem('user', JSON.stringify({ ...userData, verified: true }));
                        } else {
                            localStorage.setItem('user', JSON.stringify(updatedUserAccount));
                        }
                    } else {
                        console.error('No user data found in response');
                    }
                    setIsLoading(false);
                    setUserVerified(true);
                } else {
                    setIsLoading(false);
                    setUserVerified(false);

                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }

        verifyUser();

    }, [token, userEmail]);

    return (
        <div className="gateway-page">
            <h1 style={{ marginBottom : '1rem' }} className="title">Verify Account</h1>
            {userVerified ? (
                <>
                    <p style={{ marginBottom : '1rem', color: 'var(--white)' }}>Thank you for verifying your account.</p>
                    <Link to='/'className="forgot-password-link">
                            Return to Homepage
                    </Link>
                </>
            ) : (
                <LoaderWhite />
            )}
        </div>
    )
}


