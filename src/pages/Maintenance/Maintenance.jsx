// Components
import { GearIcon } from '../../components/Icons/Icons'
// Styles
import './maintenance.styles.css'

export const MaintenancePage = () => {
    return (
        <div className="maintenance-page">
            <h1 style={{ marginBottom: '1rem' }}>Site undergoing maintenance...</h1>
            <GearIcon />
            <p style={{ marginTop: '1rem' }}>Gridlock is currently under maintenance. Please check back later.</p>
        </div>
    )
}