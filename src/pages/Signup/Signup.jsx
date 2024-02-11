import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Loader } from "../../components/Loader/Loader";


export default function SignUp() {

    // SET UP NAVIGATE
    const navigate = useNavigate();

    // SET STATES
    // For data packet to be sent to database
    const [formValues, setFormValues] = useState({
        forename: '',
        surname: '',
        username: '',
        email: '',
        password: '',
        verify_password: '',
    });
    // For validation errors
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [verifyPasswordError, setVerifyPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    // For submission modal
    const [formSubmitted, setFormSubmitted] = useState(false);


    
    // SET FORM VALUES TO ENTERED VALUES
    const handleInputChange = async (event) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });

        // Email validation
        if (name === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setEmailError(emailPattern.test(value) ? '' : '* Please enter a valid email address');
        }
        // Password validation
        if (name === 'password') {
            const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
            setPasswordError(passwordPattern.test(value) ? '' : '* Password must be at least 8 characters long, contain a capital letter, and a number');
        }
        // Verify password validation
        if (name === 'verify_password' || name === 'password') {
            setVerifyPasswordError(value === formValues.password ? '' : '* Passwords do not match');
        }
    };
    


    // HANDLE FORM SUBMISSION
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check for errors
        if (emailError || passwordError || verifyPasswordError) {
            // If there are errors, do not submit the form
            alert('Please ensure all fields are filled out correctly.');
            return;
        } else {
            setFormSubmitted(true);
        }

        try {
            const response = await fetch('/api/accounts/handleSignup.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formValues),
            });
      
            if (response.ok) {
                sessionStorage.setItem('user', JSON.stringify(formValues));
                navigate('/');
              } else if (response.status === 400) {
                // Email already taken
                setEmailError('* Email already in use.');
                setFormSubmitted(false);
              } else if (response.status === 401) {
                // Username already taken
                setUsernameError('* Username already in use.');
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
                <h1 className="title">Sign Up</h1>
                {formSubmitted ? (
                    <p>Creating your account...</p>
                ) : (
                <form className="account-form" onSubmit={handleSubmit}>
                    <div className="two-inputs">
                        <div className="input-group">
                            <label htmlFor="forename">Forename:</label>
                            <input 
                                type="text" 
                                id="forename" 
                                name="forename" 
                                required={true}
                                value={formValues.forename}
                                onChange={handleInputChange}
                                />
                        </div>
                        <div className="input-group">
                            <label htmlFor="surname">Surname:</label>
                            <input 
                                type="text" 
                                id="surname" 
                                name="surname" 
                                required={true}
                                value={formValues.surname}
                                onChange={handleInputChange}
                                />
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="surname">Username:</label>
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
                        <label htmlFor="password">Password:</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            required={true}
                            value={formValues.password}
                            onChange={handleInputChange}
                        />
                        {passwordError && <div className="error-message">{passwordError}</div>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="verify_password">Repeat Password:</label>
                        <input 
                            type="password" 
                            id="verify_password" 
                            name="verify_password" 
                            required={true}
                            value={formValues.verify_password}
                            onChange={handleInputChange}
                        />
                        {verifyPasswordError && <div className="error-message">{verifyPasswordError}</div>}
                    </div>
                    <button 
                        type="submit" 
                        className={`btn btn-purple ${emailError || passwordError || verifyPasswordError || usernameError ? 'disabled' : ''}`}
                        disabled={emailError || passwordError || verifyPasswordError || usernameError}
                    >
                        Submit
                    </button>
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