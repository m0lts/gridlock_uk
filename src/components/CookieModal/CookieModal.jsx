import './cookie-modal.styles.css'

export const CookieConsentModal = ({ showCookieModal, setShowCookieModal }) => {

    const handleModalClose = () => {
        localStorage.setItem('cookieConsent', 'true');
        setShowCookieModal(false);
    }

    return (
        <div className="cookie-consent-modal">
            <div className="modal-content">
                <h2>Cookie Usage</h2>
                <p>We use essential cookies to ensure the smooth functioning of our website. By continuing to browse the site, you agree to our use of cookies.</p>
                <button className='btn black' onClick={handleModalClose}>Understood</button>
            </div>
        </div>
    );
};