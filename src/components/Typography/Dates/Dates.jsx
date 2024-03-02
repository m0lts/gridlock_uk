import './dates.styles.css'

export const PrimaryDate = ({ date, colour }) => {
    return (
        <p className={`primary-date ${colour}`}>{date}</p>
    )
}