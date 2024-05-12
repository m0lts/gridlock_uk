// Dependencies
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom";
// Components
import { LoaderWhite } from "../../components/Loader/Loader";
// Styles
import './verify-account.styles.css'


export const VerifyAccount = ({ user, setUser, seasonData }) => {

    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [nextRoundNumber, setNextRoundNumber] = useState(null);
    const [error, setError] = useState(null);
    const [verifyButtonText, setVerifyButtonText] = useState('Resend verification code');
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {

        const getNextRoundNumber = () => {
            const scheduledEvent = seasonData.find(event => event.status === 'Scheduled');
            if (scheduledEvent) {
                setNextRoundNumber(seasonData.indexOf(scheduledEvent) + 1);
            }
        }

        if (seasonData.length > 0) {
            getNextRoundNumber()
        }
    }, [])

    const handleChange = (index, value) => {
        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setFormSubmitted(true);
        const code = verificationCode.join('');
        const userId = user.user_id;

        try {
            const response = await fetch('/api/accounts/handleVerifyUser.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, userId }),
            });

            if (response.ok) {
                const responseData = await response.json();
                setUser(responseData.user);
                try {
                    const response = await fetch('/api/leagues/handleJoinPublicLeague', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ nextRoundNumber, username: user.username }),
                    });
                    if (response.ok) {
                        setFormSubmitted(true);                        
                        navigate('/user-info');
                    } else {
                        setFormSubmitted(false);
                    }
                } catch (error) {
                    console.error('Error submitting form:', error);
                    setFormSubmitted(false);        
                }
            } else {
                setFormSubmitted(false);
                setError('*Invalid verification code, please try again.')
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setFormSubmitted(false);
        }
    };

    // Resend verification code if user is not verified
    const handleSendVerificationCode = async () => {
        if (isResendDisabled) return;
        setIsResendDisabled(true);
        setVerifyButtonText('Sending Code...');
        
        try {
            const response = await fetch('/api/accounts/handleResendVerification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user.email }),
            });

            if (response.ok) {
                setVerifyButtonText(`Re-sent verification code to ${user.email}`);
                setTimeout(() => {
                    setVerifyButtonText('Resend verification code');
                }, 2000);
            } else if (response.status === 401) {
                setVerifyButtonText('Error sending verification code.');
            }
        } catch (error) {
            console.error('Error sending verification code:', error);
            setVerifyButtonText('Error sending verification code.');
        } finally {
            setTimeout(() => {
                setIsResendDisabled(false);
                setVerifyButtonText('Resend verification code');
            }, 60000);
        }
    }

    return (
        <section className={`verify-account`}>
            <div className="top-filler"></div>
            <div className="body">
                <h1>Verify your account</h1>
                <p>Please check your email for a verification code and enter it below. If you have not received a code, please check your spam/junk folder.</p>
                {formSubmitted ? (
                    <LoaderWhite />
                ) : (
                    <>
                        <form onSubmit={handleVerify}>
                            <div className="verification-inputs">
                                {verificationCode.map((digit, index) => (
                                    <input
                                        key={index}
                                        type='text'
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => {handleChange(index, e.target.value); setError(null);}}
                                        ref={(input) => (inputRefs.current[index] = input)}
                                        style={{ borderColor: error ? 'red' : '' }}
                                    />
                                ))}
                            </div>
                            {error && <p className='error'>{error}</p>}
                            <button type="submit" className='btn white'>Verify</button>
                        </form>
                        <p className='resend-text' onClick={handleSendVerificationCode} disabled={isResendDisabled}>{verifyButtonText}</p>
                    </>
                )}
            </div>
            <div className="bottom-filler"></div>
        </section>
    );
}


