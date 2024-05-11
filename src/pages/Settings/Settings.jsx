import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import './settings.styles.css'
import { LoaderWhite } from "../../components/Loader/Loader";

export const Settings = ({ user }) => {

    const navigate = useNavigate();
    const [fanData, setFanData] = useState();
    const [showMarketingPreferences, setShowMarketingPreferences] = useState(false)
    const [marketingPreferences, setMarketingPreferences] = useState();
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showChangePreferencesModal, setShowChangePreferencesModal] = useState(false);
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [showModalText, setShowModalText] = useState(false);
    const [modalText, setModalText] = useState({
        title: '',
        body: '',
        loading: false,
    })

    useEffect(() => {
        
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/accounts/handleGetUserData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user.user_id }),
                });
                if (response.status === 200) {
                    const responseData = await response.json();
                    setFanData(responseData)
                }
            } catch (error) {
                console.error(error)
            }
            try {
                const response = await fetch('/api/accounts/handleFindUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user: user.username }),
                });
                if (response.status === 200) {
                    const responseData = await response.json();
                    setShowMarketingPreferences(true);
                    setMarketingPreferences(responseData.emailConsent)
                }
            } catch (error) {
                console.error(error);
            }
        }
        
        if (!user) {
            navigate('/');
        } else {
            fetchUserData()
        }

    }, [user])

    const handleChangePassword = async () => {

        setShowChangePasswordModal(true);
        setModalText({
            title: 'Change Password',
            body: 'Sending you a link to change your password...',
            loading: true,
        })

        try {
            const response = await fetch('/api/accounts/handleForgotPassword.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: user.email }),
            });
      
            if (response.ok) {
                setModalText({
                    title: 'Change Password',
                    body: 'Email sent. Follow the reset password link in your inbox. Make sure you check your spam/junk folder.',
                    loading: false,
                })
                setTimeout(() => {
                    setShowChangePasswordModal(false);
                    setShowModalText(false);
                }, 3000);
            } else {
                setModalText({
                    title: 'Change Password',
                    body: 'Sorry but there was an error resetting your password. Please try again later. If the issue persists, get in touch with the support team at gridlock.contact@gmail.com.',
                    loading: false,
                })
                setTimeout(() => {
                    setShowChangePasswordModal(false);
                    setShowModalText(false);
                }, 3000);
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            setModalText({
                title: 'Change Password',
                body: 'Sorry but there was an error resetting your password. Please try again later. If the issue persists, get in touch with the support team at gridlock.contact@gmail.com.',
                loading: false,
            })
            setTimeout(() => {
                setShowChangePasswordModal(false);
                setShowModalText(false);
            }, 3000);
        }
    }

    const handleChangePreferences = async (preference) => {

        setShowChangePreferencesModal(true);
        setModalText({
            title: 'Change Preferences',
            body: 'Submitting your preferences...',
            loading: true,
        })

        if (preference) {
            setMarketingPreferences(true);
        } else {
            setMarketingPreferences(false);
        }

        try {
            const response = await fetch('/api/accounts/handleChangeMarketingPreferences.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: user.email, emailConsent: preference }),
            });
      
            if (response.ok) {
                setModalText({
                    title: 'Change Preferences',
                    body: 'Your changes have been saved.',
                    loading: false,
                })
                setTimeout(() => {
                    setShowChangePreferencesModal(false);
                    setShowModalText(false);
                }, 3000);
            } else {
                setModalText({
                    title: 'Change Preferences',
                    body: 'Sorry but there was an error changing your preferences. Please try again later. If the issue persists, get in touch with the support team at gridlock.contact@gmail.com.',
                    loading: false,
                })
                setTimeout(() => {
                    setShowChangePreferencesModal(false);
                    setShowModalText(false);
                }, 3000);
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            setModalText({
                title: 'Change Preferences',
                body: 'Sorry but there was an error changing your preferences. Please try again later. If the issue persists, get in touch with the support team at gridlock.contact@gmail.com.',
                loading: false,
            })
            setTimeout(() => {
                setShowChangePreferencesModal(false);
                setShowModalText(false);
            }, 3000);
        }
    }

    const handleDeleteAccount = async () => {

        setShowDeleteAccountModal(true);
        setModalText({
            title: 'Delete Account',
            body: 'Deleting your Gridlock Account...',
            loading: true,
        })

        try {
            const response = await fetch('/api/accounts/handleDeleteAccount.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: user.email }),
            });
      
            if (response.ok) {
                setModalText({
                    title: 'Delete Account',
                    body: 'Your account has been deleted.',
                    loading: false,
                })
                setTimeout(async () => {
                    setShowDeleteAccountModal(false);
                    setShowModalText(false);
                    try {
                        const response = await fetch('/api/accounts/handleLogout', { method: 'POST' });
                        if (response.ok) {
                            navigate('/');
                            window.location.reload();
                        } else {
                            console.error('Logout failed:', response.statusText);
                        }
                    } catch (error) {
                        console.error('Error during logout:', error);
                    }
                }, 3000);
            } else {
                setModalText({
                    title: 'Delete Account',
                    body: 'There was an error deleting your account. Please try again later. If the issue persists, get in touch with the support team at gridlock.contact@gmail.com.',
                    loading: false,
                })
                setTimeout(() => {
                    setShowDeleteAccountModal(false);
                    setShowModalText(false);
                }, 3000);
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            setModalText({
                title: 'Delete Account',
                body: 'There was an error deleting your account. Please try again later. If the issue persists, get in touch with the support team at gridlock.contact@gmail.com.',
                loading: false,
            })
            setTimeout(() => {
                setShowDeleteAccountModal(false);
                setShowModalText(false);
            }, 3000);
        }
    }

    return (
        <section className="settings">
            <h1>Settings</h1>
            {user && (          
                <>  
                    <div className="info">
                        <h2>Account</h2>
                        <div className="details">
                            <h3>Email address:</h3>
                            <p>{user.email}</p>
                        </div>
                        <div className="details">
                            <h3>Username:</h3>
                            <p>{user.username}</p>
                        </div>
                        <button className="btn white" onClick={() => setShowChangePasswordModal(!showChangePasswordModal)}>
                            Change Password
                        </button>
                    </div>

                    {fanData && (
                        <div className="info">
                            <h2>F1 Fan Data</h2>
                            <div className="details">
                                <h3>Favourite Driver:</h3>
                                <p>{fanData.favouriteDriver}</p>
                            </div>
                            <div className="details">
                                <h3>Favourite Team:</h3>
                                <p>{fanData.favouriteTeam}</p>
                            </div>
                            <div className="details">
                                <h3>Favourite Grand Prix:</h3>
                                <p>{fanData.favouriteGrandPrix}</p>
                            </div>
                            <div className="details">
                                <h3>Nationality:</h3>
                                <p>{fanData.nationality}</p>
                            </div>
                            <div className="details">
                                <h3>F1 Engagement:</h3>
                                <p>{fanData.f1Engagement}</p>
                            </div>
                            <Link className="link btn white" to={'/user-info'}>
                                Edit Fan Data
                            </Link>
                        </div>
                    )}

                    {showMarketingPreferences && (
                        <div className="info">
                            <h2>Marketing Preferences</h2>
                            <div className="details">
                                <h3>Non-Essential Emails:</h3>
                                <p>
                                    {marketingPreferences ? (
                                        'Allowed'
                                    ) : (
                                        'Not allowed'
                                    )}
                                </p>
                            </div>
                            <button className="btn white" onClick={() => setShowChangePreferencesModal(!showChangePreferencesModal)}>
                                Edit Preferences
                            </button>
                        </div>
                    )}
                                        
                    <div className="info">
                        <h2>Delete Account</h2>
                        <div className="details">
                            <p>If you want to delete your account, and all its data, press the button below. You cannot recover your account once you delete it.</p>
                        </div>
                        <button className="btn red" onClick={() => setShowDeleteAccountModal(!showDeleteAccountModal)}>
                            Delete Account
                        </button>
                    </div>
                </>
            )}       

            {showChangePasswordModal && (
                <div className="settings-modal">
                    {showModalText ? (
                        <div className="modal-body">
                            <h2>{modalText.title}</h2>
                            {modalText.loading === true && (
                                <LoaderWhite />
                            )}
                            <p>{modalText.body}</p>
                        </div>
                    ) : (
                        <div className="modal-body">
                            <h2>Are you sure you want to change your password?</h2>
                            <div className="two-buttons">
                                <button className="btn white" onClick={() => setShowChangePasswordModal(!showChangePasswordModal)}>
                                    No
                                </button>
                                <button className="btn red" onClick={() => {handleChangePassword(); setShowModalText(true)}}>
                                    Yes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {showChangePreferencesModal && (
                <div className="settings-modal">
                    {showModalText ? (
                        <div className="modal-body">
                            <h2>{modalText.title}</h2>
                            {modalText.loading === true && (
                                <LoaderWhite />
                            )}
                            <p>{modalText.body}</p>
                        </div>
                    ) : (
                        <div className="modal-body">
                            <h2>Do you want to opt-{marketingPreferences ? 'out of' : 'in for'} marketing emails?</h2>
                            <div className="two-buttons">
                                <button className="btn white" onClick={() => setShowChangePreferencesModal(!showChangePreferencesModal)}>
                                    No
                                </button>
                                <button className="btn red" onClick={() => {{marketingPreferences ? handleChangePreferences(false) : handleChangePreferences(true)}; setShowModalText(true)}}>
                                    Yes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {showDeleteAccountModal && (
                <div className="settings-modal">
                    {showModalText ? (
                        <div className="modal-body">
                            <h2>{modalText.title}</h2>
                            {modalText.loading === true && (
                                <LoaderWhite />
                            )}
                            <p>{modalText.body}</p>
                        </div>
                    ) : (
                        <div className="modal-body">
                            <h2>Are you sure you want to delete your account?</h2>
                            <div className="two-buttons">
                                <button className="btn white" onClick={() => setShowDeleteAccountModal(!showDeleteAccountModal)}>
                                    No
                                </button>
                                <button className="btn red" onClick={() => {handleDeleteAccount(); setShowModalText(true)}}>
                                    Yes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </section>
    )
}