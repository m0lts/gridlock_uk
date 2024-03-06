import { useEffect, useState } from "react";
import { PrimaryHeading } from "../../../components/Typography/Titles/Titles"
import { useNavigate } from 'react-router-dom';
import { getCountryFlag } from "../../../utils/getCountryFlag";
import { getTeamColour } from "../../../utils/getTeamColour";


export const Profile = ({ user, seasonData, driverData }) => {

    // Log out logic
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    }    

    // Get all profile images
    const [profileImgs, setProfileImgs] = useState({
        circuits: [],
        countryFlags: [],
        driverImages: [],
        teamBadges: []
    });
    useEffect(() => {
        const filterSeasonImages = () => {
            const countryFlags = Array.from(new Set(seasonData.map((event) => getCountryFlag(event.competitionCountry))));
            const driverImages = driverData.map((driver) => driver.driverImage);
            const teamBadges = Array.from(new Set(driverData.map((driver) => driver.driverTeamBadge)));
            setProfileImgs({
                countryFlags,
                driverImages,
                teamBadges
            });
        }
        filterSeasonImages();
    }, [seasonData, driverData, user]);

    // Change profile picture logic
    const [showProfileImgSelectionModal, setShowProfileImgSelectionModal] = useState(false);
    const [profilePicture, setProfilePicture] = useState(user.profilePicture);

    const handleChangeProfilePicture = async (image) => {
        setShowProfileImgSelectionModal(true);

        if (image) {
            setProfilePicture(image);
            setShowProfileImgSelectionModal(false);

            try {
                const response = await fetch('/api/accounts/handleUploadProfilePicture', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ profilePicture: image, email: user.email }),
                });

                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify({ ...user, profilePicture: image }));
                }

            } catch (error) {
                console.error('Error submitting form:', error);
            }

        } else {
            setShowProfileImgSelectionModal(false);
        }

    }

    return (
        <div className="user-profile page-padding bckgrd-black">
            <PrimaryHeading
                title="Profile"
                accentColour="blue"
                backgroundColour="white"
                textColour="black"
            />
            {showProfileImgSelectionModal && (
                <div className="profile-picture-selection-modal">
                    <div className="profile-picture-selection-modal-content">
                        <span className="close" onClick={() => setShowProfileImgSelectionModal(false)} style={{ color: 'red' }}>&times;</span>
                        <h1>Select a Profile Picture</h1>
                        <div className="profile-pictures">
                            <h3>Country Flags:</h3>
                            <div className="flex-box">
                                {profileImgs.countryFlags.map((flag, index) => (
                                    <div className="image-cont flag" key={index} onClick={() => handleChangeProfilePicture(flag)}>
                                        <img src={flag} alt="Flag" className="image" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="profile-pictures">
                            <h3>Driver Images:</h3>
                            <div className="flex-box">
                                {profileImgs.driverImages.map((driver, index) => (
                                    <div className="image-cont" key={index} onClick={() => handleChangeProfilePicture(driver)}>
                                        <img src={driver} alt="Driver" className="image" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="profile-pictures">
                            <h3>Team Badges:</h3>
                            <div className="flex-box">
                                {profileImgs.teamBadges.map((team, index) => (
                                    <div className="image-cont team" key={index} onClick={() => handleChangeProfilePicture(team)}>
                                        <img src={team} alt="Team" className="image" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="profile">
                <div className="profile-picture">
                    {profilePicture ? (
                        <img className="image" src={profilePicture} alt="Profile" onClick={() => setShowProfileImgSelectionModal(true)} />
                    ) : (
                        <div className="image" style={{ backgroundColor: 'grey' }} onClick={() => setShowProfileImgSelectionModal(true)}>
                            <p>Select Image</p>
                        </div>
                    )}
                </div>
                <div className="info">
                    <p><span className='detail'>Name:</span>{user.forename} {user.surname}</p>
                    <p><span className='detail'>Username:</span>{user.username}</p>
                    <p><span className='detail'>Email:</span>{user.email}</p>
                </div>
                <button className="btn btn-white" onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    )
}