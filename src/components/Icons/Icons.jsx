import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser,
    faSun, 
    faCloud,
    faCloudRain,
    faCloudShowersHeavy,
    faLock, 
    faGear,
    faHome, 
    faArrowDown19, 
    faCalendarDay, 
    faRankingStar,
    faUser, 
    faAngleDown,
    faAngleUp,
    faArrowRight} from '@fortawesome/free-solid-svg-icons'


// Menu icons
export const UserIcon = () => {
    return (
        <FontAwesomeIcon icon={faUser} className='icon' />
    )
}
export const HomeIcon = () => {
    return (
        <FontAwesomeIcon icon={faHome} className='icon' />
    )
}
export const PredictorIcon = () => {
    return (
        <FontAwesomeIcon icon={faArrowDown19} className='icon' />
    )
}
export const CalendarIcon = () => {
    return (
        <FontAwesomeIcon icon={faCalendarDay} className='icon' />
    )
}
export const StandingsIcon = () => {
    return (
        <FontAwesomeIcon icon={faRankingStar} className='icon' />
    )
}
export const AccountIcon = () => {
    return (
        <FontAwesomeIcon icon={faCircleUser} className='icon' />
    )
}
export const RightArrowIcon = () => {
    return (
        <FontAwesomeIcon icon={faArrowRight} className='icon' />
    )
}


// Effect icons
export const LockIcon = () => {
    return (
        <FontAwesomeIcon icon={faLock} className='icon' />
    )
}
export const GearIcon = () => {
    return (
        <FontAwesomeIcon icon={faGear} className='icon' />
    )
}


// Weather icons
export const SunIcon = () => {
    return (
        <FontAwesomeIcon icon={faSun} className='icon' />
    )
}
export const CloudIcon = () => {
    return (
        <FontAwesomeIcon icon={faCloud} className='icon' />
    )
}
export const RainIcon = () => {
    return (
        <FontAwesomeIcon icon={faCloudRain} className='icon' />
    )
}
export const HeavyRainIcon = () => {
    return (
        <FontAwesomeIcon icon={faCloudShowersHeavy} className='icon' />
    )
}

// Other icons
export const DownChevronIcon = () => {
    return (
        <FontAwesomeIcon icon={faAngleDown} className='icon' />
    )
}
export const UpChevronIcon = () => {
    return (
        <FontAwesomeIcon icon={faAngleUp} className='icon' />
    )
}