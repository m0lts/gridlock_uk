import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Nationalities } from '../../utils/getAllNationalities';
import './user-data.styles.css';
import { LoaderWhite } from '../../components/Loader/Loader';

export const UserData = ({ user, setUser, driverData, seasonData }) => {

    // If user isn't logged in, redirect to login page
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    // Set user data
    const [userData, setUserData] = useState({
        user_id: user ? user.user_id : '',
        favouriteDriver: '',
        favouriteTeam: '',
        favouriteGrandPrix: '',
        nationality: '',
        f1Engagement: '',
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormSubmitted(true);
        try {
            const response = await fetch('/api/accounts/handleUserData.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                setUser(user => ({ ...user, userData: true }));
                navigate('/');
                setFormSubmitted(false);
            } else {
                alert('There was an error submitting your data. Please try again.');
                setFormSubmitted(false);
            }
        }
        catch (error) {
            console.error('Error submitting form:', error);
            setFormSubmitted(false);
        }

    }

    const handleInputChange = async (event) => {
        const { name, value } = event.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    }

    // Sort drivers and teams and circuits
    const [sortedDriverData, setSortedDriverData] = useState([]);
    const [teamData, setTeamData] = useState([]);
    const [circuitData, setCircuitData] = useState([]);
    const [countryData, setCountryData] = useState(Nationalities);

    useEffect(() => {
        const getDrivers = () => {
            const driverArray = [];
            driverData.forEach(driver => {
                if (driver.driverLastName === 'Bearman') {
                    return;
                }
                driverArray.push({
                    name: driver.driverFirstName + ' ' + driver.driverLastName,
                    abbr: driver.driverAbbr,
                    id: driver.driverId,
                    img: driver.driverImage,
                });
            }
            );
            return driverArray;
        }
        const getTeams = () => {
            const teamArray = [];
            driverData.forEach(driver => {
                if (!teamArray.some(team => team.name === driver.driverTeam)) {
                    teamArray.push({
                        name: driver.driverTeam,
                        badge: driver.driverTeamBadge,
                    });
                }
            }
            );
            return teamArray;
        }
        const getCircuits = () => {
            const circuitArray = [];
            seasonData.forEach(event => {
                circuitArray.push({
                    name: event.competitionName,
                });
            }
            );
            return circuitArray;
        }
        setSortedDriverData(getDrivers());
        setTeamData(getTeams());
        setCircuitData(getCircuits());
    }, [driverData, seasonData]);


    return (
        <section className="user-data">
            {formSubmitted ? (
                <LoaderWhite />
            ) : (
                <>
                    <div className="user-data-header">
                        <h1>Welcome, {user ? user.username : 'User'}!</h1>
                        <p>We've noticed your profile isn't fully set up yet. Take a moment to complete it to enhance your experience.</p>
                    </div>
                    <form className="account-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="favouriteDriver">Favourite Driver:</label>
                            <div className='radio-group'>
                            {sortedDriverData.map((driver) => (
                                <div key={driver.id} className='radio-btn'>
                                    <input
                                        type="radio"
                                        id={`driver-${driver.id}`}
                                        name="favouriteDriver"
                                        value={driver.name}
                                        onChange={handleInputChange}
                                        checked={userData.favouriteDriver === driver.name}
                                        className="driver-radio"
                                    />
                                    <label htmlFor={`driver-${driver.id}`}>
                                        {driver.img && <img src={driver.img} alt={driver.name} />}
                                    </label>
                                </div>
                            ))}
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="favouriteTeam">Favourite Team:</label>
                            <div className='radio-group'>
                                {teamData.map((team, index) => (
                                    <div key={index} className='radio-btn team'>
                                        <input
                                            type="radio"
                                            id={`team-${index}`}
                                            name="favouriteTeam"
                                            value={team.name}
                                            onChange={handleInputChange}
                                            checked={userData.favouriteTeam === team.name}
                                            className='team-radio'
                                        />
                                        <label htmlFor={`team-${index}`}>
                                            {team.badge && <img src={team.badge} alt={team.badge} />}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="favouriteGrandPrix">Favourite Grand Prix:</label>
                            <select
                                id="favouriteGrandPrix"
                                name="favouriteGrandPrix"
                                value={userData.favouriteGrandPrix}
                                onChange={handleInputChange}
                                className='select-box'
                            >
                                <option value="">Select your favourite Grand Prix</option>
                                {circuitData.map((circuit, index) => (
                                    <option key={index} value={circuit.name}>
                                        {circuit.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="nationality">Nationality:</label>
                            <select
                                id="nationality"
                                name="nationality"
                                value={userData.nationality}
                                onChange={handleInputChange}
                                className='select-box'
                            >
                                <option value="">Select your nationality</option>
                                {countryData.map((country, index) => (
                                    <option key={index} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="f1Engagement">F1 Engagement:</label>
                            <select
                                id="f1Engagement"
                                name="f1Engagement"
                                value={userData.f1Engagement}
                                onChange={handleInputChange}
                                className='select-box'
                            >
                                <option value="">Select your level of F1 engagement</option>
                                <option value="Casual Viewer">Casual Viewer - I watch occasionally</option>
                                <option value="Regular Fan">Regular Fan - I try not to miss races</option>
                                <option value="Enthusiast">Enthusiast - I follow all sessions and news</option>
                                <option value="Die-Hard Fan">Die-Hard Fan - I live and breathe Formula 1</option>
                            </select>
                        </div>
                        <button 
                            type="submit" 
                            className={`btn white`}
                        >
                            Submit
                        </button>
                    </form>
                    <div className="bottom-filler"></div>
                </>
            )}
        </section>
    );
}