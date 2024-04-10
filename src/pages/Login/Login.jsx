// Dependencies
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
// Components
import { LoaderWhite } from "../../components/Loader/Loader";
// Styles
import './login.styles.css';


export default function LogIn() {

    // SET NAVIGATE
    const navigate = useNavigate();

    // SET STATES
    // For data packet to be sent to database
    const [loginFormValues, setLoginFormValues] = useState({
        email: '',
        password: ''
    });
    // For validation errors
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    // For submission modal
    const [formSubmitted, setFormSubmitted] = useState(false);

    // SET FORM VALUES TO ENTERED VALUES
    const handleInputChange = async (event) => {
        const { name, value } = event.target;
        setLoginFormValues({
            ...loginFormValues,
            [name]: value,
        });

        // Email validation
        // if (name === 'email') {
        //     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //     setEmailError(emailPattern.test(value) ? '' : '* Must be a valid email address');
        // }
        // Password validation
        // if (name === 'password') {
        //     const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        //     setPasswordError(passwordPattern.test(value) ? '' : '* Password must be at least 8 characters long, contain a capital letter, and a number');
        // }
    };

    // HANDLE FORM SUBMISSION
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
      
            // Handle relative responses and edit modal message.
            if (response.ok) {
                const responseData = await response.json();
                delete responseData.userRecord.password;
                localStorage.setItem('user', JSON.stringify(responseData.userRecord));
                navigate('/');
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