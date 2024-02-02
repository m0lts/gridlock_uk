import { PrimaryHeading } from '../../components/Typography/Titles/Titles'
import './standings.styles.css'

export const Standings = () => {

    const globalStandings = Array.from({ length: 10 }, (_, index) => (
        <tr key={index}>
            <td className='col1'>{index + 1}</td>
            <td className='col2'>m0lts</td>
            <td className='col3'>150</td>
        </tr>
    ))

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
                    {globalStandings}
                </tbody>
            </table>
        </section>
    )
}