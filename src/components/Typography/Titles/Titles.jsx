import './titles.styles.css'

export const PrimaryHeading = ({ title, accentColour, backgroundColour, textColour }) => {
    return (
        <h1 className={`primary-heading accent-${accentColour} background-${backgroundColour} text-${textColour}`}>{title}</h1>
    )
}


export const UpperCaseTitle = ({ title, colour }) => {
    return (
        <h2 className={`uppercase-title ${colour}`}>{title}</h2>
    )
}