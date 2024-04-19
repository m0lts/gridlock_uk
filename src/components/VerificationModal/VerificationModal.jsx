import { useState, useRef } from 'react';
import './verification-modal.styles.css'

export const VerificationModal = ({ showModal, setShowModal }) => {
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleVerify = (e) => {
        e.preventDefault();
        const code = verificationCode.join('');
        // You can perform verification logic here
        console.log('Verification code:', code);
    };

    return (
        <div className={`verification-modal ${showModal ? 'show' : ''}`}>
            <div className='modal-content'>
                <h2>Verify your account</h2>
                <p>Please check your email for a verification code and enter it below. If you have not received a code, please check your spam/junk folder.</p>
                <form onSubmit={handleVerify}>
                    <div className="verification-inputs">
                        {verificationCode.map((digit, index) => (
                            <input
                                key={index}
                                type='text'
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                ref={(input) => (inputRefs.current[index] = input)}
                            />
                        ))}
                    </div>
                    <button type="submit" className='btn white'>Verify</button>
                </form>
                <p className='exit-text'>Resend verification code</p>
                <p className='exit-text' onClick={() => setShowModal(false)}>Verify another time...</p>
            </div>
        </div>
    );
};