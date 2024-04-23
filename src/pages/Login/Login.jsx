// Dependencies
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
// Components
import { LoaderWhite } from "../../components/Loader/Loader";
// Styles
import './login.styles.css';


export default function LogIn({ user, setUser }) {

    const navigate = useNavigate();
    const [loginFormValues, setLoginFormValues] = useState({
        email: '',
        password: ''
    });
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleInputChange = async (event) => {
        const { name, value } = event.target;
        setLoginFormValues({
            ...loginFormValues,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (emailError || passwordError) {
            alert('Please ensure all fields are filled out correctly.');
            return;
        } else {
            setFormSubmitted(true);
        }

        try {
            const response = await fetch('/api/accounts/handleLogin.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(loginFormValues),
            });
      
            if (response.ok) {
                const data = await response.json();
                const user = data.user;
                setUser(user);
                if (user.verified && user.userData) {
                    navigate('/');
                } else if (user.verified && !user.userData) {
                    navigate('/user-info');
                } else {
                    const response = await fetch('/api/accounts/handleResendVerification', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: user.email }),
                    });
                    if (response) {
                        navigate('/verifyaccount');
                    } else {
                        alert('Verification email failed to send, please try again later.');
                    }
                }
              } else if (response.status === 400) {
                setFormSubmitted(false);
                setEmailError('* Username or email incorrect.');
              } else if (response.status === 401) {
                setFormSubmitted(false);
                setPasswordError('* Incorrect password.');
              } else {
                alert('Login failed, please try again later.');
                setFormSubmitted(false);
              }
          } catch (error) {
            console.error('Error submitting form:', error);
          }
        
    };

    return (
        <section className="gateway-page">
            <div className="body">
                <h1 className="title">Log in</h1>
                {formSubmitted ? (
                    <LoaderWhite />
                ) : (
                <form className="account-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Username or Email:</label>
                        <input 
                            type="text" 
                            id="email" 
                            name="email" 
                            required 
                            onChange={(event) => {handleInputChange(event); setEmailError('')}}
                         />
                        {emailError && <div className="error-message">{emailError}</div>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password:</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            required 
                            onChange={(event) => {handleInputChange(event); setPasswordError('')}}
                         />
                        {passwordError && <div className="error-message">{passwordError}</div>}
                    </div>
                    <button 
                        type="submit" 
                        className={`btn white ${passwordError || emailError ? 'disabled' : ''}`}
                        disabled={passwordError || emailError}
                    >
                        Log in
                    </button>
                    <div className="forgot-password-message">
                        <Link to='/forgotpassword' className="forgot-password-link">
                            Forgot Password?
                        </Link>
                        <Link to='/signup' className="forgot-password-link">
                            New to Gridlock? Sign up here.
                        </Link>
                    </div>
                </form>
                )}
                
            </div>
        </section>

    )
}