// Dependencies
import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
// Components
import { LoaderWhite } from "../../components/Loader/Loader";
// Utils
import { decodeToken, saveTokenToCookie} from "../../utils/cookieFunctions";
import { HideIcon, SeeIcon } from "../../components/Icons/Icons";



export default function SignUp({ user, setUser }) {
    
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        username: '',
        email: '',
        password: '',
        emailConsent: true,
    });
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    
    const handleInputChange = async (event) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });

        if (name === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setEmailError(emailPattern.test(value) ? '' : '* Please enter a valid email address');
        }
        if (name === 'password') {
            const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
            setPasswordError(passwordPattern.test(value) ? '' : '* Password must be at least 8 characters long, contain a capital letter, and a number');
        }
    };

    const handleCheckboxChange = (event) => {
        const { checked } = event.target;
        setFormValues({ ...formValues, emailConsent: !checked });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormSubmitted(true);

        try {
            const response = await fetch('/api/accounts/handleSignup.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formValues),
            });
      
            if (response.ok) {
                const responseData = await response.json();
                const user = responseData.user;
                setUser(user);
                navigate('/verifyaccount');
              } else if (response.status === 400) {
                setEmailError('* Email already in use.');
                setFormSubmitted(false);
              } else if (response.status === 401) {
                setUsernameError('* Username already in use.');
                setFormSubmitted(false);
              } else if (response.status === 500) {
                setEmailError('* Email address not recognised, please enter a valid email address.');
                setFormSubmitted(false);
              } else {
                alert('Account creation failed, please try again later.');
                setFormSubmitted(false);
              }
          } catch (error) {
            console.error('Error submitting form:', error);
          }
        
    };


    return (
        <section className="gateway-page page-padding bckgrd-white"> 
            <div className="body">
                <h1 className="title">{signUpSuccess ? 'Success!' : 'Sign Up'}</h1>
                {formSubmitted ? (
                    <LoaderWhite />
                ) : (
                <form className="account-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email Address:</label>
                        <input 
                            type="text" 
                            id="email" 
                            name="email" 
                            required={true}
                            value={formValues.email}
                            onChange={handleInputChange}
                        />
                        {emailError && <div className="error-message">{emailError}</div>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="surname">Choose a Username:</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            required={true}
                            value={formValues.username}
                            onChange={(event) => {
                                handleInputChange(event);
                                setUsernameError('');
                            }}
                        />
                        {usernameError && <div className="error-message">{usernameError}</div>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password:</label>
                        <div className="password-input">
                            <input 
                                type={showPassword ? "text" : "password"}
                                id="password" 
                                name="password" 
                                required={true}
                                value={formValues.password}
                                onChange={handleInputChange}
                            />
                            <button 
                                onClick={togglePasswordVisibility}
                                type="button"
                                aria-label="Toggle password visibility"
                                className="btn"
                            >
                                {showPassword ? (
                                    <HideIcon />
                                ) : (
                                    <SeeIcon />
                                )}
                            </button>
                        </div>
                        {passwordError && <div className="error-message">{passwordError}</div>}
                    </div>
                    <button 
                        type="submit" 
                        className={`btn white ${emailError || passwordError || usernameError ? 'disabled' : ''}`}
                        disabled={emailError || passwordError || usernameError}
                    >
                        Sign up
                    </button>
                    <div className="legal-box">
                        <p>By signing up, you agree to our <Link to='https://app.termly.io/document/terms-of-service/5ff14f74-440f-4efc-847c-ad668d378a47' className="forgot-password-link">Terms of Service</Link> and <Link to='https://app.termly.io/document/privacy-policy/3c0c4470-16e7-44b1-8700-97ba61830c3e' className="forgot-password-link">Privacy Policy</Link>.</p>
                        <label htmlFor="email-consent">
                            <input type="checkbox" name="email-consent" id="email-consent" checked={!formValues.emailConsent} onChange={handleCheckboxChange} />
                            Check this box to unsubscribe from non-essential emails.
                        </label>
                    </div>
                    <div className="forgot-password-message">
                        <Link to='/login' className="forgot-password-link">
                            Already have an account? Log in here.
                        </Link>
                    </div>
                </form>
                )}
            </div>
        </section>

    )
}