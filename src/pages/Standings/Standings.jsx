import { useEffect, useState } from 'react'
import { PrimaryHeading } from '../../components/Typography/Titles/Titles'
import './standings.styles.css'

export const Standings = () => {

    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const response = await fetch('/api/points/handlePointsCollection', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (response.status === 200) {
                    setLoading(false);
                    const responseData = await response.json();
                    setStandings(responseData.usersWithTotalPoints);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }   
        fetchStandings();
    }, [])

    const sortedStandings = [...standings].sort((a, b) => b.totalPoints - a.totalPoints);

    const globalStandings = sortedStandings.map((user, index) => {
        return (
            <tr key={index}>
                <td className='col1'>{index + 1}</td>
                <td className='col2'>{user.username}</td>
                <td className='col3'>{user.totalPoints}</td>
            </tr>
        );
    });

    return (
        <section className='standings page-padding bckgrd-black'>
            <PrimaryHeading
                title="Standings"
                accentColour="yellow"
                backgroundColour="white"
                textColour="black"
            />
            <table className="table">
                <thead className='head'>
                    <tr>
                        <th className='col1'>Position</th>
                        <th className='col2'>Username</th>
                        <th className='col3'>Points</th>
                    </tr>
                </thead>
                <tbody 
                    className="body"
                >
                    {loading ? (
                        <tr>
                            <td colSpan="3">Loading...</td>
                        </tr>
                    ) : (
                        standings.length === 0 ? (
                            <tr>
                                <td colSpan="3">No standings available.</td>
                            </tr>
                        ) : (
                            globalStandings
                        )
                    )}
                </tbody>
            </table>
        </section>
    )
}